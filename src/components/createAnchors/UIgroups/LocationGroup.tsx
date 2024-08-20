import { useState, useContext } from "react";
import { AnchorContext } from "../../../anchorContext";
import {
  IonButton,
  IonFab,
  IonFabButton,
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
} from "@ionic/react";
import { addCircleOutline, closeOutline, qrCodeOutline } from "ionicons/icons";
import { SelectionModal } from "../../settings/SelectionModal";
import { ModalButton } from "../../globalUI/Buttons";
import { AnchorCreateProps } from "../_unused/CreateAnchorModal";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { LocateControl } from "../../mapAnchors/ref/LocateControl";
import { divIcon, Marker } from "leaflet";

import "../../../theme/styles.css";
import "leaflet/dist/leaflet.css";

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
        setLocalAnchor({ ...localAnchor, lat: e.latlng.lat });
        setLocalAnchor({ ...localAnchor, lon: e.latlng.lng });
      },
    });
    return null;
  }
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
      <IonContent class="padding">
        <IonGrid>
          <IonRow>
            <IonCol>
              <div id="positionContainer" style={{ height: "600%", width: "100%" }}>
                <MapContainer
                  id="selectPositionMap"
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
                  {/* Geolocation Control*/}
                  <LocateControl />
                </MapContainer>
              </div>
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
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
      <IonFooter>
        <IonGrid>
          <IonRow>
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
          </IonRow>
        </IonGrid>
      </IonFooter>
    </IonModal>
  );
};

export const LocationGroup = ({ localAnchor, setLocalAnchor }: AnchorCreateProps) => {
  const { anchors } = useContext(AnchorContext);

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [createLocationModalOpen, setCreateLocationModalOpen] = useState(false);

  const locationList =
    anchors &&
    [...new Set(anchors.flatMap((anchor) => anchor.room_id))]
      .filter((item) => item !== undefined)
      .sort();

  const closeModal = () => setLocationModalOpen(false);

  return (
    <>
      <ModalButton
        id="openLocationModal"
        text="Ort"
        icon={addCircleOutline}
        onClick={() => setLocationModalOpen(true)}
      />
      <SelectionModal
        headerText="Ort auswählen"
        hasMultiSelection={false}
        closeModal={() => setLocationModalOpen(false)}
        isOpen={locationModalOpen}
        selectionList={locationList}
        initialSelection={localAnchor.tags || []}
        modalConfirmAction={(newList: string[]) =>
          setLocalAnchor({
            ...localAnchor,
            room_id: newList[0],
          })
        }
      >
        <>
          <IonFab vertical="top" horizontal="end" edge>
            <IonFabButton>
              <IonIcon icon={qrCodeOutline}></IonIcon>
            </IonFabButton>
          </IonFab>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <IonButton
              onClick={() => {
                (newList: string[]) =>
                  setLocalAnchor({
                    ...localAnchor,
                    room_id: newList[0],
                  });
                closeModal();
              }}
              expand="full"
              color="primary"
            >
              Speichern
            </IonButton>
            <IonButton
              onClick={() => setCreateLocationModalOpen(true)}
              expand="full"
              color="primary"
            >
              Neuer Ort
            </IonButton>
          </div>
        </>
      </SelectionModal>
      <CreateLocationModal
        localAnchor={localAnchor}
        setLocalAnchor={setLocalAnchor}
        createLocationModalOpen={createLocationModalOpen}
        setCreateLocationModalOpen={setCreateLocationModalOpen}
      />
    </>
  );
};
