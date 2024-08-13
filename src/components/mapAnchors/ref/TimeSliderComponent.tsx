import React, { useState } from "react";
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

export const TimeSliderComponent = ({
  startTimeFilter,
  endTimeFilter,
  setStartTimeFilter,
  setEndTimeFilter,
  setSelectedDayFilter,
  showToastAnchorNoPos,
  setShowToastAnchorNoPos,
}) => {
  // Default values if not provided
  const defaultStartTime = 7;
  const defaultEndTime = 18;

  // Function to handle time changes from the range slider
  const handleTimeChange = (e) => {
    const { lower, upper } = e.detail.value;
    setStartTimeFilter(lower);
    setEndTimeFilter(upper);
  };

  // Function to handle date selection from IonDatetime
  const handleDateChange = (e) => {
    const selectedDate = new Date(e.detail.value);
    setSelectedDayFilter(selectedDate);
  };

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
          pinFormatter={(value) => `${value}:00`}
          value={{
            lower: startTimeFilter ?? defaultStartTime,
            upper: endTimeFilter ?? defaultEndTime,
          }}
          onIonChange={handleTimeChange}
        />
        <IonDatetimeButton
          id="filterMenuDateSelection"
          datetime="datetime"
        ></IonDatetimeButton>

        <IonModal keepContentsMounted={true} id="dialogSelectFilterDate">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Datum auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() =>
                    document.getElementById("dialogSelectFilterDate").dismiss()
                  }
                >
                  <IonIcon icon={closeOutline} size="large" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonDatetime id="datetime" presentation="date" onIonChange={handleDateChange} />
          <IonFooter className="ion-padding">
            <IonButton
              onClick={() => document.getElementById("dialogSelectFilterDate").dismiss()}
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
          color="warning"
          position="top"
          message="Anker verfügt über keine räumliche Zuordnung."
          duration={1200}
          icon={alertCircleOutline}
        />
      </IonFooter>
    </>
  );
};
