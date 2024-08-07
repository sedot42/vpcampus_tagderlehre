import { useContext, useState, useEffect, useRef } from "react";
import { Marker, divIcon, Map as LeafletMap, tileLayer } from "leaflet";
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
import "leaflet/dist/leaflet.css";
import { StatusHeader } from "../../globalUI/StatusHeader";
import { AnchorContext } from "../../../anchorContext";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";

import { MapContainerComponent } from "./MapContainerComponent";
import { TimeSliderComponent } from "./TimeSliderComponent";
import { AnchorInfoModal } from "./AnchorInfoModal";
import { arrangeDictionaries } from "./TimeLayering";
import { Anchor } from "../../../types/types";

export const MapComponent: React.FC = () => {
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

  const [modalData, setModalData] = useState<Anchor>();

  // by entering the view
  // by entering the view resize
  useIonViewDidEnter(() => {
    setMapIsLoad(false);
    window.dispatchEvent(new Event("resize"));
  });

  // update the map after initialiting map and anchors
  useEffect(() => {
    if (mapContainerRef.current && anchors.length > 0) {
      updateAnchorOnMap();
    }
    console.log(mapIsLoad, anchors);
  }, [mapIsLoad, anchors]);

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
    const filteredAnchorListHasDate: any = [];
    const filteredAnchorListHasDateWrongTime: any = []; // right day but wrong time
    const filteredAnchorListHasDateWrongFloor: any = [];
    let filteredAnchorListIsValid: any = [];
    const filteredAnchorListIsValidWrongTime: any = []; // right day but wrong time
    let filteredAnchorListIsValidWrongFloor: any = [];
    for (const anchor of serverAnchorData) {
      {
        // filter for anchors for the selected day
        const startDate: Date = new Date(anchor.start_at);
        const endDate: Date = new Date(anchor.end_at);
        // appointment
        if (
          startsOnSameDayOrBevor(selectedDayFilter, startDate) &&
          endsOnSameDayOrLater(selectedDayFilter, endDate)
        ) {
          // filter for selected filter for start and end time
          const anchorStartTime =
            selectedDayFilter.getDate() === startDate.getDate()
              ? startDate.getHours() + startDate.getMinutes() / 60
              : 0;
          const anchorEndTime =
            selectedDayFilter.getDate() === endDate.getDate()
              ? endDate.getHours() + endDate.getMinutes() / 60
              : 23.999;
          console.log(anchorStartTime, anchorEndTime);
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
      }
    }
    // ensure that anchors are not displayed twice
    // remove anchors that have an appointment in the selected time and are valid
    const idsInFilteredAnchorListHasDate = new Set(
      filteredAnchorListHasDate.map((d: any) => d.id)
    );
    filteredAnchorListIsValid = filteredAnchorListIsValid.filter(
      (d: any) => !idsInFilteredAnchorListHasDate.has(d.id)
    );
    const idsInFilteredAnchorListHasDateWrongFloor = new Set(
      filteredAnchorListHasDateWrongFloor.map((d: any) => d.id)
    );
    filteredAnchorListIsValidWrongFloor = filteredAnchorListIsValidWrongFloor.filter(
      (d: any) => !idsInFilteredAnchorListHasDateWrongFloor.has(d.id)
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

  // create the style of the marker
  const createMarkerStyle = (
    color: string = "#44a2fa",
    rotation: string = "45deg",
    uidAnchor: string = "",
    size: number = 3
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

  // add anchor to the map and display it
  const addMarkerToMap = (
    anchor: any,
    mapCenter: any,
    mapBounds: any,
    color: string,
    size: number
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
        console.log([anchor.lat, anchor.lon]);
        mapPositionMarker.addEventListener("click", (e) => {
          setShowModal(true);
          // openAnchorInformation(e, anchor.id);
        });
        mapPositionMarker.addTo(mapContainerRef.current!); // add to map;
      }
      // calculate position and rotation of anchor icon (anchor not in display borders)
      else {
        const markerOrientation = calculateMarkerOrientation(
          anchor,
          mapCenter,
          mapBoundLeft,
          mapBoundRight,
          mapBoundTop,
          mapBoundBottom
        );
        const mapPositionMarker = new Marker(
          [markerOrientation[0], markerOrientation[1]],
          {
            icon: createMarkerStyle(color, markerOrientation[2] + "deg", anchor.id, size),
          }
        );
        mapPositionMarker.addEventListener("click", (e) => {
          mapContainerRef.current!.panTo([anchor.lat, anchor.lon]);
        });
        mapPositionMarker.addTo(mapContainerRef.current!);
      }
    }
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
        const startTimeAnchor = new Date(indivAnchor.start_at);
        const endTimeAnchor = new Date(indivAnchor.end_at);
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
      "inTime"
    );
    const anchorOutTimeSelectionLayering = prepareDictForLayering(
      anchorOutTimeSelection,
      "outTime"
    );
    const dictListForLayering = anchorInTimeSelectionLayering.concat(
      anchorOutTimeSelectionLayering
    );
    const displayLayering = arrangeDictionaries(dictListForLayering);
    const numberOfLayer = displayLayering.length;
    // add a backgroud to the selected timespace
    // add anchors on display
  };
  // update the timeline after initializing the anchors
  useEffect(() => {
    updateAnchorInTimeline();
  }, [anchors]);

  // calculate the orientation and position of a marker (mainly when anchor is outside the visible range)
  const calculateMarkerOrientation = (
    anchor: any,
    mapCenter: any,
    mapBoundLeft: number,
    mapBoundRight: number,
    mapBoundTop: number,
    mapBoundBottom: number
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
    console.log(positionLat(), positionLon(), rotation);
    return [positionLat(), positionLon(), rotation];
  };

  // update timeline and map display if inputs changed
  useEffect(() => {
    updateAnchorInTimeline();
    if (mapContainerRef.current) {
      updateAnchorOnMap();
    }
    console.log(endTimeFilter, startTimeFilter);
  }, [endTimeFilter, startTimeFilter, selectedDayFilter, selectedFloor]);

  return (
    <IonPage>
      <StatusHeader titleText="Erstellen" />
      <IonContent fullscreen>
        <MapContainerComponent
          anchors={anchors}
          setMapIsLoad={setMapIsLoad}
          selectedFloor={selectedFloor}
          mapContainerRef={mapContainerRef}
          filterAnchorFromServer={filterAnchorFromServer}
          layerFloorplanVisible={layerFloorplanVisible}
          setShowModal={setShowModal}
        />
        <IonModal
          id="dialogAnchorInfo"
          isOpen={showModal}
          onDidDismiss={() => setShowModal(false)}
        >
          <AnchorInfoModal
            filteredAnchor={filterAnchorFromServer(anchors)}
            setModalData={setModalData}
            setShowModal={setShowModal}
          />
        </IonModal>
      </IonContent>
      <TimeSliderComponent
        anchors={anchors}
        startTimeFilter={startTimeFilter}
        endTimeFilter={endTimeFilter}
        setStartTimeFilter={setStartTimeFilter}
        setEndTimeFilter={setEndTimeFilter}
        setSelectedDayFilter={setSelectedDayFilter}
        showToastAnchorNoPos={showToastAnchorNoPos}
        setShowToastAnchorNoPos={setShowToastAnchorNoPos}
      />
    </IonPage>
  );
};
