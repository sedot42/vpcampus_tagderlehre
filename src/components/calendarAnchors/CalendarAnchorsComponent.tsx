import { IonContent, IonPage, IonToggle } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

// Fullcalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dayClick
import { useState } from "react";

export const CalendarAnchorComponent = () => {
  const handleDateClick = (date: DateClickArg) => {
    //Don't know why this is wrong -> If i define arg: string then datestr is not of this type.
    alert(date.dateStr);
  };

  const [displayWeekends, setDisplayWeekends] = useState(true);

  const timeGridSettings = {
    type: "timeGrid",
    slotMinTime: "06:00:00",
    slotMaxTime: "18:00:00",
    scrollTime: "06:00:00",
    nowIndicator: true,
  };

  const buttonTextSettings = {
    today: "Heute",
    month: "Monat",
    week: "Woche",
    day: "Tag",
  };

  // Test interface for events
  interface Event {
    id: string;
    title: string;
    start: string;
    end: string;
  }

  // Two test events as Fullcalendar objects
  const events: Event[] = [
    {
      id: "a",
      title: "testevent",
      start: "2024-07-31T12:15:00",
      end: "2024-07-31T16:30:00",
    },
    {
      id: "b",
      title: "test meeting",
      start: "2024-08-02T08:15:00",
      end: "2024-08-02T11:30:00",
    },
  ];

  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />

      <IonContent className="ion-padding">
        <FullCalendar
          height="auto" //"100%"  Set height of Calender to fill whole container -> Must be later set to something different/auto if other children elements are added
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          // Define Header Toolbar Elements
          stickyHeaderDates={true}
          weekNumbers={true}
          headerToolbar={{
            right: "today prev,next",
            left: "dayGridMonth,timeGridWeek,timeGridDay",
          }}
          // Define Footer Toolbar Elements
          footerToolbar={{
            right: "",
          }}
          // Define text of buttons (hardcoded in variable above)
          buttonText={buttonTextSettings}
          // Load view settings which are defined above (Should later be defined in Options)
          views={{
            timeGridWeek: timeGridSettings,
            timeGridDay: timeGridSettings,
          }}
          dateClick={handleDateClick}
          initialView="dayGridWeek"
          weekends={displayWeekends}
          events={events}
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
