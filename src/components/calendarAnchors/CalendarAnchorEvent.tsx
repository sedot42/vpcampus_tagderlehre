import { IonButton, IonContent, IonIcon, IonLabel, IonModal } from "@ionic/react";
import { addOutline } from "ionicons/icons";

export const CalendarAnchorEvent = ({
  showEvent,
  setShowEvent,
}: {
  showEvent: boolean;
  setShowEvent: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <IonContent>
      <IonModal
        isOpen={showEvent}
        initialBreakpoint={0.3}
        breakpoints={[0, 0.3]}
        onIonModalDidDismiss={() => setShowEvent(false)}
      >
        <IonContent className="ion-padding">
          <IonLabel>Anker Information</IonLabel>
          {/* <IonButton
            routerLink="/createAnchors" // go to create Anchor
            routerDirection="forward" // forward movement
            onClick={() => setShowCreate(false)} // close Modal on move
            expand="block"
            className="ion-padding"
          >
            <IonIcon aria-hidden="true" icon={addOutline} size="large" />
            <IonLabel>Anker erstellen</IonLabel>
          </IonButton> */}
          <IonButton
            expand="block"
            fill="outline"
            color="medium"
            className="ion-padding"
            onClick={() => setShowEvent(false)}
          >
            <IonLabel>Schliessen</IonLabel>
          </IonButton>
        </IonContent>
      </IonModal>
    </IonContent>
  );
};
