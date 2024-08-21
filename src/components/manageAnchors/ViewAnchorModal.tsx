import {
  IonButton,
  IonCard,
  IonContent,
  IonIcon,
  IonLabel,
  IonModal,
} from "@ionic/react";
import { createOutline, mapOutline, trashOutline } from "ionicons/icons";

export const ViewAnchorModal = ({
  showView,
  setShowView,
  showViewEventID,
}: {
  showView: boolean;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  showViewEventID: string;
}) => {
  return (
    <IonModal
      isOpen={showView}
      initialBreakpoint={0.3}
      breakpoints={[0, 0.3, 1]}
      handleBehavior="cycle"
      onIonModalDidDismiss={() => {
        setShowView(false);
      }}
    >
      <IonContent className="ion-padding">
        <IonButton>
          <IonIcon aria-hidden="true" icon={createOutline} size="large" />
          <IonLabel>Verwalten</IonLabel>
        </IonButton>
        <IonButton>
          <IonIcon aria-hidden="true" icon={mapOutline} size="large" />
          <IonLabel>Karte</IonLabel>
        </IonButton>
        <IonButton>
          <IonIcon aria-hidden="true" icon={trashOutline} size="large" />
          <IonLabel>Löschen</IonLabel>
        </IonButton>
        <h2>EVENT TITLE</h2>
        <IonCard>
          <p>Event ID: {showViewEventID}</p>
          <p>Time: ...</p>
          <p>Place: ...</p>
        </IonCard>
      </IonContent>
    </IonModal>
  );
};
