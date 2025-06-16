import { useState } from "react";
import {
  IonIcon,
  IonLabel,
  IonItem,
  IonNote,
  IonCard,
  IonItemSliding,
  IonButton,
  IonAlert,
  useIonToast,
} from "@ionic/react";
import {
  createOutline,
  mapOutline,
  qrCodeOutline,
  shareSocialOutline,
  trashOutline,
} from "ionicons/icons";
import { Anchor, convertDBAnchorToFlatAnchor, DBAnchor } from "../../types/types";
import { UpdateModal } from "./UpdateModal";

export const ListAnchorsAsCardsComponent = ({
  anchor,
  index,
  deleteOneAnchor,
  setShowView,
}: {
  anchor: DBAnchor;
  index: number;
  deleteOneAnchor: (anchor: DBAnchor["id"]) => void;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor | undefined>();

  // States for delete Confirm Alert
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [anchorToDelete, setAnchorToDelete] = useState<DBAnchor>();

  const [showToast] = useIonToast();

  return (
    <IonCard
      key={index}
      onClick={() => {
        setModalData(convertDBAnchorToFlatAnchor(anchor));
        setOpenUpdateModal(true);
      }}
      style={{ cursor: "pointer" }}
    >
      <IonItemSliding>
        <IonItem lines="none" id={"open-modal-" + index}>
          <IonLabel>
            <h2 style={{ fontWeight: 700 }}>{anchor.anchor_name}</h2>
            <IonNote style={{ color: "#555555" }} class="ion-text-wrap">
              <p>
                {anchor.anchor_description
                  ? `${anchor.anchor_description}`
                  : "Keine Beschreibung vorhanden"}
              </p>
              {anchor.start_at && anchor.end_at && (
                <>
                  <p>Start: {new Date(anchor.start_at).toLocaleString()}</p>
                  <p>Ende: {new Date(anchor.end_at).toLocaleString()}</p>
                </>
              )}
              {(anchor.room_id || anchor.campus_id || anchor.faculty_name) && (
                <p>
                  Ort: {anchor.room_id || ""}
                  {anchor.room_id && (anchor.faculty_name || anchor.campus_id)
                    ? ", "
                    : ""}
                  {anchor.faculty_name || ""}
                  {anchor.faculty_name && anchor.campus_id ? ", " : ""}
                  {anchor.campus_id || ""}
                </p>
              )}
            </IonNote>
          </IonLabel>
        </IonItem>
        <>
          <IonButton
            onClick={() => {
              setModalData(convertDBAnchorToFlatAnchor(anchor));
              setOpenUpdateModal(true);
            }}
          >
            <IonIcon icon={createOutline} size="small" />
          </IonButton>
          <IonButton
            onClick={(e) => {
              showToast({
                message: "Nicht implementiert",
                duration: 2000,
                position: "middle",
                color: "warning",
              });
              e.stopPropagation();
            }}
          >
            <IonIcon icon={mapOutline} size="small" />
          </IonButton>
          <IonButton
            id={anchor.id + "delete"}
            onClick={(e) => {
              setShowDeleteConfirm(true);
              setAnchorToDelete(anchor);
              e.stopPropagation();
            }}
          >
            <IonIcon icon={trashOutline} size="small" />
          </IonButton>
          <IonButton
            onClick={(e) => {
              showToast({
                message: "Nicht implementiert",
                duration: 2000,
                position: "middle",
                color: "warning",
              });
              e.stopPropagation();
            }}
          >
            <IonIcon icon={shareSocialOutline} size="small" />
          </IonButton>
          <IonButton
            onClick={(e) => {
              showToast({
                message: "Nicht implementiert",
                duration: 2000,
                position: "middle",
                color: "warning",
              });
              e.stopPropagation();
            }}
          >
            <IonIcon icon={qrCodeOutline} size="small" />
          </IonButton>
          <IonAlert
            isOpen={showDeleteConfirm}
            header="Anker Löschen"
            subHeader={anchor.anchor_name}
            message="Willst du den Anker endgültig Löschen?"
            buttons={[
              {
                text: "Abbrechen",
                role: "cancel",
              },
              {
                text: "Löschen",
                role: "confirm",
                handler: () => {
                  if (anchorToDelete) deleteOneAnchor(anchorToDelete.id);
                  setShowView(false);
                  console.log("Delete", anchor.anchor_name);
                },
              },
            ]}
          ></IonAlert>
        </>
      </IonItemSliding>
      {modalData && (
        <UpdateModal
          modalData={modalData}
          setModalData={setModalData}
          openUpdateModal={openUpdateModal}
          setOpenUpdateModal={setOpenUpdateModal}
        ></UpdateModal>
      )}
    </IonCard>
  );
};
