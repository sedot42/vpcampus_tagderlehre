import { useRef } from "react";
import {
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonLabel,
  IonItem,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";
import { AnchorCreateProps } from "./_unused/CreateAnchorModal";

export const DateComponent = ({ localAnchor, setLocalAnchor }: AnchorCreateProps) => {
  type allowedProperties = "start_at" | "end_at" | "valid_from" | "valid_until";

  const datetime = useRef<null | HTMLIonDatetimeElement>(null);

  const writeDateToAnchor = (timestamp: string, property: allowedProperties) => {
    timestamp && setLocalAnchor({ ...localAnchor, [property]: timestamp });
  };

  return (
    <>
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
          showDefaultButtons
          preferWheel
          ref={datetime}
          onIonChange={(event) =>
            writeDateToAnchor(event.detail.value as string, "start_at")
          }
        ></IonDatetime>
      </IonModal>
      <IonModal keepContentsMounted={true}>
        <IonDatetime
          id="endtime"
          showDefaultButtons
          preferWheel
          presentation="date-time"
          onIonChange={(event) =>
            writeDateToAnchor(event.detail.value as string, "end_at")
          }
        ></IonDatetime>
      </IonModal>
    </>
  );
};
