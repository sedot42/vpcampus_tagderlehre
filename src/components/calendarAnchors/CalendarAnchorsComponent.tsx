import { useState, useRef, useContext, useEffect } from "react";
import { IonPage, IonButton, IonIcon, IonModal } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

type SettingsProps = undefined;

export const CalendarAnchorComponent = () => {
  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />
      <div>Placeholder</div>
    </IonPage>
  );
};
