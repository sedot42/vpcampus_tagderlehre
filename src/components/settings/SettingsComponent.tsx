import { useState, useRef, useContext, useEffect } from "react";
import { IonPage, IonButton, IonIcon, IonModal } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

type SettingsProps = undefined;

export const SettingsComponent = () => {
  return (
    <IonPage>
      <StatusHeader titleText="Einstellungen" />
      <div>Placeholder</div>
    </IonPage>
  );
};
