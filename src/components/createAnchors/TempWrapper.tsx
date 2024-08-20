import { IonButton, IonContent, IonModal, IonPage } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { useState } from "react";
import { CreateAnchorModal } from "./_unused/CreateAnchorModal";

export const TempWrapper = () => {
  const [modalOpen, setModalOpen] = useState(false);
  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />
      <IonButton onClick={() => setModalOpen(true)} expand="block">
        Open
      </IonButton>
      <IonModal
        style={{ "--min-height": "100vh", "--min-width": "100vw" }}
        isOpen={modalOpen}
      >
        <CreateAnchorModal closeModal={() => setModalOpen(false)}></CreateAnchorModal>
      </IonModal>

      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  );
};
