import React from "react";
import { useContext, useState, useEffect, useRef } from "react";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { Marker, divIcon, Map } from "leaflet";
import { useIonViewDidEnter } from "@ionic/react";
import "leaflet/dist/leaflet.css";
import {
  closeOutline,
  homeOutline,
  layersOutline,
  mapOutline,
  alertCircleOutline,
} from "ionicons/icons";
import { AnchorInfoModal } from "./AnchorInfoModal";

interface MapContainerProps {
  selectedFloor: number;
  mapContainerRef: React.RefObject<any>;
}

export const MapContainerComponent: React.FC<MapContainerProps> = ({
  anchors,
  setMapIsLoad,
  selectedFloor,
  mapContainerRef,
  onAnchorClick,
  filterAnchorFromServer,
  layerFloorplanVisible,
  setShowModal,
}) => {
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
          console.log(e, anchor.id);
          return (
            <AnchorInfoModal
              anchors={anchors}
              filterAnchorFromServer={filterAnchorFromServer}
              clickEvent={e}
              anchorID={anchor.id}
            ></AnchorInfoModal>
          );
          //openAnchorInformation(e, anchor.id);
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

  // functions (pipelines) to display the anchors on the map
  // ------------------------------------------------------------------------------------------

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

  // by entering the view resize
  useIonViewDidEnter(() => {
    setMapIsLoad(false);
    window.dispatchEvent(new Event("resize"));
  });

  return (
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
    </MapContainer>
  );
};
