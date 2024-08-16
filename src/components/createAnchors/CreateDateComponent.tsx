import { useState } from "react";
import {
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonLabel,
  IonItem,
  IonToggle,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";
import { AnchorCreateProps } from "./CreateAnchorModal";

export const CreateDateComponent = ({
  localAnchor,
  setLocalAnchor,
}: AnchorCreateProps) => {
  // functional components for date allocation
  const [useDate, setUseDate] = useState<boolean>(false); // status whether date should be set or not
  const now = new Date().toISOString();
  // show data selection when toggle is activated
  const addDate = () => {
    if (useDate) {
      setUseDate(false);
      document.getElementById("dateContainer")!.style.display = "none";
    } else {
      setUseDate(true);
      document.getElementById("dateContainer")!.style.display = "inline";
    }
  };

  type allowedProperties = "start_at" | "end_at" | "valid_from" | "valid_until";

  const writeDateToAnchor = (timestamp: string, property: allowedProperties) =>
    timestamp && setLocalAnchor({ ...localAnchor, [property]: timestamp });

  return (
    <>
      {/* part for entering date */}
      <IonItem lines="none" id="useDateToggle" style={{ margin: "16px 0 0 0" }}>
        <IonToggle onIonChange={addDate} labelPlacement="start">
          Termin
        </IonToggle>
      </IonItem>
      <div id="dateContainer">
        <IonItem>
          <IonLabel>Start</IonLabel>
          <IonDatetimeButton datetime="starttime"></IonDatetimeButton>
        </IonItem>
        <IonItem>
          <IonLabel>Ende</IonLabel>
          <IonDatetimeButton datetime="endtime"></IonDatetimeButton>
        </IonItem>
        <IonModal keepContentsMounted={true}>
          <IonDatetime
            id="starttime"
            presentation="date-time"
            onIonChange={(event) =>
              writeDateToAnchor(event.detail.value as string, "start_at")
            }
            value={now}
          ></IonDatetime>
        </IonModal>
        <IonModal keepContentsMounted={true}>
          <IonDatetime
            id="endtime"
            presentation="date-time"
            onIonChange={(event) =>
              writeDateToAnchor(event.detail.value as string, "end_at")
            }
            value={now}
          ></IonDatetime>
        </IonModal>
      </div>
    </>
  );
};
