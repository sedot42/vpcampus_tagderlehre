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
} from "@ionic/react";
import { createOutline, mapOutline, trashOutline } from "ionicons/icons";
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

  return (
    <IonCard key={index} style={{ cursor: "pointer" }}>
      <IonItemSliding>
        <IonItem lines="none" id={"open-modal-" + index}>
          <IonLabel>
            <div style={{ fontWeight: 700, color: "black" }}>{anchor.anchor_name}</div>
            <IonNote class="ion-text-wrap">
              {anchor.loc_description
                ? `${anchor.loc_description}`
                : "Keine Beschreibung vorhanden"}{" "}
              <br />
              {anchor.start_at &&
                anchor.end_at &&
                `Start: ${new Date(anchor.start_at).toLocaleString()} `}
              <br />
              {anchor.start_at &&
                anchor.end_at &&
                `Ende: ${new Date(anchor.end_at).toLocaleString()}`}
              <br />
              {(anchor.room_id || anchor.campus_id || anchor.faculty_name) &&
                `Ort: ${anchor.room_id || ""} ${
                  anchor.room_id && (anchor.faculty_name || anchor.campus_id) ? ", " : ""
                }${anchor.faculty_name || ""} ${
                  anchor.faculty_name && anchor.campus_id ? ", " : ""
                }${anchor.campus_id || ""}`}
            </IonNote>
          </IonLabel>
        </IonItem>
        <>
          <IonButton
            onClick={() => {
              setModalData(convertDBAnchorToFlatAnchor(anchor as DBAnchor));
              setOpenUpdateModal(true);
            }}
          >
            <IonIcon icon={createOutline} size="small" />
          </IonButton>
          <IonButton>
            <IonIcon icon={mapOutline} size="small" />
          </IonButton>
          <IonButton
            id={anchor.id + "delete"}
            onClick={() => {
              console.log(anchor.id);
              setShowDeleteConfirm(true);
              setAnchorToDelete(anchor);
            }}
          >
            <IonIcon icon={trashOutline} size="small" />
          </IonButton>
          <IonAlert
            isOpen={showDeleteConfirm}
            header="Anker Löschen"
            subHeader={anchor.anchor_name}
            message="Willst du den Anker endgültig Löschen?"
            buttons={[
              {
                text: "Abrechnen",
                role: "cancel",
              },
              {
                text: "Löschen",
                role: "confirm",
                handler: () => {
                  {
                    anchorToDelete && deleteOneAnchor(anchorToDelete.id);
                    setShowView(false);
                    console.log("Delete", anchor.anchor_name);
                  }
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
