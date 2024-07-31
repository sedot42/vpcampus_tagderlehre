import { IonContent, IonPage, IonToggle } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

// Fullcalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dayClick
import { useState } from "react";

export const CalendarAnchorComponent = () => {
  const handleDateClick = (date: DateClickArg) => {
    //Don't know why this is wrong -> If i define arg: string then datestr is not of this type.
    alert(date.dateStr);
  };

  const [displayWeekends, setDisplayWeekends] = useState(true);
  // const [initialView, setInitialView] = setState("dayGridMonth");

  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />

      <IonContent className="ion-padding">
        <FullCalendar
          height="auto" //"100%"  Set height of Calender to fill whole container -> Must be later set to something different/auto if other children elements are added
          plugins={[dayGridPlugin, interactionPlugin]}
          // Define Header Toolbar Elements
          headerToolbar={{
            right: "today prev,next",
            left: "title",
          }}
          // Define Footer Toolbar Elements
          footerToolbar={{
            right: "dayGridMonth,dayGridWeek,dayGridDay",
          }}
          // Define text of buttons (hardcoded here)
          buttonText={{
            today: "Heute",
            month: "Monat",
            week: "Woche",
            day: "Tag",
          }}
          dateClick={handleDateClick}
          initialView="dayGridMonth"
          weekends={displayWeekends}
        />
        {/* Button to change fullweek/workweek -> Button and state should be moved to options */}
        <IonToggle
          className="ion-padding"
          onClick={() => setDisplayWeekends(displayWeekends ? false : true)}
        >
          Ganze Woche / Arbeitswoche
        </IonToggle>
      </IonContent>
    </IonPage>
  );
};
