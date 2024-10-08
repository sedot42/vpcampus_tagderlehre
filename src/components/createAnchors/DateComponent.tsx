import { useEffect, useRef } from "react";
import {
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonLabel,
  IonItem,
} from "@ionic/react";
import { Anchor, DraftAnchor } from "../../types/types";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";

export const DateComponent = ({
  localAnchor,
  setLocalAnchor,
}: {
  localAnchor: DraftAnchor<Anchor>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
}) => {
  type allowedProperties = "start_at" | "end_at" | "valid_from" | "valid_until";
  const datetimeRef = useRef<null | HTMLIonDatetimeElement>(null);
  const writeDateToAnchor = (timestamp: string, property: allowedProperties) => {
    return timestamp && setLocalAnchor({ ...localAnchor, [property]: timestamp });
  };

  useEffect(() => {
    // Set an initial date once
    if (localAnchor.start_at === undefined && localAnchor.end_at === undefined)
      setLocalAnchor({
        ...localAnchor,
        start_at: new Date().toISOString(),
        end_at: new Date().toISOString(),
      });
  }, [localAnchor, setLocalAnchor]);

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
          value={localAnchor.start_at}
          presentation="date-time"
          showDefaultButtons
          preferWheel
          ref={datetimeRef}
          onIonChange={(event) =>
            writeDateToAnchor(event.detail.value as string, "start_at")
          }
        ></IonDatetime>
      </IonModal>
      <IonModal keepContentsMounted={true}>
        <IonDatetime
          id="endtime"
          value={localAnchor.end_at}
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
