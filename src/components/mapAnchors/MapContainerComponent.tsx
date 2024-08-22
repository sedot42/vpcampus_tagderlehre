import { useEffect, useMemo, useRef, useState } from "react";
import "./map.css";
import L from "leaflet";
import {
  useIonViewDidEnter,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonRange,
} from "@ionic/react";
import { MapContainer, Marker, WMSTileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { LocateControl } from "./LocateControl";
import MarkerClusterGroup from "react-leaflet-cluster";
import { Anchor, DBAnchor, DraftAnchor } from "../../types/types";
import { layersOutline } from "ionicons/icons";

import { draftAnchor } from "../../types/defaults";

export const MapContainerComponent = ({
  filteredAnchors,
  setShowCreate,
  setLocalAnchor,
  setShowMapLocation,
  setShowView,
  setShowViewAnchorID,
}: {
  filteredAnchors: DBAnchor[];
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
  setShowMapLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  setShowViewAnchorID: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [validAnchors, setValidAnchors] = useState<DBAnchor[]>([]);
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string>("openstreetmap");
  const [sliderValue, setSliderValue] = useState(1);
  const [showRangeSlider, setShowRangeSlider] = useState(false);
  const ref = useRef(null);
  //const [showCreate, setShowCreate] = useState<boolean>(false);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const mousedownInterval = useRef<NodeJS.Timeout | null>(null);
  const startPosition = useRef<[number, number] | null>(null);

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
  });

  useEffect(() => {
    const timer = setTimeout(() => {
      setValidAnchors(filteredAnchors);
    }, 500);

    return () => clearTimeout(timer);
  }, [filteredAnchors]);

  const mapAnchors = useMemo(() => {
    if (selectedLayer === "etagenplaene_image") {
      return filteredAnchors.filter((anchor) => anchor.floor_nr === sliderValue);
    }
    return filteredAnchors.filter(
      (anchor) => typeof anchor.lat === "number" && typeof anchor.lon === "number"
    );
  }, [selectedLayer, filteredAnchors, sliderValue]);

  const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
    return L.divIcon({
      html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
      className: "custom-marker-cluster",
      iconSize: L.point(33, 33, true),
    });
  };

  const handleAnchorClick = (anchor) => {
    console.log(anchor);
    const lat: number = anchor.lat;
    const lon: number = anchor.lon;
    //const anchor_id: string = anchor.id;
    // Find all anchors with the same coordinates

    const matchingAnchors = mapAnchors.filter((a) => a.lat === lat && a.lon === lon);
    console.log(matchingAnchors);
    // Collect their IDs
    const anchorIDs = matchingAnchors.map((a) => a.id);
    console.log(anchorIDs);
    setShowView(true);
    setShowViewAnchorID(anchorIDs);
  };

  const handleLayerChange = (layerUrl: string) => {
    if (layerUrl === "etagenplaene_image") {
      setShowRangeSlider(true);
    } else {
      setShowRangeSlider(false);
    }
    setSelectedLayer(layerUrl);
    setShowLayerControl(false);
  };

  const MapEventHandlers = () => {
    const map = useMap();
    const [coords, setCoords] = useState(null);

    const clearMousedownTimeout = () => {
      if (mousedownInterval.current) {
        clearTimeout(mousedownInterval.current);
        mousedownInterval.current = null;
      }
    };

    const handleStart = (latlng) => {
      startPosition.current = [latlng.lat, latlng.lng];
      setCoords(startPosition.current);
      mousedownInterval.current = setTimeout(() => {
        setMarkerPosition([latlng.lat, latlng.lng]);
        setShowCreate(true);
        setShowMapLocation(true);

        const selectAnchor: DraftAnchor<Anchor> = {
          lat: latlng.lat,
          lon: latlng.lng,
          ...draftAnchor,
        };
        setLocalAnchor(selectAnchor);
      }, 750);
    };

    const handleMove = (latlng) => {
      if (startPosition.current) {
        const distanceMoved = latlng.distanceTo({
          lat: startPosition.current[0],
          lng: startPosition.current[1],
        });
        if (distanceMoved > 1) {
          clearMousedownTimeout();
        }
      }
    };

    const handleEnd = () => {
      clearMousedownTimeout();
      startPosition.current = null;
    };

    useEffect(() => {
      const handleTouchStart = (e) => {
        const latlng = map.mouseEventToLatLng(e.touches[0]);
        handleStart(latlng);
      };

      const handleTouchMove = (e) => {
        const latlng = map.mouseEventToLatLng(e.touches[0]);
        handleMove(latlng);
      };

      const handleTouchEnd = () => {
        handleEnd();
      };

      const handleMouseDown = (e) => {
        handleStart(e.latlng);
      };

      const handleMouseMove = (e) => {
        handleMove(e.latlng);
      };

      const handleMouseUp = () => {
        handleEnd();
      };

      map.on("mousedown", handleMouseDown);
      map.on("mousemove", handleMouseMove);
      map.on("mouseup", handleMouseUp);
      map.on("mouseout", handleEnd);

      map.getContainer().addEventListener("touchstart", handleTouchStart);
      map.getContainer().addEventListener("touchmove", handleTouchMove);
      map.getContainer().addEventListener("touchend", handleTouchEnd);
      map.getContainer().addEventListener("touchcancel", handleTouchEnd);

      return () => {
        map.off("mousedown", handleMouseDown);
        map.off("mousemove", handleMouseMove);
        map.off("mouseup", handleMouseUp);
        map.off("mouseout", handleEnd);

        map.getContainer().removeEventListener("touchstart", handleTouchStart);
        map.getContainer().removeEventListener("touchmove", handleTouchMove);
        map.getContainer().removeEventListener("touchend", handleTouchEnd);
        map.getContainer().removeEventListener("touchcancel", handleTouchEnd);

        clearMousedownTimeout();
      };
    }, [map]);

    return <>{markerPosition && <Marker position={markerPosition} />}</>;
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
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          format="image/jpeg"
          detectRetina={true}
          minZoom={7.5}
          maxZoom={25}
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {selectedLayer === "openstreetmap" && (
          <WMSTileLayer
            url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
            format="image/jpeg"
            detectRetina={true}
            minZoom={7.5}
            maxZoom={25}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
        )}

        {selectedLayer === "basemap" && (
          <WMSTileLayer
            url="https://wms.geo.admin.ch/?"
            layers="ch.swisstopo.pixelkarte-farbe"
            format="image/jpeg"
            detectRetina={true}
            minZoom={7.5}
            maxZoom={25}
            attribution="<a href='https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
          />
        )}

        {selectedLayer === "situationsplan" && (
          <WMSTileLayer
            url="https://wfs.geodienste.ch/av_situationsplan_0/deu?"
            layers="single_objects_surface_elements_underground,single_objects_surface_elements_without_underground,single_objects_surface_elements_underground_outline,single_objects_linear_elements,single_objects_point_elements,land_cover_surface,land_cover_surface_water,land_cover_surface_project,land_cover_surface_building,land_cover_surface_project_buildings,locality_labels,house_addresses"
            format="image/png"
            minZoom={7.5}
            maxZoom={25}
            attribution="<a href='https://www.geodienste.ch/'>geodienste.ch</a>"
          />
        )}

        {selectedLayer === "etagenplaene_image" && (
          <WMSTileLayer
            key={sliderValue}
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
          spiderfyOnMaxZoom={false}
          disableClusteringAtZoom={16}
        >
          {mapAnchors.map((anchor) => (
            <Marker
              key={anchor.id}
              position={[anchor.lat, anchor.lon]}
              eventHandlers={{
                click: () => handleAnchorClick(anchor),
              }}
            />
          ))}
        </MarkerClusterGroup>

        <LocateControl />

        <MapEventHandlers />

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
                onIonFocus={() => L.DomEvent.disableClickPropagation(ref.current)}
                onIonChange={(e) => setSliderValue(e.detail.value as number)}
              />
            </div>
          )}
        </div>
      </MapContainer>

      {/*       {selectedMarker.length > 0 && (
        <AnchorInfoModal mapAnchors={mapAnchors} onClose={handleCloseDetails} />
      )} */}

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
              <IonItem button onClick={() => handleLayerChange("openstreetmap")}>
                <IonLabel>OpenStreetMap</IonLabel>
              </IonItem>
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
