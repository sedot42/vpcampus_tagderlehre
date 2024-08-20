import { useEffect, useState } from "react";
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
}: AnchorCreateProps & { mapRef?: Map; setMapRef: (map: Map) => void }) => {
  useEffect(() => {
    mapRef && mapRef.invalidateSize();
  }, [mapRef, localAnchor.lat]);
  function GetPosClickDisplayedMap() {
    const customMarkerStyle = `
    background-color: #44a2fa;
    width: 3rem;
    height: 3rem;
    display: block;
    left: -1.5rem;
    top: -1.5rem;
    position: relative;
    border-radius: 3rem 3rem 0;
    transform: rotate(45deg);
    border: 1px solid #FFFFFF`;

    const customPosIcon = divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      html: `<span style="${customMarkerStyle}" />`,
    });
    const map = useMapEvents({
      click: (e) => {
        map.eachLayer((layer) => {
          if (layer.options.pane === "markerPane") {
            map.removeLayer(layer);
          }
        });
        const mapPositionMarker = new Marker(e.latlng, { icon: customPosIcon });
        mapPositionMarker.addTo(map); // add to map;
        setLocalAnchor({ ...localAnchor, lat: e.latlng.lat, lon: e.latlng.lng });
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
          maxBounds={[
            [45.8148308954386, 5.740290246442871],
            [47.967830538595194, 10.594475942663449],
          ]}
        >
          <WMSTileLayer
            id="backgroundPixelKarte"
            url="https://wms.geo.admin.ch/?"
            layers="ch.swisstopo.pixelkarte-farbe"
            format="image/jpeg"
            detectRetina={true}
            minZoom={7.5}
            maxZoom={20}
            attribution="Map by <a href = 'https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
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
}: AnchorCreateProps & {
  createLocationModalOpen: boolean;
  setCreateLocationModalOpen: (state: boolean) => void;
}) => {
  const closeModal = () => setCreateLocationModalOpen(false);
  const [showOutside, setShowOutside] = useState(true);
  const [mapRef, setMapRef] = useState<Map>();

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
