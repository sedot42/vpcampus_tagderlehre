import { IonPage } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

// Fullcalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dayClick

export const CalendarAnchorComponent = () => {
  const handleDateClick = (date: DateClickArg) => {
    //Don't know why this is wrong -> If i define arg: string then datestr is not of this type.
    alert(date.dateStr);
  };

  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />
      {/* <IonContent className="ion-padding"> */}

      <FullCalendar
        height="100%" // Set height of Calender to fill whole container -> Must be later set to something different/auto if other children elements are added
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={handleDateClick}
        initialView="dayGridMonth"
        weekends={false}
      />
      {/* </IonContent> */}
    </IonPage>
  );
};
