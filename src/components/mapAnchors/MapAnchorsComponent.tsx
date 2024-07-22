import { useContext, useState, useEffect, useRef } from "react";
import {
  IonPage,
  IonContent,
  useIonViewDidEnter,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButton,
  IonTitle,
  IonButtons,
  IonFooter,
  IonIcon,
  IonDatetimeButton,
  IonDatetime,
  IonToast,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { Marker, divIcon, Map as LeafletMap, tileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  closeOutline,
  homeOutline,
  layersOutline,
  mapOutline,
  alertCircleOutline,
} from "ionicons/icons";
import { arrangeDictionaries } from "./TimeLayering";

export const MapAnchorComponent = () => {
  // definition of functional components (hooks)
  // ------------------------------------------------------------------------------------------

  // anchors from the server (database)
  const { anchors } = useContext(AnchorContext);

  const [showModal, setShowModal] = useState(false); // status to open information modal

  const mapContainerRef = useRef<LeafletMap | null>(null); // reference map display
  const [mapIsLoad, setMapIsLoad] = useState<boolean>(false); // status whether map is loaded

  const [layerSettingsVisible, setLayerSettingVisible] = useState<boolean>(false); // status whether background settings visible
  const [layerFloorplanVisible, setLayerFloorplanVisible] = useState<boolean>(false); // status whether floorplan visible

  // functional components for filtering
  const [selectedDayFilter, setSelectedDayFilter] = useState<Date>(new Date()); // day
  const [selectedFloor, setSelectedFloor] = useState<number>(2); // floor
  const [startTimeFilter, setStartTimeFilter] = useState<number>(7); // starttime
  const [endTimeFilter, setEndTimeFilter] = useState<number>(18); // endtime

  const [showToastAnchorNoPos, setShowToastAnchorNoPos] = useState<boolean>(false); // status for warning with anchor without spatial assignment

  // by entering the view resize
  useIonViewDidEnter(() => {
    setMapIsLoad(false);
    window.dispatchEvent(new Event("resize"));
  });

  // update the timeline after initializing the anchors
  useEffect(() => {
    updateAnchorInTimeline();
  }, [anchors]);

  // update the map after initialiting map and anchors
  useEffect(() => {
    if (mapContainerRef.current && anchors.length > 0) {
      updateAnchorOnMap();
    }
  }, [mapIsLoad, anchors]);

  // functions (pipelines) for the map background
  // ------------------------------------------------------------------------------------------

  // update the background, depending on the selection
  const updateMapBackground = () => {
    if (mapContainerRef.current) {
      // remove all tile layers (background -> tilePane)
      mapContainerRef.current.eachLayer((layer) => {
        if (layer.options.pane === "tilePane") {
          mapContainerRef.current!.removeLayer(layer);
        }
      });
      // select background (inverted, as definition after selection)
      if (layerFloorplanVisible === true) {
        // cadastral surveying
        const bgLayerAV = backgroundLayerAmtlicheVermessung();
        bgLayerAV.addTo(mapContainerRef.current);
        // foorplan
        const bgLayerFP = backgroundLayerFloorplan(selectedFloor);
        bgLayerFP.addTo(mapContainerRef.current);
      } else {
        // pixelmap
        const bgLayerPM = backgroundLayerPixelKarte();
        bgLayerPM.addTo(mapContainerRef.current);
      }
    }
  };

  // definition of the connection to the floorplans (wms)
  function backgroundLayerFloorplan(floor: number) {
    const bgLayerFloorPlan = tileLayer.wms("http://localhost:8080/geoserver/wms?", {
      layers: "campus-v-p:floor_" + floor.toString() + "_modifiziert",
      format: "image/png",
      transparent: true,
      version: "1.1.0",
      minZoom: 18,
      maxZoom: 22,
      attribution:
        "<a href = 'https://www.baudokumentation.ch/projekt/fhnw-campus-muttenz/734718'>Schweizer Baudokumentation</a>",
    });
    return bgLayerFloorPlan;
  }

  // definition of the connection to the cadastral surveying (wms)
  function backgroundLayerAmtlicheVermessung() {
    const bgLayerAmtlicheVermessung = tileLayer.wms(
      "https://wfs.geodienste.ch/av_situationsplan_0/deu?",
      {
        layers:
          "single_objects_surface_elements_underground,single_objects_surface_elements_without_underground,single_objects_surface_elements_underground_outline,single_objects_linear_elements,single_objects_point_elements,land_cover_surface,land_cover_surface_water,land_cover_surface_project,land_cover_surface_building,land_cover_surface_project_buildings,locality_labels,house_addresses",
        format: "image/png",
        minZoom: 7.5,
        maxZoom: 22,
        attribution: "<a href = 'https://www.geodienste.ch/'>geodienste.ch</a>",
      },
    );
    return bgLayerAmtlicheVermessung;
  }

  // definition of the connection to the pixelkarte-farbe (wms)
  function backgroundLayerPixelKarte() {
    const bgLayerPixelMap = tileLayer.wms("https://wms.geo.admin.ch/?", {
      layers: "ch.swisstopo.pixelkarte-farbe",
      format: "image/jpeg",
      detectRetina: true,
      minZoom: 7.5,
      maxZoom: 20,
      attribution:
        "<a href = 'https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>",
    });
    return bgLayerPixelMap;
  }

  // functions (pipelines) to filter out only the important anchors from the server
  // ------------------------------------------------------------------------------------------

  // function to check whether an appointment starts on the selected day or before
  function startsOnSameDayOrBevor(selDate: Date, date: Date) {
    return (
      date.getFullYear() <= selDate.getFullYear() &&
      date.getMonth() <= selDate.getMonth() &&
      date.getDate() <= selDate.getDate()
    );
  }

  // function to check whether an appointment ends on the selected day or later
  function endsOnSameDayOrLater(selDate: Date, date: Date) {
    return (
      date.getFullYear() >= selDate.getFullYear() &&
      date.getMonth() >= selDate.getMonth() &&
      date.getDate() >= selDate.getDate()
    );
  }

  // filter the anchors from the server with the settings
  const filterAnchorFromServer = (serverAnchorData: any) => {
    // list of anchors that match the filters
    var filteredAnchorListHasDate: any = [];
    var filteredAnchorListHasDateWrongTime: any = []; // right day but wrong time
    var filteredAnchorListHasDateWrongFloor: any = [];
    var filteredAnchorListIsValid: any = [];
    var filteredAnchorListIsValidWrongTime: any = []; // right day but wrong time
    var filteredAnchorListIsValidWrongFloor: any = [];
    for (const anchor of serverAnchorData) {
      // filter for selected tags / for selected groups
      const tagFilter: any = JSON.parse(
        localStorage.getItem("campus_v_p_selTags") || "[]",
      );
      const groupFilter: any = JSON.parse(
        localStorage.getItem("campus_v_p_selGroups") || "[]",
      );
      if (
        anchor?.tags?.some((element: string) => tagFilter.includes(element)) ||
        groupFilter.includes(anchor.group_id) ||
        (tagFilter.length == 0 && groupFilter.length == 0)
      ) {
        // filter for anchors for the selected day
        const startDate: Date = new Date(anchor.start_at);
        const endDate: Date = new Date(anchor.end_at);
        const startValid: Date = new Date(anchor.valid_from);
        const endValid: Date = new Date(anchor.valid_until);
        // appointment
        if (
          startsOnSameDayOrBevor(selectedDayFilter, startDate) &&
          endsOnSameDayOrLater(selectedDayFilter, endDate)
        ) {
          // filter for selected filter for start and end time
          var anchorStartTime =
            selectedDayFilter.getDate() === startDate.getDate()
              ? startDate.getHours() + startDate.getMinutes() / 60
              : 0;
          var anchorEndTime =
            selectedDayFilter.getDate() === endDate.getDate()
              ? endDate.getHours() + endDate.getMinutes() / 60
              : 23.999;
          if (anchorStartTime < endTimeFilter && anchorEndTime > startTimeFilter) {
            // filter for selected floor
            if (anchor.floor_nr === selectedFloor) {
              filteredAnchorListHasDate.push(anchor);
            } else {
              filteredAnchorListHasDateWrongFloor.push(anchor);
            }
          } else {
            filteredAnchorListHasDateWrongTime.push(anchor);
          }
        }
        // validity
        if (
          startsOnSameDayOrBevor(selectedDayFilter, startValid) &&
          endsOnSameDayOrLater(selectedDayFilter, endValid)
        ) {
          // filter for selected filter for start and end time
          var anchorStartValid =
            selectedDayFilter.getDate() === startValid.getDate()
              ? startValid.getHours() + startValid.getMinutes() / 60
              : 0;
          var anchorEndValid =
            selectedDayFilter.getDate() === endValid.getDate()
              ? endValid.getHours() + endValid.getMinutes() / 60
              : 23.999;
          if (anchorStartValid < endTimeFilter && anchorEndValid > startTimeFilter) {
            // filter for selected floor
            if (anchor.floor_nr === selectedFloor) {
              filteredAnchorListIsValid.push(anchor);
            } else {
              filteredAnchorListIsValidWrongFloor.push(anchor);
            }
          } else {
            filteredAnchorListIsValidWrongTime.push(anchor);
          }
        }
      }
    }
    // ensure that anchors are not displayed twice
    // remove anchors that have an appointment in the selected time and are valid
    const idsInFilteredAnchorListHasDate = new Set(
      filteredAnchorListHasDate.map((d: any) => d.id),
    );
    filteredAnchorListIsValid = filteredAnchorListIsValid.filter(
      (d: any) => !idsInFilteredAnchorListHasDate.has(d.id),
    );
    const idsInFilteredAnchorListHasDateWrongFloor = new Set(
      filteredAnchorListHasDateWrongFloor.map((d: any) => d.id),
    );
    filteredAnchorListIsValidWrongFloor = filteredAnchorListIsValidWrongFloor.filter(
      (d: any) => !idsInFilteredAnchorListHasDateWrongFloor.has(d.id),
    );
    // retrun lists
    return [
      filteredAnchorListHasDate,
      filteredAnchorListHasDateWrongTime,
      filteredAnchorListHasDateWrongFloor,
      filteredAnchorListIsValid,
      filteredAnchorListIsValidWrongTime,
      filteredAnchorListIsValidWrongFloor,
    ];
  };

  // functions (pipelines) to display the anchors on the map
  // ------------------------------------------------------------------------------------------

  // create the style of the marker
  const createMarkerStyle = (
    color: string = "#44a2fa",
    rotation: string = "45deg",
    uidAnchor: string = "",
    size: number = 3,
  ) => {
    const customMarkerStyle = `
      background-color: ${color};
      width: ${size + "rem"};
      height: ${size + "rem"};
      display: block;
      left: ${-size / 2 + "rem"};
      top: ${-size / 2 + "rem"};
      position: relative;
      border-radius: ${size + "rem"} ${size + "rem"} 0;
      transform: rotate(${rotation});
      border: 1px solid #FFFFFF`;
    const customIcon = divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      attribution: uidAnchor,
      html: `<span style="${customMarkerStyle}" />`,
    });
    return customIcon;
  };

  // calculate the orientation and position of a marker (mainly when anchor is outside the visible range)
  const calculateMarkerOrientation = (
    anchor: any,
    mapCenter: any,
    mapBoundLeft: number,
    mapBoundRight: number,
    mapBoundTop: number,
    mapBoundBottom: number,
  ) => {
    const rotation =
      (Math.atan2(mapCenter.lng - anchor.lon, mapCenter.lat - anchor.lat) / Math.PI) *
        180 +
      45;
    const positionLon = () => {
      if (mapCenter.lng - anchor.lon >= mapCenter.lng - mapBoundLeft) {
        return mapBoundLeft;
      } else if (mapCenter.lng - anchor.lon <= mapCenter.lng - mapBoundRight) {
        return mapBoundRight;
      } else {
        return anchor.lon;
      }
    };
    const positionLat = () => {
      if (mapCenter.lat - anchor.lat >= mapCenter.lat - mapBoundBottom) {
        return mapBoundBottom;
      } else if (mapCenter.lat - anchor.lat <= mapCenter.lat - mapBoundTop) {
        return mapBoundTop;
      } else {
        return anchor.lat;
      }
    };
    return [positionLat(), positionLon(), rotation];
  };

  // add anchor to the map and display it
  const addMarkerToMap = (
    anchor: any,
    mapCenter: any,
    mapBounds: any,
    color: string,
    size: number,
  ) => {
    // check if lat and lon exists
    if (anchor.lat != null && anchor.lon != null) {
      // calculation of the display margins of the map (depending on marker size)
      const mapBoundLeft =
        mapBounds.getSouthWest().lng +
        (Math.abs(mapBounds.getSouthWest().lng - mapBounds.getNorthEast().lng) /
          document.getElementById("mapContainer")!.clientWidth) *
          ((size / 2) * 16) *
          Math.sqrt(2);
      const mapBoundRight =
        mapBounds.getNorthEast().lng -
        (Math.abs(mapBounds.getSouthWest().lng - mapBounds.getNorthEast().lng) /
          document.getElementById("mapContainer")!.clientWidth) *
          ((size / 2) * 16) *
          Math.sqrt(2);
      const mapBoundTop =
        mapBounds.getNorthEast().lat -
        (Math.abs(mapBounds.getSouthWest().lat - mapBounds.getNorthEast().lat) /
          document.getElementById("mapContainer")!.clientHeight) *
          ((size / 2) * 16) *
          (3 / size + Math.sqrt(2));
      const mapBoundBottom =
        mapBounds.getSouthWest().lat +
        (Math.abs(mapBounds.getSouthWest().lat - mapBounds.getNorthEast().lat) /
          document.getElementById("mapContainer")!.clientHeight) *
          ((size / 2) * 16) *
          (-(3 / size) + Math.sqrt(2));
      //if anchor in display borders
      if (
        anchor.lat >= mapBoundBottom &&
        anchor.lat <= mapBoundTop &&
        anchor.lon >= mapBoundLeft &&
        anchor.lon <= mapBoundRight
      ) {
        const mapPositionMarker = new Marker([anchor.lat, anchor.lon], {
          icon: createMarkerStyle(color, "45deg", anchor.id, size),
        });
        mapPositionMarker.addEventListener("click", (e) => {
          setShowModal(true);
          openAnchorInformation(e, anchor.id);
        });
        mapPositionMarker.addTo(mapContainerRef.current!); // add to map;
      }
      // calculate position and rotation of anchor icon (anchor not in display borders)
      else {
        var markerOrientation = calculateMarkerOrientation(
          anchor,
          mapCenter,
          mapBoundLeft,
          mapBoundRight,
          mapBoundTop,
          mapBoundBottom,
        );
        var mapPositionMarker = new Marker([markerOrientation[0], markerOrientation[1]], {
          icon: createMarkerStyle(color, markerOrientation[2] + "deg", anchor.id, size),
        });
        mapPositionMarker.addEventListener("click", (e) => {
          mapContainerRef.current!.panTo([anchor.lat, anchor.lon]);
        });
        mapPositionMarker.addTo(mapContainerRef.current!);
      }
    }
  };

  // update the displayed anchors when settings are changed
  const updateAnchorOnMap = () => {
    // filtered anchors
    const filteredAnchorData = filterAnchorFromServer(anchors);
    // remove all marker (anchor) from the map
    mapContainerRef.current!.eachLayer((layer) => {
      if (layer.options.pane === "markerPane") {
        mapContainerRef.current!.removeLayer(layer);
      }
    });
    // get information from the display
    const mapCenter = mapContainerRef.current!.getCenter();
    const mapBounds = mapContainerRef.current!.getBounds();
    // if the floorplan is not displayed
    if (layerFloorplanVisible === false) {
      // anchor with a validity in the selected period (no appointment!)
      for (const anchor of filteredAnchorData[3].concat(filteredAnchorData[5])) {
        addMarkerToMap(anchor, mapCenter, mapBounds, "#9c9c9c", 4);
      }
      //anchor with a date within the selected time period (possibly also a validity)
      for (const anchor of filteredAnchorData[0].concat(filteredAnchorData[2])) {
        addMarkerToMap(anchor, mapCenter, mapBounds, "#44a2fa", 4);
      }
    }
    // if floorplan ist displayed
    else {
      // anchor with a validity in the selected period on a wrong floor (no appointment!)
      for (const anchor of filteredAnchorData[5]) {
        addMarkerToMap(anchor, mapCenter, mapBounds, "#9c9c9c", 3);
      }
      // anchor with a validity in the selected period on the selected floor (no appointment!)
      for (const anchor of filteredAnchorData[3]) {
        addMarkerToMap(anchor, mapCenter, mapBounds, "#9c9c9c", 4);
      }
      //anchor with a date within the selected time period on a wrong floor (possibly also a validity)
      for (const anchor of filteredAnchorData[2]) {
        addMarkerToMap(anchor, mapCenter, mapBounds, "#44a2fa", 3);
      }
      //anchor with a date within the selected time period on the selected floor (possibly also a validity)
      for (const anchor of filteredAnchorData[0]) {
        addMarkerToMap(anchor, mapCenter, mapBounds, "#44a2fa", 4);
      }
    }
  };

  // open modal with all anchor information
  function openAnchorInformation(clickEvent: any, anchorID: any) {
    // get filtered Anchors
    const filteredAnchorData = filterAnchorFromServer(anchors);
    //show the information overlay
    //setShowModal(true);
    const informationContentModal = document.getElementById("dialogAnchorInfo")!;
    informationContentModal.innerHTML = "";
    // add header to the modal
    const header = document.createElement("ion-header");
    const toolbar = document.createElement("ion-toolbar");
    const title = document.createElement("ion-title");
    title.innerText = "Informationen Anker";
    toolbar.appendChild(title);
    const buttons = document.createElement("ion-buttons");
    buttons.slot = "end";
    const closeButton = document.createElement("ion-button");
    closeButton.addEventListener("click", () => {
      const modal = document.getElementById("dialogAnchorInfo");
      if (modal) {
        (modal as HTMLIonModalElement).dismiss();
      }
    });
    const closeIcon = document.createElement("ion-icon");
    closeIcon.icon = closeOutline;
    closeIcon.size = "large";
    closeButton.appendChild(closeIcon);
    buttons.appendChild(closeButton);
    toolbar.appendChild(buttons);
    header.appendChild(toolbar);
    informationContentModal.appendChild(header);
    const informationContent = document.createElement("ion-content");
    informationContent.setAttribute("class", "ion-padding");
    // get all anchors on this position
    const markerposition = clickEvent.target._latlng;
    // list anchor which have an appointment in the time
    for (const anchor of filteredAnchorData[0].concat(filteredAnchorData[2])) {
      // all anchors on this position
      if (anchor.lat == markerposition.lat && anchor.lon == markerposition.lng) {
        // create a item for display all information
        const anchorInfo = document.createElement("ion-grid");
        anchorInfo.style.color = "#000000";
        anchorInfo.style.marginBottom = "16px";
        anchorInfo.style.paddingLeft = "16px";
        anchorInfo.style.paddingRight = "16px";
        anchorInfo.style.backgroundColor = "#f6f8fc";
        // name
        const anchorInfoName = document.createElement("ion-title");
        anchorInfoName.style.paddingLeft = "0px";
        anchorInfoName.innerHTML = anchor.anchor_name;
        anchorInfo.appendChild(anchorInfoName);
        // description
        const anchorInfoDescrib = document.createElement("ion-note");
        anchorInfoDescrib.innerHTML =
          anchor.anchor_description != "" ? anchor.anchor_description : "";
        anchorInfo.appendChild(anchorInfoDescrib);
        // place
        const anchorInfoPlace = document.createElement("ion-row");
        anchorInfoPlace.style.paddingTop = "8px";
        const anchorInfoPlaceLabel = document.createElement("ion-col");
        anchorInfoPlaceLabel.innerHTML = "Ort:";
        anchorInfoPlaceLabel.setAttribute("size", "4");
        const anchorInfoPlaceValue = document.createElement("ion-col");
        anchorInfoPlaceValue.innerHTML =
          anchor.room_id != ""
            ? anchor.room_id
            : anchor.lat.toFixed(5) + " / " + anchor.lon.toFixed(5);
        anchorInfoPlace.appendChild(anchorInfoPlaceLabel);
        anchorInfoPlace.appendChild(anchorInfoPlaceValue);
        anchorInfo.appendChild(anchorInfoPlace);
        // time start
        const anchorInfoStart = document.createElement("ion-row");
        const anchorInfoStartLabel = document.createElement("ion-col");
        anchorInfoStartLabel.innerHTML = "Start:";
        anchorInfoStartLabel.setAttribute("size", "4");
        const anchorInfoStartValue = document.createElement("ion-col");
        const startDate = anchor.start_at != undefined ? new Date(anchor.start_at) : "";
        anchorInfoStartValue.innerHTML =
          startDate == ""
            ? ""
            : startDate.getDate() +
              "." +
              Number(startDate.getMonth() + 1) +
              "." +
              startDate.getFullYear() +
              ", " +
              startDate.getHours() +
              ":" +
              startDate.getMinutes().toString().padStart(2, "0") +
              " Uhr";
        anchorInfoStart.appendChild(anchorInfoStartLabel);
        anchorInfoStart.appendChild(anchorInfoStartValue);
        anchorInfo.appendChild(anchorInfoStart);
        // time end
        const anchorInfoEnd = document.createElement("ion-row");
        const anchorInfoEndLabel = document.createElement("ion-col");
        anchorInfoEndLabel.innerHTML = "Ende:";
        anchorInfoEndLabel.setAttribute("size", "4");
        const anchorInfoEndValue = document.createElement("ion-col");
        const endDate = anchor.end_at != undefined ? new Date(anchor.end_at) : "";
        anchorInfoEndValue.innerHTML =
          endDate == ""
            ? ""
            : endDate.getDate() +
              "." +
              Number(endDate.getMonth() + 1) +
              "." +
              endDate.getFullYear() +
              ", " +
              endDate.getHours() +
              ":" +
              endDate.getMinutes().toString().padStart(2, "0") +
              " Uhr";
        anchorInfoEnd.appendChild(anchorInfoEndLabel);
        anchorInfoEnd.appendChild(anchorInfoEndValue);
        anchorInfo.appendChild(anchorInfoEnd);
        // valid start
        const anchorInfoStartV = document.createElement("ion-row");
        const anchorInfoStartVLabel = document.createElement("ion-col");
        anchorInfoStartVLabel.innerHTML = "Gültig ab:";
        anchorInfoStartVLabel.setAttribute("size", "4");
        const anchorInfoStartVValue = document.createElement("ion-col");
        const startVDate =
          anchor.valid_from != undefined ? new Date(anchor.valid_from) : "";
        anchorInfoStartVValue.innerHTML =
          startVDate == ""
            ? ""
            : startVDate.getDate() +
              "." +
              Number(startVDate.getMonth() + 1) +
              "." +
              startVDate.getFullYear() +
              ", " +
              startVDate.getHours() +
              ":" +
              startVDate.getMinutes().toString().padStart(2, "0") +
              " Uhr";
        anchorInfoStartV.appendChild(anchorInfoStartVLabel);
        anchorInfoStartV.appendChild(anchorInfoStartVValue);
        anchorInfo.appendChild(anchorInfoStartV);
        // valid end
        const anchorInfoEndV = document.createElement("ion-row");
        const anchorInfoEndVLabel = document.createElement("ion-col");
        anchorInfoEndVLabel.innerHTML = "Gültig bis:";
        anchorInfoEndVLabel.setAttribute("size", "4");
        const anchorInfoEndVValue = document.createElement("ion-col");
        const endVDate =
          anchor.valid_until != undefined ? new Date(anchor.valid_until) : "";
        anchorInfoEndVValue.innerHTML =
          endVDate == ""
            ? ""
            : endVDate.getDate() +
              "." +
              Number(endVDate.getMonth() + 1) +
              "." +
              endVDate.getFullYear() +
              ", " +
              endVDate.getHours() +
              ":" +
              endVDate.getMinutes().toString().padStart(2, "0") +
              " Uhr";
        anchorInfoEndV.appendChild(anchorInfoEndVLabel);
        anchorInfoEndV.appendChild(anchorInfoEndVValue);
        anchorInfo.appendChild(anchorInfoEndV);
        // documents
        const anchorInfoDocument = document.createElement("ion-row");
        const anchorInfoDocumentLabel = document.createElement("ion-col");
        anchorInfoDocumentLabel.innerHTML = "Dokumente:";
        anchorInfoDocumentLabel.setAttribute("size", "4");
        const anchorInfoDocumentValue = document.createElement("ion-col");
        var htmlString = "";
        if (anchor.attachments.length > 0) {
          for (const attachement of anchor.attachments) {
            htmlString +=
              '<a style="color:#000000" href="' +
              attachement +
              '">' +
              attachement +
              "</a> ";
          }
        }
        anchorInfoDocumentValue.innerHTML = htmlString;
        anchorInfoDocument.appendChild(anchorInfoDocumentLabel);
        anchorInfoDocument.appendChild(anchorInfoDocumentValue);
        anchorInfo.appendChild(anchorInfoDocument);
        // add all informations to the display
        informationContent.appendChild(anchorInfo);
      }
    }
    // list anchor which have a validity in the time
    for (const anchor of filteredAnchorData[3].concat(filteredAnchorData[5])) {
      // all anchors on this position
      if (anchor.lat == markerposition.lat && anchor.lon == markerposition.lng) {
        // create a item for display all information
        const anchorInfo = document.createElement("ion-grid");
        anchorInfo.style.color = "#8c8c8c";
        anchorInfo.style.marginBottom = "16px";
        anchorInfo.style.paddingLeft = "16px";
        anchorInfo.style.paddingRight = "16px";
        anchorInfo.style.backgroundColor = "#f6f8fc";
        // name
        const anchorInfoName = document.createElement("ion-title");
        anchorInfoName.style.paddingLeft = "0px";
        anchorInfoName.innerHTML = anchor.anchor_name;
        anchorInfo.appendChild(anchorInfoName);
        // description
        const anchorInfoDescrib = document.createElement("ion-note");
        anchorInfoDescrib.innerHTML =
          anchor.anchor_description != "" ? anchor.anchor_description : "";
        anchorInfo.appendChild(anchorInfoDescrib);
        // place
        const anchorInfoPlace = document.createElement("ion-row");
        anchorInfoPlace.style.paddingTop = "8px";
        const anchorInfoPlaceLabel = document.createElement("ion-col");
        anchorInfoPlaceLabel.innerHTML = "Ort:";
        anchorInfoPlaceLabel.setAttribute("size", "4");
        const anchorInfoPlaceValue = document.createElement("ion-col");
        anchorInfoPlaceValue.innerHTML =
          anchor.room_id != ""
            ? anchor.room_id
            : anchor.lat.toFixed(5) + " / " + anchor.lon.toFixed(5);
        anchorInfoPlace.appendChild(anchorInfoPlaceLabel);
        anchorInfoPlace.appendChild(anchorInfoPlaceValue);
        anchorInfo.appendChild(anchorInfoPlace);
        // time start
        const anchorInfoStart = document.createElement("ion-row");
        const anchorInfoStartLabel = document.createElement("ion-col");
        anchorInfoStartLabel.innerHTML = "Start:";
        anchorInfoStartLabel.setAttribute("size", "4");
        const anchorInfoStartValue = document.createElement("ion-col");
        const startDate = anchor.start_at != undefined ? new Date(anchor.start_at) : "";
        anchorInfoStartValue.innerHTML =
          startDate == ""
            ? ""
            : startDate.getDate() +
              "." +
              Number(startDate.getMonth() + 1) +
              "." +
              startDate.getFullYear() +
              ", " +
              startDate.getHours() +
              ":" +
              startDate.getMinutes().toString().padStart(2, "0") +
              " Uhr";
        anchorInfoStart.appendChild(anchorInfoStartLabel);
        anchorInfoStart.appendChild(anchorInfoStartValue);
        anchorInfo.appendChild(anchorInfoStart);
        // time end
        const anchorInfoEnd = document.createElement("ion-row");
        const anchorInfoEndLabel = document.createElement("ion-col");
        anchorInfoEndLabel.innerHTML = "Ende:";
        anchorInfoEndLabel.setAttribute("size", "4");
        const anchorInfoEndValue = document.createElement("ion-col");
        const endDate = anchor.end_at != undefined ? new Date(anchor.end_at) : "";
        anchorInfoEndValue.innerHTML =
          endDate == ""
            ? ""
            : endDate.getDate() +
              "." +
              Number(endDate.getMonth() + 1) +
              "." +
              endDate.getFullYear() +
              ", " +
              endDate.getHours() +
              ":" +
              endDate.getMinutes().toString().padStart(2, "0") +
              " Uhr";
        anchorInfoEnd.appendChild(anchorInfoEndLabel);
        anchorInfoEnd.appendChild(anchorInfoEndValue);
        anchorInfo.appendChild(anchorInfoEnd);
        // valid start
        const anchorInfoStartV = document.createElement("ion-row");
        const anchorInfoStartVLabel = document.createElement("ion-col");
        anchorInfoStartVLabel.innerHTML = "Gültig ab:";
        anchorInfoStartVLabel.setAttribute("size", "4");
        const anchorInfoStartVValue = document.createElement("ion-col");
        const startVDate =
          anchor.valid_from != undefined ? new Date(anchor.valid_from) : "";
        anchorInfoStartVValue.innerHTML =
          startVDate == ""
            ? ""
            : startVDate.getDate() +
              "." +
              Number(startVDate.getMonth() + 1) +
              "." +
              startVDate.getFullYear() +
              ", " +
              startVDate.getHours() +
              ":" +
              startVDate.getMinutes().toString().padStart(2, "0") +
              " Uhr";
        anchorInfoStartV.appendChild(anchorInfoStartVLabel);
        anchorInfoStartV.appendChild(anchorInfoStartVValue);
        anchorInfo.appendChild(anchorInfoStartV);
        // valid end
        const anchorInfoEndV = document.createElement("ion-row");
        const anchorInfoEndVLabel = document.createElement("ion-col");
        anchorInfoEndVLabel.innerHTML = "Gültig bis:";
        anchorInfoEndVLabel.setAttribute("size", "4");
        const anchorInfoEndVValue = document.createElement("ion-col");
        const endVDate =
          anchor.valid_until != undefined ? new Date(anchor.valid_until) : "";
        anchorInfoEndVValue.innerHTML =
          endVDate == ""
            ? ""
            : endVDate.getDate() +
              "." +
              Number(endVDate.getMonth() + 1) +
              "." +
              endVDate.getFullYear() +
              ", " +
              endVDate.getHours() +
              ":" +
              endVDate.getMinutes().toString().padStart(2, "0") +
              " Uhr";
        anchorInfoEndV.appendChild(anchorInfoEndVLabel);
        anchorInfoEndV.appendChild(anchorInfoEndVValue);
        anchorInfo.appendChild(anchorInfoEndV);
        // documents
        const anchorInfoDocument = document.createElement("ion-row");
        const anchorInfoDocumentLabel = document.createElement("ion-col");
        anchorInfoDocumentLabel.innerHTML = "Dokumente:";
        anchorInfoDocumentLabel.setAttribute("size", "4");
        const anchorInfoDocumentValue = document.createElement("ion-col");
        var htmlString = "";
        if (anchor.attachments.length > 0) {
          for (const attachement of anchor.attachments) {
            htmlString +=
              '<a style="color:#8c8c8c" href="' +
              attachement +
              '">' +
              attachement +
              "</a> ";
          }
        }
        anchorInfoDocumentValue.innerHTML = htmlString;
        anchorInfoDocument.appendChild(anchorInfoDocumentLabel);
        anchorInfoDocument.appendChild(anchorInfoDocumentValue);
        anchorInfo.appendChild(anchorInfoDocument);
        // add all informations to the display
        informationContent.appendChild(anchorInfo);
      }
    }
    informationContentModal.appendChild(informationContent);
    const footer = document.createElement("ion-footer");
    footer.setAttribute("class", "ion-padding");
    const closeButtonF = document.createElement("ion-button");
    closeButtonF.setAttribute("expand", "full");
    closeButtonF.innerHTML = "OK";
    closeButtonF.addEventListener("click", () => {
      const modal = document.getElementById("dialogAnchorInfo");
      if (modal) {
        (modal as HTMLIonModalElement).dismiss();
      }
    });
    footer.appendChild(closeButtonF);
    informationContentModal.appendChild(footer);
  }

  // update map content if map is moved
  function GetInformationDisplayedMap() {
    const map = useMapEvents({
      move: (e) => {
        updateAnchorOnMap();
      },
      resize: (e) => {
        setMapIsLoad(true);
      },
    });
    return null;
  }

  // functions (pipelines) to manage the control elements of the map display
  // ------------------------------------------------------------------------------------------

  // add - remove buttons for layer selection
  const switchLayerSelection = () => {
    if (layerSettingsVisible) {
      setLayerSettingVisible(false);
      (document.getElementById("layerMenuButton")! as HTMLIonButtonElement).setAttribute(
        "color",
        "primary",
      );
      document.getElementById("layerMenuButtonST")!.style.zIndex = "-400";
      document.getElementById("layerMenuButtonFP")!.style.zIndex = "-400";
      document.getElementById("layerMenuFloorSlider")!.style.zIndex = "-400";
    } else {
      setLayerSettingVisible(true);
      (document.getElementById("layerMenuButton")! as HTMLIonButtonElement).setAttribute(
        "color",
        "tertiary",
      );
      document.getElementById("layerMenuButtonST")!.style.zIndex = "400";
      document.getElementById("layerMenuButtonFP")!.style.zIndex = "400";
      if (layerFloorplanVisible) {
        document.getElementById("layerMenuFloorSlider")!.style.zIndex = "400";
      }
    }
  };

  // switch to pixelkarte-farbe
  const selectBackgroundST = () => {
    if (layerFloorplanVisible === true) {
      setLayerFloorplanVisible(false);
      (
        document.getElementById("layerMenuButtonST")! as HTMLIonButtonElement
      ).setAttribute("color", "tertiary");
      (
        document.getElementById("layerMenuButtonFP")! as HTMLIonButtonElement
      ).setAttribute("color", "primary");
      document.getElementById("layerMenuFloorSlider")!.style.zIndex = "-400";
    }
  };

  // switch to floorplan and cadastral surveying
  const selectBackgroundFP = () => {
    if (layerFloorplanVisible === false) {
      setLayerFloorplanVisible(true);
      (
        document.getElementById("layerMenuButtonST")! as HTMLIonButtonElement
      ).setAttribute("color", "primary");
      (
        document.getElementById("layerMenuButtonFP")! as HTMLIonButtonElement
      ).setAttribute("color", "tertiary");
      document.getElementById("layerMenuFloorSlider")!.style.zIndex = "400";
    }
  };

  // change/add the display of selected floor (only while dragging)
  const floorSliderOnInput = (event: any) => {
    const slideValue = document.getElementById("floorSliderNumber")!;
    let value = event.target.value;
    slideValue.innerHTML = value;
    slideValue.style.bottom = -48.5 - (14 - (Number(value) + 2)) * 17.21 + "px"; // 300 + ((Number(value) +2) * 18) + "px";
    slideValue.style.transform = "scale(1)";
  };

  // remove display of selected floor
  const floorSliderOnBlur = () => {
    const slideValue = document.getElementById("floorSliderNumber")!;
    slideValue.style.transform = "scale(0)";
  };

  // update the map background and marker display when changing the floor selection
  useEffect(() => {
    updateMapBackground();
    if (mapContainerRef.current) {
      updateAnchorOnMap();
      updateAnchorInTimeline();
    }
  }, [selectedFloor, layerFloorplanVisible]);

  // functions (pipelines) to manage the timeline
  // ------------------------------------------------------------------------------------------

  // update the left slider (thumb)
  const timeSliderLeftOnInput = (event: any) => {
    const slideMarker = document.getElementById("TimeStampeLeftMarker")!;
    const slideValue = document.getElementById("TimeStampLeftNumber")!;
    let value = event.target.value;
    if (Number(value) < endTimeFilter) {
      slideMarker.style.left = Number(value) * 14 + 9.5 + "px";
      slideValue.innerHTML = value + ":00";
      slideMarker.style.transform = "translateY(-70px) scale(1)";
    }
  };

  // deactivate display of time after end of dragging -> not in use ...
  const timeSliderLeftOnBlur = () => {
    const slideMarker = document.getElementById("TimeStampeLeftMarker")!;
    slideMarker.style.transform = "translateY(-70px) scale(1)"; // scale should be 0 if deactivation is desired
  };

  // update the right slider (thumb)
  const timeSliderRightOnInput = (event: any) => {
    const slideMarker = document.getElementById("TimeStampeRightMarker")!;
    const slideValue = document.getElementById("TimeStampRightNumber")!;
    let value = event.target.value;
    if (Number(value) > startTimeFilter) {
      slideMarker.style.left = Number(value) * 14 + 9.5 + "px";
      slideValue.innerHTML = value + ":00";
      slideMarker.style.transform = "translateY(-70px) scale(1)";
    }
  };

  // deactivate display of time after end of dragging -> not in use ...
  const timeSliderRightOnBlur = () => {
    const slideMarker = document.getElementById("TimeStampeRightMarker")!;
    slideMarker.style.transform = "translateY(-70px) scale(1)"; // scale should be 0 if deactivation is desired
  };

  // update the timeline when settings changed
  const updateAnchorInTimeline = () => {
    const filteredTimeAnchor = filterAnchorFromServer(anchors)[0];
    const filteredTimeAnchorWrongTime = filterAnchorFromServer(anchors)[1];
    const filteredTimeAnchorWrongFloor = filterAnchorFromServer(anchors)[2];
    const anchorInTimeSelection = filteredTimeAnchor.concat(filteredTimeAnchorWrongFloor);
    const anchorOutTimeSelection = filteredTimeAnchorWrongTime;
    // sorting the anchors into an optimal layer structure with a minimum number of stacked layers
    function prepareDictForLayering(dictAnchors: any, displayTyp: string) {
      const dictListForLayeringTemp = [];
      for (const indivAnchor of dictAnchors) {
        var startTimeAnchor = new Date(indivAnchor.start_at);
        var endTimeAnchor = new Date(indivAnchor.end_at);
        dictListForLayeringTemp.push({
          id: indivAnchor.id,
          startTime:
            selectedDayFilter.getDate() === startTimeAnchor.getDate() &&
            selectedDayFilter.getMonth() === startTimeAnchor.getMonth()
              ? startTimeAnchor.getHours() + startTimeAnchor.getMinutes() / 60
              : 0,
          endTime:
            selectedDayFilter.getDate() === endTimeAnchor.getDate() &&
            selectedDayFilter.getMonth() === endTimeAnchor.getMonth()
              ? endTimeAnchor.getHours() + endTimeAnchor.getMinutes() / 60
              : 24,
          display: displayTyp,
          lat: indivAnchor.lat,
          lon: indivAnchor.lon,
          floor: indivAnchor.floor_nr,
        });
      }
      return dictListForLayeringTemp;
    }
    // retrieving all information for displaying the anchors in the timeline
    const anchorInTimeSelectionLayering = prepareDictForLayering(
      anchorInTimeSelection,
      "inTime",
    );
    const anchorOutTimeSelectionLayering = prepareDictForLayering(
      anchorOutTimeSelection,
      "outTime",
    );
    const dictListForLayering = anchorInTimeSelectionLayering.concat(
      anchorOutTimeSelectionLayering,
    );
    const displayLayering = arrangeDictionaries(dictListForLayering);
    const numberOfLayer = displayLayering.length;
    // add a backgroud to the selected timespace
    const timelineContainer = document.getElementById("anchorDisplaySlider")!;
    timelineContainer.innerHTML = "";
    const selectedTimeSpace = document.createElement("div");
    selectedTimeSpace.style.position = "absolute";
    selectedTimeSpace.style.background = "#f6f8fc";
    selectedTimeSpace.style.height = "84px";
    selectedTimeSpace.style.width =
      (335 / 24) * (Number(endTimeFilter) - Number(startTimeFilter)) + "px";
    selectedTimeSpace.style.top = "-8px";
    selectedTimeSpace.style.left = (335 / 24) * Number(startTimeFilter) + "px";
    timelineContainer.appendChild(selectedTimeSpace);
    // add vertical lines (each hour) to the display
    let i: number = 1;
    while (i < endTimeFilter - startTimeFilter) {
      const verticalLine = document.createElement("div");
      verticalLine.style.position = "absolute";
      verticalLine.style.background = "#dddddd";
      verticalLine.style.height = "60px";
      verticalLine.style.width = "2px";
      verticalLine.style.top = "0px";
      verticalLine.style.left =
        (335 / 24) * Number(startTimeFilter) + (335 / 24) * i - 1 + "px";
      timelineContainer.appendChild(verticalLine);
      i++;
    }
    // add anchors on display
    if (numberOfLayer > 0) {
      let i: number = 0;
      while (i < numberOfLayer) {
        for (const anchorObj of displayLayering[i]) {
          const anchorObjButton = document.createElement("button");
          anchorObjButton.style.position = "absolute";
          anchorObjButton.style.background =
            anchorObj.display == "inTime" ? "#44a2fa" : "#ffffff";
          anchorObjButton.style.borderRadius = "2px";
          anchorObjButton.style.border =
            anchorObj.display == "inTime" ? "2px solid #ffffff" : "2px dashed #44a2fa";
          anchorObjButton.style.height =
            (60 - (numberOfLayer - 1) * 6) / numberOfLayer + "px";
          anchorObjButton.style.width =
            (335 / 24) * (Number(anchorObj.endTime) - Number(anchorObj.startTime)) + "px";
          anchorObjButton.style.top =
            i * ((60 - (numberOfLayer - 1) * 6) / numberOfLayer + 6) + "px";
          anchorObjButton.style.left = (335 / 24) * Number(anchorObj.startTime) + "px";
          anchorObjButton.style.padding = "0px";
          anchorObjButton.style.margin = "0px";
          if (anchorObj.display == "inTime") {
            anchorObjButton.onclick = () => {
              zoomToSelectedAnchor(anchorObj.lat, anchorObj.lon, anchorObj.floor);
            };
          }
          timelineContainer.appendChild(anchorObjButton);
        }
        i++;
      }
    }
  };

  // zoom to the clicked anchor on timeline (update floorplan - if selected)
  const zoomToSelectedAnchor = (lat: number, lon: number, floor: number) => {
    try {
      if (layerFloorplanVisible && floor != undefined) {
        setSelectedFloor(floor);
      }
      mapContainerRef.current?.setView([lat, lon], 21);
    } catch {
      setShowToastAnchorNoPos(true);
    }
  };

  // update timeline and map display if inputs changed
  useEffect(() => {
    updateAnchorInTimeline();
    if (mapContainerRef.current) {
      updateAnchorOnMap();
    }
  }, [endTimeFilter, startTimeFilter, selectedDayFilter, selectedFloor]);

  // HTML output
  // ------------------------------------------------------------------------------------------
  return (
    <IonPage>
      <StatusHeader titleText="Karte" />
      <IonContent fullscreen>
        {/* map */}
        <MapContainer
          id="mapContainer"
          ref={mapContainerRef}
          center={[47.5349015179286, 7.6419409280402535]}
          zoom={18}
          maxBounds={[
            [45.8148308954386, 5.740290246442871],
            [47.967830538595194, 10.594475942663449],
          ]}
        >
          <WMSTileLayer
            url="https://wms.geo.admin.ch/?"
            layers="ch.swisstopo.pixelkarte-farbe"
            format="image/jpeg"
            detectRetina={true}
            minZoom={7.5}
            maxZoom={20}
            attribution="<a href = 'https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
          />
          <GetInformationDisplayedMap />
          {/* button background map settings */}
          <IonButton
            id="layerMenuButton"
            size="large"
            expand="block"
            fill="solid"
            onClick={switchLayerSelection}
          >
            <IonIcon icon={layersOutline} size="large"></IonIcon>
          </IonButton>
          {/* button background swisstopo */}
          <IonButton
            id="layerMenuButtonST"
            size="default"
            expand="block"
            fill="solid"
            onClick={selectBackgroundST}
          >
            <IonIcon icon={mapOutline} size="large"></IonIcon>
          </IonButton>
          {/* button background map floorplan */}
          <IonButton
            id="layerMenuButtonFP"
            size="default"
            expand="block"
            fill="solid"
            onClick={selectBackgroundFP}
          >
            <IonIcon icon={homeOutline} size="large"></IonIcon>
          </IonButton>
          {/* slider for floor selection */}
          <div id="layerMenuFloorSlider">
            <div className="range">
              <div className="sliderValue">
                <span id="floorSliderNumber">100</span>
              </div>
              <div className="field">
                <input
                  id="floorSliderSlider"
                  type="range"
                  min="-2"
                  max="12"
                  value={selectedFloor}
                  step="1"
                  onChange={(e) => setSelectedFloor(Number(e.target.value))}
                  onInput={(e) => {
                    floorSliderOnInput(e);
                  }}
                  // onBlur={() => floorSliderOnBlur()} -> don't work with touch
                  onMouseDown={() => mapContainerRef.current!.dragging.disable()}
                  onMouseUp={() => {
                    mapContainerRef.current!.dragging.enable();
                    floorSliderOnBlur();
                  }}
                  onMouseOut={() => mapContainerRef.current!.dragging.enable()}
                  onTouchStart={() => mapContainerRef.current!.dragging.disable()}
                  onTouchEnd={() => {
                    mapContainerRef.current!.dragging.enable();
                    floorSliderOnBlur();
                  }}
                ></input>
              </div>
            </div>
          </div>
        </MapContainer>
        {/* modal with information of the anchor at the selected location */}
        <IonModal
          id="dialogAnchorInfo"
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
        >
          {/* modal content goes here */}
        </IonModal>
      </IonContent>
      <IonFooter id="footerTimeLineFilter" class="ion-padding">
        <IonDatetimeButton
          id="filterMenuDateSelection"
          datetime="datetime"
        ></IonDatetimeButton>
        {/* slider for time filtering */}
        <div id="filterMenuTimeSlider">
          <div id="anchorDisplaySlider"></div>
          <div id="TimeSliderControl">
            {/* slider for selecting the start time  */}
            <div id="TimeStampeLeftMarker">
              <div id="TimeStampLeftNumber">7:00</div>
            </div>
            <input
              id="TimeStampLeft"
              className="TimeSlider"
              type="range"
              value={startTimeFilter}
              min="0"
              max="24"
              onInput={(e) => {
                timeSliderLeftOnInput(e);
              }}
              // onBlur={() => timeSliderLeftOnBlur()} -> don't work with touch
              onChange={(e) => {
                Number(e.target.value) < endTimeFilter
                  ? setStartTimeFilter(Number(e.target.value))
                  : setStartTimeFilter(startTimeFilter);
              }}
              onMouseUp={() => timeSliderLeftOnBlur()}
              onTouchEnd={() => timeSliderLeftOnBlur()}
            />
            {/* slider to select the end time  */}
            <div id="TimeStampeRightMarker">
              <div id="TimeStampRightNumber">18:00</div>
            </div>
            <input
              id="TimeStampRight"
              className="TimeSlider"
              type="range"
              value={endTimeFilter}
              min="0"
              max="24"
              onInput={(e) => {
                timeSliderRightOnInput(e);
              }}
              // onBlur={() => timeSliderRightOnBlur()} -> don't work with touch
              onChange={(e) => {
                Number(e.target.value) > startTimeFilter
                  ? setEndTimeFilter(Number(e.target.value))
                  : setEndTimeFilter(endTimeFilter);
              }}
              onMouseUp={() => timeSliderRightOnBlur()}
              onTouchEnd={() => timeSliderRightOnBlur()}
            />
          </div>
        </div>
        {/* optical improvement data input */}
        <IonModal keepContentsMounted={true} id="dialogSelectFilterDate">
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Datum auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() =>
                    (
                      document.getElementById(
                        "dialogSelectFilterDate",
                      ) as HTMLIonModalElement
                    ).dismiss()
                  }
                >
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonDatetime
            id="datetime"
            presentation="date"
            onIonChange={(e) => setSelectedDayFilter(new Date(e.target.value + ".000Z"))}
          ></IonDatetime>
          <IonFooter class="ion-padding">
            <IonButton
              onClick={() => {
                (
                  document.getElementById(
                    "dialogSelectFilterDate",
                  )! as HTMLIonModalElement
                ).dismiss();
              }}
              expand="full"
              color="primary"
            >
              Speichern
            </IonButton>
          </IonFooter>
        </IonModal>
        {/* toast when clicking on an anchor in the timeline without spatial assignment */}
        <IonToast
          isOpen={showToastAnchorNoPos}
          onDidDismiss={() => setShowToastAnchorNoPos(false)}
          style={{ height: 80 }}
          color={"warning"}
          position="top"
          message={"Anker verfügt über keine räumliche Zuordnung."}
          duration={1200}
          icon={alertCircleOutline}
        ></IonToast>
      </IonFooter>
    </IonPage>
  );
};
