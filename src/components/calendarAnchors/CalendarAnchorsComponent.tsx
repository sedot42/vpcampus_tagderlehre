import { useState, useRef, useContext, useEffect } from "react";
import { IonPage, IonButton, IonIcon, IonModal, IonContent } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { IonDatetime } from "@ionic/react";
import { DisplayDateTestComponent } from "./DisplayDateTestComponent";

export const CalendarAnchorComponent = () => {
  const [count, setCount] = useState(0);
  const [dateTime, setdateTime] = useState<string | null>(null);

  /** Function to get the IonDatetime and add it to the state */
  const handleDateChange = (event: CustomEvent) => {
    const date_string = new Date(
      event.detail.value
    ); /** Convert String from IonDatetime to JS Date */
    const date = date_string.toLocaleDateString("de-CH"); /** Convert Date format */

    setdateTime(date);
  };

  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />
      <IonContent className="ion-padding">
        <div className="SetTime">
          <h1>Set Time</h1>
          <IonDatetime
            placeholder="Select Date"
            value={dateTime}
            onIonChange={handleDateChange}
          ></IonDatetime>
          The selected date is: {dateTime}
        </div>
        <div className="Counter">
          <h1>Header 1</h1>
          <IonButton onClick={() => setCount(count + 1)}>Count 1 up</IonButton>
          <button> </button>
          <p>This is a counter with {count} counts</p>
        </div>
        <div>
          <DisplayDateTestComponent dateTime={dateTime}></DisplayDateTestComponent>
        </div>
      </IonContent>
    </IonPage>
  );
};
