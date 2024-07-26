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
import { closeOutline, trashOutline } from "ionicons/icons";
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
  const { deleteOneAnchor } = useContext(AnchorContext);
  const config: Config[] = [
    {
      required: true,
      property: "anchor_name",
      placeholder: "Anchor",
      label: "Anchor",
    },
  ];
  for (const key in modalData) {
    if (key !== "anchor_name" && key !== "id") {
      config.push({
        required: false,
        property: key,
        placeholder: "",
        label: key,
      });
    }
  }

  return (
    <IonModal isOpen={openModal} onWillDismiss={() => setOpenModal(false)}>
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
      <IonContent className="ion-padding ion-text-wrap">
        {createInputs(modalData, setModalData, config)}

        <IonButton
          fill="clear"
          color="danger"
          onClick={() => {
            deleteOneAnchor(modalData.id);
            setOpenModal(false);
          }}
        >
          <IonIcon aria-hidden="true" icon={trashOutline} /> Anker löschen
        </IonButton>
        <IonItemDivider />
        <br />
        <IonText color="medium">ID: {modalData.id}</IonText>
        <br />
        <IonText color="medium">Owner ID: {modalData.owner_id}</IonText>
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
