import React, { useEffect, useState } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  LayersControl,
  WMSTileLayer,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { AnchorInfoModal } from "./AnchorInfoModal";
import { LocateControl } from "./LocateControl";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Anchor } from "../../../types/types";
import { IonFab, IonFabButton, IonIcon, IonItem, IonLabel, IonList } from "@ionic/react";
import { closeCircleOutline, settingsOutline, locateOutline } from "ionicons/icons";

const { BaseLayer } = LayersControl;

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
    setSelectedLayer(layerUrl);
    setShowLayerControl(false);
  };

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
        {selectedLayer === "wmsLayer" && (
          <WMSTileLayer
            url="http://localhost:8080/geoserver/wms?"
            layers="campus-v-p:floor_${floor}_modifiziert"
            format="image/png"
            transparent={true}
            version="1.1.0"
            minZoom={18}
            maxZoom={22}
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
      </MapContainer>

      {selectedMarker.length > 0 && (
        <AnchorInfoModal anchors={selectedMarker} onClose={handleCloseDetails} />
      )}

      <IonFab vertical="bottom" horizontal="end" slot="fixed">
        <IonFabButton
          color="primary"
          onClick={() => setShowLayerControl(!showLayerControl)}
        >
          <IonIcon icon={settingsOutline} />
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
              <IonItem button onClick={() => handleLayerChange("wmsLayer")}>
                <IonLabel>WMS Layer</IonLabel>
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
