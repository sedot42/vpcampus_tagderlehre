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

export const CreateValidityComponent = ({
  localAnchor,
  setLocalAnchor,
  anchorStartValid,
  setAnchorStartValid,
  anchorEndValid,
  setAnchorEndValid,
}) => {
  // functional components for valid allocation
  const [useValid, setUseValid] = useState<boolean>(false); // status whether valid should be set or not

  // show validity selection when toggle is activated
  const addValid = () => {
    if (useValid) {
      setUseValid(false);
      document.getElementById("validContainer")!.style.display = "none";
    } else {
      setUseValid(true);
      document.getElementById("validContainer")!.style.display = "inline";
    }
  };

  // update the valid starttime by event (input)
  function updateStartValidInput(event: CustomEvent) {
    setAnchorStartValid(event.detail.value);
  }

  // update the valid endtime by event (input)
  function updateEndValidInput(event: CustomEvent) {
    setAnchorEndValid(event.detail.value);
  }

  // changing the dates in the event of changes in time or use
  useEffect(() => {
    if (useValid) {
      setLocalAnchor({
        ...localAnchor,
        valid_from:
          anchorStartValid != "" ? (anchorStartValid as string) + ".000Z" : undefined,
        valid_until:
          anchorEndValid != "" ? (anchorEndValid as string) + ".000Z" : undefined,
      });
    } else {
      setLocalAnchor({
        ...localAnchor,
        valid_from: undefined,
        valid_until: undefined,
      });
    }
  }, [useValid, anchorStartValid, anchorEndValid]);

  return (
    <>
      <IonItem lines="none" id="useValidToggle" style={{ margin: "16px 0 0 0" }}>
        <IonToggle onIonChange={addValid} labelPlacement="start">
          Gültigkeit
        </IonToggle>
      </IonItem>
      <div id="validContainer">
        <IonItem lines="none">
          <IonLabel>Start</IonLabel>
          <IonDatetimeButton datetime="starttimevalid">
            {anchorStartValid === "" && <IonLabel slot="date-target">Datum</IonLabel>}
            {anchorStartValid === "" && <IonLabel slot="time-target">Zeit</IonLabel>}
          </IonDatetimeButton>
        </IonItem>
        <IonItem lines="none">
          <IonLabel>Ende</IonLabel>
          <IonDatetimeButton datetime="endtimevalid">
            {anchorEndValid === "" && <IonLabel slot="date-target">Datum</IonLabel>}
            {anchorEndValid === "" && <IonLabel slot="time-target">Zeit</IonLabel>}
          </IonDatetimeButton>
        </IonItem>
        <IonModal keepContentsMounted={true} id="dialogSelectValidStart">
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Startzeit auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() =>
                    (
                      document.getElementById(
                        "dialogSelectValidStart"
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
            max={anchorEndValid}
            id="starttimevalid"
            onIonChange={(e) => updateStartValidInput(e)}
          ></IonDatetime>
          <IonFooter class="ion-padding">
            <IonButton
              onClick={() => {
                (
                  document.getElementById(
                    "dialogSelectValidStart"
                  )! as HTMLIonModalElement
                ).dismiss();
              }}
              expand="full"
              color="primary"
            >
              Speichern
            </IonButton>
          </IonFooter>
        </IonModal>
        <IonModal keepContentsMounted={true} id="dialogSelectValidEnd">
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Endzeit auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() =>
                    (
                      document.getElementById(
                        "dialogSelectValidEnd"
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
            min={anchorStartValid}
            id="endtimevalid"
            onIonChange={(e) => updateEndValidInput(e)}
          ></IonDatetime>
          <IonFooter class="ion-padding">
            <IonButton
              onClick={() => {
                (
                  document.getElementById("dialogSelectValidEnd")! as HTMLIonModalElement
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

export default CreateValidityComponent;
