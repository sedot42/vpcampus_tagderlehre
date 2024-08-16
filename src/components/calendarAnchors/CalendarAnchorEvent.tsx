import {
  IonButton,
  IonCard,
  IonContent,
  IonIcon,
  IonLabel,
  IonModal,
  IonNote,
} from "@ionic/react";
import { createOutline, mapOutline, trashOutline } from "ionicons/icons";

export const CalendarAnchorEvent = ({
  showEvent,
  setShowEvent,
  eventID,
}: {
  showEvent: boolean;
  setShowEvent: React.Dispatch<React.SetStateAction<boolean>>;
  eventID: string;
}) => {
  return (
    <IonContent>
      <IonModal
        isOpen={showEvent}
        initialBreakpoint={0.3}
        breakpoints={[0, 0.3, 1]}
        handleBehavior="cycle"
        onIonModalDidDismiss={() => setShowEvent(false)}
      >
        <IonContent className="ion-padding">
          <IonLabel>
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
              <p>Event ID: {eventID}</p>
              <p>Time: ...</p>
              <p>Place: ...</p>
            </IonCard>
            <IonNote>
              <div>
                Placeholder here: All contributors should decide how the Event information
                Modal should be designed
              </div>
              <p>More Information</p>
              <p>More Information</p>
              <p>More Information</p>
              <p>More Information</p>
              <p>More Information</p>
              <p>More Information</p>
            </IonNote>
          </IonLabel>

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
