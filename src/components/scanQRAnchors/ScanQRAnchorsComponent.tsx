import { IonContent, IonItem, IonPage } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

export const ScanQRAnchorsComponent = () => {
  return (
    <IonPage>
      <StatusHeader titleText="QR Scanner" />
      <IonContent className="ion-padding" fullscreen>
        <IonItem>Placeholder QR Scanner</IonItem>
      </IonContent>
    </IonPage>
  );
};
