import {
  IonModal,
  IonHeader,
  IonToolbar,
  IonButton,
  IonTitle,
  IonButtons,
  IonFooter,
  IonIcon,
  IonDatetimeButton,
  IonDatetime,
  IonToast,
  IonRange,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";
import { closeOutline, alertCircleOutline } from "ionicons/icons";
import "./map.css";
import { useState } from "react";

interface TimeSliderComponentProps {
  anchors: any[];
  startTimeFilter: number;
  endTimeFilter: number;
  setStartTimeFilter: (value: number) => void;
  setEndTimeFilter: (value: number) => void;
  setSelectedDayFilter: (date: Date) => void;
  showToastAnchorNoPos: boolean;
  setShowToastAnchorNoPos: (value: boolean) => void;
}

export const TimeSliderComponent: React.FC<TimeSliderComponentProps> = ({
  anchors,
  startTimeFilter,
  endTimeFilter,
  setStartTimeFilter,
  setEndTimeFilter,
  setSelectedDayFilter,
  showToastAnchorNoPos,
  setShowToastAnchorNoPos,
}) => {
  if (!startTimeFilter) {
    startTimeFilter = 7;
  }
  if (!endTimeFilter) {
    endTimeFilter = 18;
  }

  return (
    <>
      <IonFooter id="footerTimeLineFilter" className="ion-padding">
        <IonRange
          dualKnobs={true}
          min={0}
          max={24}
          step={1}
          pin={true}
          ticks={true}
          snaps={true}
          pinFormatter={(value: number) => `${value}:00`}
          value={{ lower: startTimeFilter, upper: endTimeFilter }}
          onIonChange={(e) => {
            const { lower, upper } = e.detail.value as {
              lower: number;
              upper: number;
            };
            setStartTimeFilter(lower);
            setEndTimeFilter(upper);
          }}
        />
        <IonDatetimeButton
          id="filterMenuDateSelection"
          datetime="datetime"
        ></IonDatetimeButton>

        <IonModal keepContentsMounted={true} id="dialogSelectFilterDate">
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Datum auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() =>
                    (
                      document.getElementById(
                        "dialogSelectFilterDate"
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
            id="datetime"
            presentation="date"
            onIonChange={(e) => setSelectedDayFilter(new Date(e.detail.value! + ".000Z"))}
          ></IonDatetime>
          <IonFooter className="ion-padding">
            <IonButton
              onClick={() =>
                (
                  document.getElementById(
                    "dialogSelectFilterDate"
                  )! as HTMLIonModalElement
                ).dismiss()
              }
              expand="full"
              color="primary"
            >
              Speichern
            </IonButton>
          </IonFooter>
        </IonModal>
        <IonToast
          isOpen={showToastAnchorNoPos}
          onDidDismiss={() => setShowToastAnchorNoPos(false)}
          style={{ height: 80 }}
          color={"warning"}
          position="top"
          message={"Anker verfügt über keine räumliche Zuordnung."}
          duration={1200}
          icon={alertCircleOutline}
        ></IonToast>
      </IonFooter>
    </>
  );
};
