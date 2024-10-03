import React, { useRef, useState } from "react";
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
}: {
  startTimeFilter: number;
  endTimeFilter: number;
  setStartTimeFilter: React.Dispatch<React.SetStateAction<number>>;
  setEndTimeFilter: React.Dispatch<React.SetStateAction<number>>;
  setSelectedDayFilter: React.Dispatch<React.SetStateAction<Date>>;
  showToastAnchorNoPos: boolean;
  setShowToastAnchorNoPos: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString()); // Added state for selectedDate
  const modal = useRef<HTMLIonModalElement>(null);

  const defaultStartTime = 7;
  const defaultEndTime = 18;

  // Function to handle time changes from the range slider
  const handleTimeChange = (e: CustomEvent) => {
    const { lower, upper } = e.detail.value;
    setStartTimeFilter(lower);
    setEndTimeFilter(upper);
  };

  // Function to handle date selection from IonDatetime
  const handleDateChange = (e: CustomEvent) => {
    const selectedDate = new Date(e.detail.value);
    setSelectedDate(selectedDate.toISOString());
    setSelectedDayFilter(selectedDate);
  };

  const incrementDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() + 1);
    setSelectedDate(newDate.toISOString());
    setSelectedDayFilter(newDate);
  };

  const decrementDate = () => {
    const newDate = new Date(selectedDate);
    newDate.setDate(newDate.getDate() - 1);
    setSelectedDate(newDate.toISOString());
    setSelectedDayFilter(newDate);
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
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            marginTop: "10px",
          }}
        >
          <IonButton onClick={decrementDate}>&lt;</IonButton>
          <IonButton id="filterMenuDateSelection" fill="solid">
            <IonDatetimeButton
              datetime="datetime"
              style={{ width: "100%", height: "100%" }}
            />
          </IonButton>
          <IonButton onClick={incrementDate}>&gt;</IonButton>
        </div>

        <IonModal ref={modal} keepContentsMounted={true} id="dialogSelectFilterDate">
          <IonHeader>
            <IonToolbar>
              <IonTitle>Datum auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={() => modal.current?.dismiss()}>
                  <IonIcon icon={closeOutline} size="large" />
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>

          <div
            style={{ display: "flex", justifyContent: "center", alignItems: "center" }}
          >
            <IonDatetime
              id="datetime"
              presentation="date"
              value={selectedDate}
              onIonChange={handleDateChange}
            />
          </div>

          <IonFooter className="ion-padding">
            <IonButton
              onClick={() => modal.current?.dismiss()}
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
