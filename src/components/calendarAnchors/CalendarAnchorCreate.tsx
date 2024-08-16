import { IonButton, IonContent, IonIcon, IonLabel, IonModal } from "@ionic/react";
import { addOutline } from "ionicons/icons";

export const CalendarAnchorCreate = ({
  showCreate,
  setShowCreate,
  createStart,
  createEnd,
}: {
  showCreate: boolean;
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  createStart: string;
  createEnd: string;
}) => {
  // IMPORTANT TO READ:
  // Currently we redirect to the "Erstellen" Tab
  // According to React / navigation / Switching Between Tabs: One should never redirect from one tab to another tab!
  // Therefore later this modal must be replaced by the new "create" Modal which will replace the "create" Tab
  // The props createStart and createEnd must be passed to the modal -> Not done now, as the "Erstellen" Tab is getting refactored!

  return (
    <IonModal
      isOpen={showCreate}
      initialBreakpoint={0.3}
      breakpoints={[0, 0.3]}
      onIonModalDidDismiss={() => setShowCreate(false)}
    >
      <IonContent className="ion-padding">
        <IonButton
          routerLink="/createAnchors" // go to create Anchor
          routerDirection="forward" // forward movement
          onClick={() => setShowCreate(false)} // close Modal on move
          expand="block"
          className="ion-padding"
        >
          <IonIcon aria-hidden="true" icon={addOutline} size="large" />
          <IonLabel>Anker erstellen</IonLabel>
        </IonButton>
        <IonButton
          expand="block"
          fill="outline"
          color="medium"
          className="ion-padding"
          onClick={() => setShowCreate(false)}
        >
          <IonLabel>Schliessen</IonLabel>
        </IonButton>
      </IonContent>
    </IonModal>
  );
};
