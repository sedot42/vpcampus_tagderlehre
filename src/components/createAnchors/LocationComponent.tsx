import { useState, useContext } from "react";
import { IonButton, IonFab, IonFabButton, IonIcon } from "@ionic/react";
import { addCircleOutline, qrCodeOutline } from "ionicons/icons";
import { AnchorContext } from "../../anchorContext";
import { SelectionModal } from "../settings/SelectionModal";
import { ModalButton } from "../globalUI/Buttons";
import { AnchorCreateProps } from "./CreateAnchorModal";
import { CreateLocationModal } from "./CreateLocationModal";
import "../../theme/styles.css";
import "leaflet/dist/leaflet.css";

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
