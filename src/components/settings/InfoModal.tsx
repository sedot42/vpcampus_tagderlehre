import {
  IonContent,
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonFooter,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";

type SelectionModalProps = {
  closeModal: () => void;
  isOpen: boolean;
  headerText: string;
};

export const InfoModal = ({ closeModal, isOpen, headerText }: SelectionModalProps) => {
  return (
    <IonModal
      id="dialogFilterInfo"
      isOpen={isOpen}
      onDidDismiss={() => closeModal()}
      style={{ "--min-height": "100vh", "--min-width": "100vw" }}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">{headerText}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                closeModal();
              }}
            >
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        Basierend auf den Einstellungen werden relevante Informationen vorgefiltert und
        ausgewählt.
      </IonContent>
      <IonFooter class="ion-padding">
        <IonButton
          onClick={() => {
            closeModal();
          }}
          expand="full"
          color="primary"
        >
          Ok
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};
