import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  IonButton,
  IonFooter,
  IonContent,
  IonModal,
  IonHeader,
  IonIcon,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  IonInput,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  useIonViewDidEnter,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { AnchorCreateProps } from "./CreateAnchorModal";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { LocateControl } from "../mapAnchors/ref/LocateControl";
import { divIcon, Map, Marker } from "leaflet";

import "../../theme/styles.css";
import "leaflet/dist/leaflet.css";
import { ConfigInput, createInputs } from "../globalUI/GenericFields";

const fieldConfigs: ConfigInput[] = [
  {
    required: false,
    property: "campus_id",
    placeholder: "Campus",
    label: "Campus",
    fill: "outline",
  },
  {
    required: false,
    property: "address_string",
    placeholder: "Addresse",
    label: "Addresse",
    fill: "outline",
  },
  {
    required: false,
    property: "faculty_name",
    placeholder: "Fakultät",
    label: "Fakultät",
    fill: "outline",
  },
  {
    required: false,
    property: "room_id",
    placeholder: "Raum",
    label: "Raum",
    fill: "outline",
  },
];

const CreateInside = ({ localAnchor, setLocalAnchor }: AnchorCreateProps) => {
  return (
    <IonContent className="ion-padding">
      {createInputs(localAnchor, setLocalAnchor, fieldConfigs)}
      <IonInput
        onIonInput={(event) =>
          setLocalAnchor({
            ...localAnchor,
            floor_nr: parseInt(event.target.value as string),
          })
        }
        color="dark"
        label="Stockwerk"
        labelPlacement="stacked"
        type="number"
        fill="outline"
        style={{ margin: "16px 0 16px 0" }}
        placeholder="Stockwerk"
      ></IonInput>
    </IonContent>
  );
};

const CreateOutside = ({
  localAnchor,
  setLocalAnchor,
  mapRef,
  setMapRef,
  setLocationSetMap,
}: AnchorCreateProps & {
  mapRef?: Map;
  setMapRef: (map: Map) => void;
  setLocationSetMap: Dispatch<SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    mapRef && mapRef.invalidateSize();
  }, [mapRef, localAnchor.lat]);

  function GetPosClickDisplayedMap() {
    const map = useMapEvents({
      click: (e) => {
        map.eachLayer((layer) => {
          if (layer.options.pane === "markerPane") {
            map.removeLayer(layer);
          }
        });
        const mapPositionMarker = new Marker(e.latlng);
        mapPositionMarker.addTo(map); // add to map;
        setLocalAnchor({ ...localAnchor, lat: e.latlng.lat, lon: e.latlng.lng });
        setLocationSetMap(true);
      },
    });
    return null;
  }
  return (
    <IonContent className="ion-padding">
      <div id="positionContainer" style={{ height: "600%", width: "100%" }}>
        <MapContainer
          id="selectPositionMap"
          ref={setMapRef}
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
          <GetPosClickDisplayedMap />
          <LocateControl />
        </MapContainer>
      </div>
    </IonContent>
  );
};

export const CreateLocationModal = ({
  localAnchor,
  setLocalAnchor,
  createLocationModalOpen,
  setCreateLocationModalOpen,
  setLocationSetMap,
}: AnchorCreateProps & {
  createLocationModalOpen: boolean;
  setCreateLocationModalOpen: (state: boolean) => void;
  setLocationSetMap: Dispatch<SetStateAction<boolean>>;
}) => {
  const closeModal = () => setCreateLocationModalOpen(false);
  const [showOutside, setShowOutside] = useState(true);
  const [mapRef, setMapRef] = useState<Map>();

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
  });
  return (
    <IonModal
      isOpen={createLocationModalOpen}
      style={{ "--min-height": "100vh", "--min-width": "100vw" }}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">Ort erstellen</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={closeModal}>
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonSegment>
        <IonSegmentButton onClick={() => setShowOutside(true)}>
          <IonLabel color={showOutside ? "dark" : "medium"}>Aussen</IonLabel>
        </IonSegmentButton>
        <IonSegmentButton onClick={() => setShowOutside(false)}>
          <IonLabel color={showOutside ? "medium" : "dark"}>Innen</IonLabel>
        </IonSegmentButton>
      </IonSegment>
      {showOutside ? (
        <CreateOutside
          localAnchor={localAnchor}
          setLocalAnchor={setLocalAnchor}
          mapRef={mapRef}
          setMapRef={setMapRef}
          setLocationSetMap={setLocationSetMap}
        />
      ) : (
        <CreateInside localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} />
      )}
      <IonFooter>
        <IonGrid>
          <IonRow>
            <IonCol>
              <IonButton
                onClick={closeModal}
                id="saveTempLocation"
                expand="full"
                color="primary"
              >
                Speichern
              </IonButton>
            </IonCol>
            <IonCol>
              <IonButton
                onClick={closeModal}
                id="cancelTempLocation"
                expand="full"
                color="primary"
              >
                Abbrechen
              </IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonModal>
  );
};
