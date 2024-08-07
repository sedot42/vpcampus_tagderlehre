import { IonPage, IonContent } from "@ionic/react";
import { StatusHeader } from "../../globalUI/StatusHeader";

import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

export const CalendarAnchorComponent = () => {
  const localizer = momentLocalizer(moment); // or globalizeLocalizer

  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />
      <IonContent className="ion-padding">
        <div className="myCustomHeight">
          <Calendar
            localizer={localizer}
            events={[]}
            startAccessor="start"
            endAccessor="end"
          />
        </div>
        {/* <div className="SetTime">
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
        </div> */}
      </IonContent>
    </IonPage>
  );
};
