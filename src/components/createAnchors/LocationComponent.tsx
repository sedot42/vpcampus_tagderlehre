import { useState, useContext } from "react";
import {
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  useIonViewDidEnter,
} from "@ionic/react";
import { qrCodeOutline, trashOutline } from "ionicons/icons";
import { AnchorContext } from "../../anchorContext";
import { SelectionModal } from "../settings/SelectionModal";
import { AnchorCreateProps } from "./CreateAnchorModal";
import { CreateLocationModal } from "./CreateLocationModal";
import "../../theme/styles.css";
import "leaflet/dist/leaflet.css";
import { Anchor, DraftAnchor } from "../../types/types";

export const LocationGroup = ({
  localAnchor,
  setLocalAnchor,
  setShowMapLocation,
  showMapLocation,
}: {
  localAnchor: DraftAnchor<Anchor>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
  setShowMapLocation: React.Dispatch<React.SetStateAction<boolean>>;
  showMapLocation: boolean;
}) => {
  const { anchors } = useContext(AnchorContext);

  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [createLocationModalOpen, setCreateLocationModalOpen] = useState(false);
  const [locationSet, setLocationSet] = useState<boolean>(false);
  const [locationSetMap, setLocationSetMap] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<"none" | "map" | "list" | "current">(
    "none"
  );

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
  });

  const locationList =
    localAnchor &&
    [...new Set(anchors.flatMap((anchor) => anchor.room_id))]
      .filter((item) => item !== undefined)
      .sort();

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalAnchor({ ...localAnchor, lat: latitude, lon: longitude });
          setLocationSet(true);
          setActiveButton("current");
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const resetLocation = () => {
    setLocalAnchor({ lat: null, lon: null, room_id: null });
    setLocationSet(false);
    setLocationSetMap(false);
    setActiveButton("none");
  };

  const handleListeClick = () => {
    setLocationModalOpen(true);
    setActiveButton("list");
  };

  const handleSaveRoom = (newList) => {
    setLocalAnchor({
      ...localAnchor,
      room_id: newList[0],
    });
    setLocationModalOpen(false);
    setActiveButton("list");
  };

  const handleMapButtonClick = () => {
    setCreateLocationModalOpen(true);
    setActiveButton("map");
  };

  return (
    <>
      <IonItem lines="none">
        Ort
        <IonItemGroup>
          {!locationSetMap && !showMapLocation ? (
            <IonButton
              onClick={handleMapButtonClick}
              disabled={activeButton !== "none" && activeButton !== "map"}
            >
              Über Karte wählen
            </IonButton>
          ) : (
            (showMapLocation || locationSetMap) && (
              <IonButton
                color="medium"
                className="tagContainerButton"
                onClick={resetLocation}
              >
                <IonLabel className="tagContainerButtonLabels ion-text-wrap">
                  {`Lat: ${localAnchor.lat}, Lon: ${localAnchor.lon}`}
                </IonLabel>
                <IonIcon icon={trashOutline} />
              </IonButton>
            )
          )}

          <CreateLocationModal
            localAnchor={localAnchor}
            setLocalAnchor={setLocalAnchor}
            createLocationModalOpen={createLocationModalOpen}
            setCreateLocationModalOpen={setCreateLocationModalOpen}
            setLocationSetMap={setLocationSetMap}
          />

          <IonButton
            color={localAnchor.room_id ? "medium" : "primary"}
            onClick={localAnchor.room_id ? resetLocation : handleListeClick}
            disabled={activeButton !== "none" && activeButton !== "list"}
          >
            <IonLabel className="ion-text-wrap">
              {localAnchor.room_id ? `Room: ${localAnchor.room_id}` : "Raum über Liste"}
            </IonLabel>
            {localAnchor.room_id && <IonIcon icon={trashOutline} />}
          </IonButton>

          <SelectionModal
            headerText="Ort auswählen"
            hasMultiSelection={false}
            closeModal={() => setLocationModalOpen(false)}
            isOpen={locationModalOpen}
            selectionList={locationList}
            initialSelection={localAnchor.room_id ? [localAnchor.room_id] : []}
            modalConfirmAction={handleSaveRoom}
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
                <IonButton onClick={handleSaveRoom} expand="full" color="primary">
                  Speichern
                </IonButton>
              </div>
            </>
          </SelectionModal>

          {!locationSet ? (
            <IonButton
              onClick={handleLocationClick}
              disabled={activeButton !== "none" && activeButton !== "current"}
            >
              Aktuellen Standort verwenden
            </IonButton>
          ) : (
            <IonButton
              color="medium"
              className="tagContainerButton"
              onClick={resetLocation}
            >
              <IonLabel className="tagContainerButtonLabels ion-text-wrap">
                {`Lat: ${localAnchor.lat}, Lon: ${localAnchor.lon}`}
              </IonLabel>
              <IonIcon icon={trashOutline} />
            </IonButton>
          )}
        </IonItemGroup>
      </IonItem>
    </>
  );
};
