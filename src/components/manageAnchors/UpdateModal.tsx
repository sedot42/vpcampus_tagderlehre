import { Anchor, convertFlatAnchorToDBAnchor } from "../../types/types";
import { useContext } from "react";

import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonModal,
  IonButtons,
  IonFooter,
  IonIcon,
  IonText,
  IonItemDivider,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { Config, createInputs } from "../globalUI/GenericFields";
import { AnchorContext } from "../../anchorContext";

export const UpdateModal = ({
  modalData,
  setModalData,
  openModal,
  setOpenModal,
}: {
  modalData: Anchor;
  setModalData: (anchor: Anchor) => void;
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
}) => {
  const { updateOneAnchor } = useContext(AnchorContext);
  const config: Config[] = [
    {
      required: true,
      property: "owner_id",
      placeholder: "Owner",
      label: "Owner",
    },
    {
      required: true,
      property: "anchor_name",
      placeholder: "Anchor",
      label: "Anchor",
    },
  ];

  return (
    <IonModal isOpen={openModal}>
      <IonHeader>
        <IonToolbar>
          <IonIcon size="large" slot="start"></IonIcon>
          <IonTitle style={{ textAlign: "center" }}>Anker bearbeiten</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpenModal(false)}>
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {createInputs(modalData, setModalData, config)}
        <IonItemDivider />
        <br />
        <IonText color="medium">ID: {modalData.id}</IonText>
        <br />
        <IonText color="medium">Created: {modalData.created_at}</IonText>
        <br />
        <IonText color="medium">Updated: {modalData.updated_at}</IonText>
      </IonContent>
      <IonFooter style={{ display: "flex", justifyContent: "center" }}>
        <IonButton
          fill="clear"
          strong={true}
          onClick={() => {
            // convert from flat to nested for DB update
            updateOneAnchor(convertFlatAnchorToDBAnchor(modalData));
            setOpenModal(false);
          }}
        >
          Speichern
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};
