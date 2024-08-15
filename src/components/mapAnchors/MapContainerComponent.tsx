import React, { useEffect, useRef, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  useIonViewDidEnter,
  useIonViewDidLeave,
  useIonViewWillEnter,
  useIonViewWillLeave,
} from "@ionic/react";
import {
  MapContainer,
  Marker,
  LayersControl,
  WMSTileLayer,
  TileLayer,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./map.css";
import { AnchorInfoModal } from "./AnchorInfoModal";
import { LocateControl } from "./LocateControl";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Anchor } from "../../types/types";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRange,
} from "@ionic/react";
import { layersOutline } from "ionicons/icons";
import L from "leaflet"; // Ensure L is imported

const { BaseLayer } = LayersControl;

export const MapContainerComponent = ({ anchors = [] }) => {
  const [validAnchor, setAnchor] = useState<Anchor[]>([]);
  const [selectedMarker, setSelectedMarker] = useState<Anchor[]>([]);
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string>("");
  const [sliderValue, setSliderValue] = useState(1);
  const [showRangeSlider, setShowRangeSlider] = useState(false);
  const ref = useRef(null);

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
    if (layerUrl === "etagenplaene_image") {
      setShowRangeSlider(true);
    } else {
      setShowRangeSlider(false);
    }
    setSelectedLayer(layerUrl);
    setShowLayerControl(false);
  };

  useEffect(() => {
    console.log(ref);
    console.log(ref?.current);
    if (ref?.current) {
      L.DomEvent.disableClickPropagation(ref.current);
    }
  }, []);

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

        {selectedLayer === "etagenplaene_image" && (
          <WMSTileLayer
            key={sliderValue} // key ensures re-render on sliderValue change
            url={
              "https://qgiscloud.com/CaroBro97/qgis_floorplans/wms?SERVICE=WMS&REQUEST=GetCapabilities"
            }
            layers={sliderValue.toString()}
            format="image/png"
            minZoom={7.5}
            maxZoom={22}
            transparent={true}
          />
        )}

        <MarkerClusterGroup
          ref={ref}
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
                bubblingMouseEvents={false}
                eventHandlers={{
                  click: (e) => {
                    handleAnchorClick(lat, lon);
                  },
                }}
              ></Marker>
            );
          })}
        </MarkerClusterGroup>

        {/* Geolocation Control */}
        <LocateControl />
        <div className="slider-wrapper">
          {showRangeSlider && (
            <div className="range-slider-container">
              <IonRange
                ref={ref}
                className="vertical-range"
                min={1}
                max={12}
                step={1}
                ticks={true}
                snaps={true}
                pin={true}
                pinFormatter={(value) => `${value}`}
                value={sliderValue}
                onIonChange={(e) => {
                  L.DomEvent.disableClickPropagation(ref.current);
                  setSliderValue(e.detail.value as number);
                }}
              />
            </div>
          )}
        </div>
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
              <IonItem button onClick={() => handleLayerChange("etagenplaene_image")}>
                <IonLabel>Etagenpläne_Image</IonLabel>
              </IonItem>
            </IonList>
          </div>
        )}
      </IonFab>
    </>
  );
};
