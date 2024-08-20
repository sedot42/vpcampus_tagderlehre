import { IonButton, IonContent, IonIcon, IonLabel, IonModal } from "@ionic/react";
import { addOutline } from "ionicons/icons";

export const CalendarAnchorCreate = ({
  showCreate,
  setShowCreate,
  setMarkerPosition,
  coords,
}) => {
  // IMPORTANT TO READ:
  // Currently we redirect to the "Erstellen" Tab
  // According to React / navigation / Switching Between Tabs: One should never redirect from one tab to another tab!
  // Therefore later this modal must be replaced by the new "create" Modal which will replace the "create" Tab
  // The props createStart and createEnd must be passed to the modal -> Not done now, as the "Erstellen" Tab is getting refactored!
  console.log("ola");
  return (
    <IonContent>
      <IonModal
        isOpen={showCreate}
        initialBreakpoint={0.3}
        breakpoints={[0, 0.3]}
        onIonModalDidDismiss={() => {
          setShowCreate(false);
          setMarkerPosition(null);
        }}
      >
        <IonContent className="ion-padding">
          <IonButton
            routerLink="/createAnchors"
            routerDirection="forward"
            onClick={() => setShowCreate(false)}
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
            onClick={() => {
              setShowCreate(false);
              setMarkerPosition(null);
            }}
          >
            <IonLabel>Schliessen</IonLabel>
          </IonButton>
        </IonContent>
      </IonModal>
    </IonContent>
  );
};
