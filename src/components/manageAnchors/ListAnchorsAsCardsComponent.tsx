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
}: {
  anchor: DBAnchor;
  index: number;
  deleteOneAnchor: (anchor: DBAnchor["id"]) => void;
}) => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor | undefined>();

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
            }}
          >
            <IonIcon icon={trashOutline} size="small" />
          </IonButton>
          <IonAlert
            trigger={anchor.id + "delete"}
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
                  deleteOneAnchor(anchor.id);
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
