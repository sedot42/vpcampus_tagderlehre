import React, { useState } from "react";
import {
  IonIcon,
  IonLabel,
  IonItem,
  IonNote,
  IonCard,
  IonItemSliding,
  IonButton,
} from "@ionic/react";
import { createOutline, mapOutline, trashOutline } from "ionicons/icons";
import { Anchor, convertDBAnchorToFlatAnchor, DBAnchor } from "../../types/types";
import { AnchorContextType } from "../../anchorContext";
import { UpdateModal } from "./UpdateModal";

export const ListAnchorsAsCardsComponent = ({
  anchor,
  index,
  //setModalData,
  //setOpenUpdateModal,
  deleteOneAnchor,
}: {
  anchor: DBAnchor;
  index: number;
  //setModalData: React.Dispatch<React.SetStateAction<Anchor | undefined>>;
  //setOpenUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
  deleteOneAnchor: (anchor: DBAnchor["id"]) => void;
}) => {
  const [openUpdateModal, setOpenUpdateModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor | undefined>();

  return (
    <IonCard key={index} style={{ cursor: "pointer" }}>
      <IonItemSliding>
        <IonItem
          lines="none"
          id={"open-modal-" + index}
          onClick={() => {
            setModalData(convertDBAnchorToFlatAnchor(anchor as DBAnchor));
            setOpenUpdateModal(true);
          }}
        >
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
              modalData && (
                <UpdateModal
                  modalData={modalData}
                  setModalData={setModalData}
                  openUpdateModal={openUpdateModal}
                  setOpenUpdateModal={setOpenUpdateModal}
                ></UpdateModal>
              );
              console.log("edited", modalData);
            }}
          >
            <IonIcon icon={createOutline} size="small" />
          </IonButton>
          <IonButton>
            <IonIcon icon={mapOutline} size="small" />
          </IonButton>
          <IonButton onClick={() => deleteOneAnchor(anchor.id)}>
            <IonIcon icon={trashOutline} size="small" />
          </IonButton>
        </>
      </IonItemSliding>
    </IonCard>
  );
};
