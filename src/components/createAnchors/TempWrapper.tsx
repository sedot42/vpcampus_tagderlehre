import { IonButton, IonContent, IonModal, IonPage } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { OverlayEventDetail } from "@ionic/core/components";
import { useRef } from "react";
import { CreateAnchorModal } from "./CreateAnchorModal";

export const TempWrapper = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {}
  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />
      <IonButton id="open-modal" expand="block">
        Open
      </IonButton>
      <IonModal
        style={{ "--min-height": "100vh", "--min-width": "100vw" }}
        ref={modal}
        trigger="open-modal"
        onWillDismiss={(ev) => onWillDismiss(ev)}
      >
        <CreateAnchorModal></CreateAnchorModal>
      </IonModal>

      <IonContent className="ion-padding"></IonContent>
    </IonPage>
  );
};
