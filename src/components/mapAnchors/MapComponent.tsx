import { useEffect, useMemo, useRef, useState } from "react";
import "./map.css";
import L from "leaflet";
// Fix Leaflet marker icon URLs: https://github.com/Leaflet/Leaflet/issues/4968
import markerIconUrl from "../../../node_modules/leaflet/dist/images/marker-icon.png";
import markerIconRetinaUrl from "../../../node_modules/leaflet/dist/images/marker-icon-2x.png";
import markerShadowUrl from "../../../node_modules/leaflet/dist/images/marker-shadow.png";
L.Icon.Default.prototype.options.iconUrl = markerIconUrl;
L.Icon.Default.prototype.options.iconRetinaUrl = markerIconRetinaUrl;
L.Icon.Default.prototype.options.shadowUrl = markerShadowUrl;
L.Icon.Default.imagePath = ""; // necessary to avoid Leaflet adds some prefix to image path.

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
import { MapContainer, Marker, TileLayer, WMSTileLayer, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import { LocateControl } from "./LocateControl";
// import MarkerClusterGroup from "react-leaflet-cluster";
import { Anchor, DBAnchor, DraftAnchor } from "../../types/types";
import { layersOutline } from "ionicons/icons";

import { draftAnchor } from "../../types/defaults";

const mapboxToken =
  "sk.eyJ1Ijoic2Vkb3QiLCJhIjoiY21jZHh4bWRzMGxuNjJ3cXczY3AyamkzNCJ9.VSwQUP-iRxj-Y5dAzZ9JHg";

const etagenplaeneToMapboxTilesetID: { [key: string]: string } = {
  "1": "sedot.13z48iuc",
  "2": "sedot.42a263zn",
  "3": "sedot.2ashmqc7",
  "4": "sedot.bj1ps9jr",
  "5": "sedot.1p4x1xkx",
};

export const MapComponent = ({
  filteredAnchors,
  setShowCreate,
  setLocalAnchor,
  setShowMapLocation,
  setShowView,
  highlightedAnchor,
  setShowViewAnchorIDs,
}: {
  filteredAnchors: DBAnchor[];
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
  setShowMapLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  highlightedAnchor: DBAnchor | undefined;
  setShowViewAnchorIDs: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [showLayerControl, setShowLayerControl] = useState(false);
  const [selectedLayer, setSelectedLayer] = useState<string>("openstreetmap");
  const [sliderValue, setSliderValue] = useState(1);
  const [showRangeSlider, setShowRangeSlider] = useState(false);
  const ref = useRef(null);
  const [markerPosition, setMarkerPosition] = useState<[number, number] | null>(null);
  const mousedownInterval = useRef<NodeJS.Timeout | null>(null);
  const startPosition = useRef<[number, number] | null>(null);

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
  });

  // Filter the anchors based on the timeslider. If the Floorplans are displayed they should also be filtered based on the floorlevel
  const mapAnchors = useMemo(() => {
    if (selectedLayer === "etagenplaene_image") {
      return filteredAnchors.filter((anchor) => anchor.floor_nr === sliderValue);
    }
    // show only anchors with lat and lon
    return filteredAnchors.filter(
      (anchor) => typeof anchor.lat === "number" && typeof anchor.lon === "number"
    );
  }, [selectedLayer, filteredAnchors, sliderValue]);

  // Clusterfunction when you zoom out. (Maybe we should find an different solution ;)
  // const createClusterCustomIcon = (cluster: L.MarkerCluster) => {
  //   return L.divIcon({
  //     html: `<span class="cluster-icon">${cluster.getChildCount()}</span>`,
  //     className: "custom-marker-cluster",
  //     iconSize: L.point(33, 33, true),
  //   });
  // };

  // On click on Anchor display the ListModal. If there are several Anchors at the same location create a list, based on their IDs
  const handleAnchorClick = (anchor: DBAnchor) => {
    console.log(anchor);
    const lat = anchor.lat;
    const lon = anchor.lon;
    // Find all anchors with the same coordinates
    const matchingAnchors = mapAnchors.filter((a) => a.lat === lat && a.lon === lon);
    console.log(matchingAnchors);
    // Collect their IDs
    const anchorIDs = matchingAnchors.map((a) => a.id);
    console.log(anchorIDs);
    setShowView(true);
    setShowViewAnchorIDs(anchorIDs);
  };

  // open/close the range slider only if the Floorplans are displayed/closed
  const handleLayerChange = (layerUrl: string) => {
    if (layerUrl === "etagenplaene_image") {
      setShowRangeSlider(true);
    } else {
      setShowRangeSlider(false);
    }
    setSelectedLayer(layerUrl);
    setShowLayerControl(false);
  };
  // disable event propagation on the range slider
  useEffect(() => {
    if (ref.current) L.DomEvent.disableClickPropagation(ref.current);
  });

  // Very complicated function. This handles the "longTouch" on the map and assures that this works on mobile and desktop.
  // After the long touch a temporary marker is set and the "createAnchor" Modal is opened with the respective coordinates already filled out
  const MapEventHandlers = () => {
    const map = useMap();

    const clearMousedownTimeout = () => {
      if (mousedownInterval.current) {
        clearTimeout(mousedownInterval.current);
        mousedownInterval.current = null;
      }
    };

    const handleStart = (latlng: L.LatLng) => {
      startPosition.current = [latlng.lat, latlng.lng];
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
      }, 750); // Definition of the touch-duration
    };

    const handleMove = (latlng: L.LatLng) => {
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
      const handleTouchStart = (e: TouchEvent) => {
        // NOTE: e.touches[0] is a Touch object, not a MouseEvent, but works just as well
        const latlng = map.mouseEventToLatLng(e.touches[0] as unknown as MouseEvent);
        handleStart(latlng);
      };

      const handleTouchMove = (e: TouchEvent) => {
        // NOTE: e.touches[0] is a Touch object, not a MouseEvent, but works just as well
        const latlng = map.mouseEventToLatLng(e.touches[0] as unknown as MouseEvent);
        handleMove(latlng);
      };

      const handleTouchEnd = () => handleEnd();

      const handleMouseDown = (e: L.LeafletMouseEvent) => {
        handleStart(e.latlng);
      };

      const handleMouseMove = (e: L.LeafletMouseEvent) => {
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
        center={
          highlightedAnchor?.lat && highlightedAnchor?.lon
            ? [highlightedAnchor.lat, highlightedAnchor.lon]
            : [47.5349015179286, 7.6419409280402535]
        }
        zoom={18}
        maxZoom={22}
        maxBounds={[
          [45.8148308954386, 5.740290246442871],
          [47.967830538595194, 10.594475942663449],
        ]}
      >
        {/* initialisation of all WMS layers */}
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
          <TileLayer
            url={`https://api.mapbox.com/v4/${
              etagenplaeneToMapboxTilesetID[sliderValue.toString()]
            }/{z}/{x}/{y}.webp?access_token=${mapboxToken}`}
            minZoom={7.5}
            maxZoom={22}
          />
        )}

        {/* Display of the Markers aswell as the clustering */}
        {/* <MarkerClusterGroup
          chunkedLoading
          iconCreateFunction={createClusterCustomIcon}
          maxClusterRadius={40}
          spiderfyOnMaxZoom={false}
          disableClusteringAtZoom={16}
        > */}
        {mapAnchors.map((anchor) => (
          <Marker
            key={anchor.id}
            position={[anchor.lat as number, anchor.lon as number]} // mapAnchors are filtered to only include anchors with lat and lon
            eventHandlers={{
              click: () => handleAnchorClick(anchor),
            }}
            {...(highlightedAnchor?.id === anchor.id && {
              icon: L.divIcon({
                className: "custom-marker",
                html: '<div style="background-color: red; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>',
                iconSize: [20, 20],
                iconAnchor: [10, 10],
              }),
            })}
          />
        ))}
        {/* </MarkerClusterGroup> */}
        {/* Find your Geolocation */}
        <LocateControl />

        {/* Call of all the interactions with the map */}
        <MapEventHandlers />
        {/* Slider for the Floorplans */}
        <div className="slider-wrapper">
          {showRangeSlider && (
            <div className="range-slider-container">
              <IonRange
                ref={ref}
                className="vertical-range"
                min={1}
                max={5}
                step={1}
                ticks={true}
                snaps={true}
                pin={true}
                pinFormatter={(value) => `${value}`}
                value={sliderValue}
                onIonChange={(e) => setSliderValue(e.detail.value as number)}
              />
            </div>
          )}
        </div>
      </MapContainer>
      {/* Layercontrols */}
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
