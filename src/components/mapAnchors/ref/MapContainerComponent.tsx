import React, { useEffect, useState } from "react";
import {
  MapContainer,
  Marker,
  LayersControl,
  WMSTileLayer,
  ImageOverlay,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { AnchorInfoModal } from "./AnchorInfoModal";
import { LocateControl } from "./LocateControl";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Anchor } from "../../../types/types";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRange,
} from "@ionic/react";
import {
  closeCircleOutline,
  settingsOutline,
  locateOutline,
  layersOutline,
} from "ionicons/icons";

const { BaseLayer } = LayersControl;

import Map_1 from "../floorplan/rastermaps/Map_1.jpg";
import Map_2 from "../floorplan/rastermaps/Map_2.jpg";
import Map_3 from "../floorplan/rastermaps/Map_3.jpg";
import Map_4 from "../floorplan/rastermaps/Map_4.jpg";
import Map_5 from "../floorplan/rastermaps/Map_5.jpg";
import Map_6 from "../floorplan/rastermaps/Map_6.jpg";
import Map_7 from "../floorplan/rastermaps/Map_7.jpg";
import Map_8 from "../floorplan/rastermaps/Map_8.jpg";
import Map_9 from "../floorplan/rastermaps/Map_9.jpg";
import Map_10 from "../floorplan/rastermaps/Map_10.jpg";
import Map_11 from "../floorplan/rastermaps/Map_11.jpg";
import Map_12 from "../floorplan/rastermaps/Map_12.jpg";
import Map_DA from "../floorplan/rastermaps/Map_DA.jpg";
import Map_eg from "../floorplan/rastermaps/Map_eg.jpg";
import Map_ga from "../floorplan/rastermaps/Map_ga.jpg";
import Map_TG from "../floorplan/rastermaps/Map_TG.jpg";
import Map_u1 from "../floorplan/rastermaps/Map_u1.jpg";
import Map_u2 from "../floorplan/rastermaps/Map_u2.jpg";
import basemap from "../floorplan/rastermaps/basemap.jpg";

const imageMap = {
  1: Map_1,
  2: Map_2,
  3: Map_3,
  4: Map_4,
  5: Map_5,
  6: Map_6,
  7: Map_7,
  8: Map_8,
  9: Map_9,
  10: Map_10,
  11: Map_11,
  12: Map_12,
  13: Map_DA,
  14: Map_eg,
  15: Map_ga,
  16: Map_TG,
  17: Map_u1,
  18: Map_u2,
};

//// Define a custom icon
//const yellowIcon = L.divIcon({
//  className: "custom-marker-icon",
//  html: "<span></span>", // You can use a character or leave it empty
//  iconSize: [32, 32], // Size of the icon
//  iconAnchor: [0, 0], // Point of the icon which will correspond to marker's location
//});

export const MapContainerComponent = ({ anchors }) => {
  const [validAnchor, setAnchor] = useState<Anchor[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Anchor[]>([]);
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string>("");
  const [sliderValue, setSliderValue] = useState(1);
  const [showRangeSlider, setShowRangeSlider] = useState(false);

  useEffect(() => {
    const filterMarkers = anchors.filter(
      (anchor) => typeof anchor.lat === "number" && typeof anchor.lon === "number"
    );
    setAnchor(filterMarkers);
  }, [anchors]);

  const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
    return L.divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: L.point(33, 33, true),
    });
  };

  const groupMarkersByCoordinates = () => {
    const grouped: { [key: string]: Anchor[] } = {};
    validAnchor.forEach((marker) => {
      const key = `${marker.lat},${marker.lon}`;
      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(marker);
    });
    return grouped;
  };

  const handleAnchorClick = (lat: number, lon: number) => {
    const groupedMarkers = groupMarkersByCoordinates();
    const key = `${lat},${lon}`;
    setSelectedMarker(groupedMarkers[key] || []);
  };

  const handleCloseDetails = () => {
    setSelectedMarker([]);
  };

  const groupedMarkers = groupMarkersByCoordinates();

  const handleLayerChange = (layerUrl: string) => {
    console.log(layerUrl);
    if (layerUrl === "etagenplaene") {
      setShowRangeSlider(true);
    } else {
      setShowRangeSlider(false);
    }
    setSelectedLayer(layerUrl);
    setShowLayerControl(false);
  };

  const getImageOverlayUrl = (value: number) => {
    console.log(imageMap[value]);
    return imageMap[value] || ""; // Return the corresponding image URL
  };

  const imageBounds = [
    [47.535273903490356, 7.641788658914912],
    [47.5344723056457, 7.642568117287596],
  ];
  return (
    <>
      <MapContainer
        id="mapContainer"
        center={[47.5349015179286, 7.6419409280402535]}
        zoom={18}
        maxZoom={22}
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
          attribution="<a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
        />
        {selectedLayer === "basemap" && (
          <WMSTileLayer
            url="https://wms.geo.admin.ch/?"
            layers="ch.swisstopo.pixelkarte-farbe"
            format="image/jpeg"
            detectRetina={true}
            minZoom={7.5}
            maxZoom={20}
            attribution="<a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
          />
        )}
        {selectedLayer === "situationsplan" && (
          <WMSTileLayer
            url="https://wfs.geodienste.ch/av_situationsplan_0/deu?"
            layers="single_objects_surface_elements_underground,single_objects_surface_elements_without_underground,single_objects_surface_elements_underground_outline,single_objects_linear_elements,single_objects_point_elements,land_cover_surface,land_cover_surface_water,land_cover_surface_project,land_cover_surface_building,land_cover_surface_project_buildings,locality_labels,house_addresses"
            format="image/png"
            minZoom={7.5}
            maxZoom={22}
            attribution="<a href='https://www.geodienste.ch/'>geodienste.ch</a>"
          />
        )}

        {selectedLayer === "floorplan" && (
          <ImageOverlay
            url={getImageOverlayUrl(sliderValue)}
            bounds={imageBounds}
            opacity={0.9}
            className="grayscale-overlay"
          />
        )}
        <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={40}
          spiderfyOnMaxZoom={true}
          disableClusteringAtZoom={16}
        >
          {Object.keys(groupedMarkers).map((key) => {
            const [lat, lon] = key.split(",").map(Number);
            return (
              <Marker
                key={key}
                position={[lat, lon]}
                //icon={yellowIcon}
                eventHandlers={{
                  click: () => handleAnchorClick(lat, lon),
                }}
              ></Marker>
            );
          })}
        </MarkerClusterGroup>

        {/* Geolocation Control */}
        <LocateControl />
        {showRangeSlider && (
          <div className="range-slider-container">
            <IonRange
              min={1}
              max={12}
              step={1}
              ticks={true}
              snaps={true}
              value={sliderValue}
              onIonChange={(e) => setSliderValue(e.detail.value as number)}
            />
          </div>
        )}
      </MapContainer>

      {selectedMarker.length > 0 && (
        <AnchorInfoModal anchors={selectedMarker} onClose={handleCloseDetails} />
      )}

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton
          color="primary"
          onClick={() => setShowLayerControl(!showLayerControl)}
        >
          <IonIcon icon={layersOutline} />
        </IonFabButton>
        {showLayerControl && (
          <div className="layer-control-menu">
            <IonList>
              <IonItem button onClick={() => handleLayerChange("basemap")}>
                <IonLabel>Basemap</IonLabel>
              </IonItem>
              <IonItem button onClick={() => handleLayerChange("situationsplan")}>
                <IonLabel>Situationsplan</IonLabel>
              </IonItem>
              <IonItem button onClick={() => handleLayerChange("etagenplaene")}>
                <IonLabel>Etagenpläne</IonLabel>
              </IonItem>
              <IonItem button onClick={() => setShowLayerControl(false)}>
                <IonIcon icon={closeCircleOutline} slot="end" />
                <IonLabel>Schliessen</IonLabel>
              </IonItem>
            </IonList>
          </div>
        )}
      </IonFab>
    </>
  );
};
