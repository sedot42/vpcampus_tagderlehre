import { useState, useEffect } from "react";
import {
  IonButton,
  IonFooter,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonLabel,
  IonItem,
  IonToggle,
  IonHeader,
  IonIcon,
  IonTitle,
  IonButtons,
  IonToolbar,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";

export const CreateDateComponent = ({
  localAnchor,
  setLocalAnchor,
  anchorStartDate,
  setAnchorStartDate,
  anchorEndDate,
  setAnchorEndDate,
}) => {
  // functional components for date allocation
  const [useDate, setUseDate] = useState<boolean>(false); // status whether date should be set or not

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

  // update the starttime by event (input)
  function updateStartTimeInput(event: CustomEvent) {
    setAnchorStartDate(event.detail.value);
  }

  // update the endtime by event (input)
  function updateEndTimeInput(event: CustomEvent) {
    setAnchorEndDate(event.detail.value);
  }

  // changing the dates in the event of changes in time or use
  useEffect(() => {
    if (useDate) {
      setLocalAnchor({
        ...localAnchor,
        start_at:
          anchorStartDate != "" ? (anchorStartDate as string) + ".000Z" : undefined,
        end_at: anchorEndDate != "" ? (anchorEndDate as string) + ".000Z" : undefined,
      });
    } else {
      setLocalAnchor({
        ...localAnchor,
        start_at: undefined,
        end_at: undefined,
      });
    }
  }, [useDate, anchorStartDate, anchorEndDate]);

  return (
    <>
      {/* part for entering date */}
      <IonItem lines="none" id="useDateToggle" style={{ margin: "16px 0 0 0" }}>
        <IonToggle onIonChange={addDate} labelPlacement="start">
          Termin
        </IonToggle>
      </IonItem>
      <div id="dateContainer">
        <IonItem lines="none">
          <IonLabel>Start</IonLabel>
          <IonDatetimeButton datetime="starttime">
            {anchorStartDate === "" && <IonLabel slot="date-target">Datum</IonLabel>}
            {anchorStartDate === "" && <IonLabel slot="time-target">Zeit</IonLabel>}
          </IonDatetimeButton>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Ende</IonLabel>
          <IonDatetimeButton datetime="endtime">
            {anchorEndDate === "" && <IonLabel slot="date-target">Datum</IonLabel>}
            {anchorEndDate === "" && <IonLabel slot="time-target">Zeit</IonLabel>}
          </IonDatetimeButton>
        </IonItem>
        <IonModal keepContentsMounted={true} id="dialogSelectDateStart">
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Startzeit auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() =>
                    (
                      document.getElementById(
                        "dialogSelectDateStart"
                      ) as HTMLIonModalElement
                    ).dismiss()
                  }
                >
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonDatetime
            max={anchorEndDate}
            id="starttime"
            onIonChange={(e) => updateStartTimeInput(e)}
          ></IonDatetime>
          <IonFooter class="ion-padding">
            <IonButton
              onClick={() => {
                (
                  document.getElementById("dialogSelectDateStart")! as HTMLIonModalElement
                ).dismiss();
              }}
              expand="full"
              color="primary"
            >
              Speichern
            </IonButton>
          </IonFooter>
        </IonModal>
        <IonModal keepContentsMounted={true} id="dialogSelectDateEnd">
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Endzeit auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() =>
                    (
                      document.getElementById(
                        "dialogSelectDateEnd"
                      ) as HTMLIonModalElement
                    ).dismiss()
                  }
                >
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonDatetime
            min={anchorStartDate}
            id="endtime"
            onIonChange={(e) => updateEndTimeInput(e)}
          ></IonDatetime>
          <IonFooter class="ion-padding">
            <IonButton
              onClick={() => {
                (
                  document.getElementById("dialogSelectDateEnd")! as HTMLIonModalElement
                ).dismiss();
              }}
              expand="full"
              color="primary"
            >
              Speichern
            </IonButton>
          </IonFooter>
        </IonModal>
      </div>
    </>
  );
};
