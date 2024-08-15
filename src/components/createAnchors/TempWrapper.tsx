import { IonButton, IonContent, IonModal, IonPage } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { OverlayEventDetail } from "@ionic/core/components";
import React, { useRef } from "react";
import { CreateAnchorModal } from "./CreateAnchorModal";

export const TempWrapper = () => {
  const modal = useRef<HTMLIonModalElement>(null);
  const input = useRef<HTMLIonInputElement>(null);

  function confirm() {
    modal.current?.dismiss(input.current?.value, "confirm");
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === "confirm") {
      // setMessage(`Hello, ${ev.detail.data}!`);
    }
  }
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
