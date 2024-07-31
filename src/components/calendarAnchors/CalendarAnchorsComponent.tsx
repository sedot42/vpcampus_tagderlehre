import { IonPage } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin from "@fullcalendar/interaction"; // needed for dayClick

export const CalendarAnchorComponent = () => {
  const handleDateClick = (arg: any) => {
    alert(arg.dateStr);
  };

  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />
      {/* <IonContent className="ion-padding"> */}
      <FullCalendar
        plugins={[dayGridPlugin, interactionPlugin]}
        dateClick={handleDateClick}
        initialView="dayGridMonth"
        weekends={false}
      />
      {/* </IonContent> */}
    </IonPage>
  );
};
