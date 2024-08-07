import { IonItem, IonText } from "@ionic/react";

export const SettingsComponentCalendar = () => {
  return (
    <IonItem
      lines="none"
      style={{
        marginLeft: "-16px",
        marginRight: "-16px",
        "--background": "transparent",
      }}
    >
      <IonText class="ion-text-wrap">
        <h4>Kalender Einstellungen (Platzhalter)</h4>
        <p>- Calendar Inital View: Month, Week, Day </p>
        <p>- Display full week/work week</p>
        <p>- Start of day time (slotMinTime)</p>
        <p>- End of day time (slotMaxTime)</p>
      </IonText>
    </IonItem>
  );
};
