import { IonButton, IonContent, IonPage, IonToggle } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

// Fullcalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dayClick

import { transformEvent } from "./CalendarAnchorTransform";
import {
  businessHoursSettings,
  buttonTextSettings,
  timeGridSettings,
} from "./CalendarAnchorSettings";
import { mockState } from "../../mockState";
import { RefObject, useRef, useState } from "react";

export const CalendarAnchorComponent = () => {
  const [displayWeekends, setDisplayWeekends] = useState(true);
  // Create reference to the calendar (Needs to be checked against 0)
  const calendarRef = useRef<FullCalendar>(null);

  const handleDateClick = (date: DateClickArg) => {
    alert(date.dateStr);
  };

  //
  function updateCalendarSize(calendarRef: RefObject<FullCalendar>) {
    if (calendarRef.current !== null) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.updateSize();
      console.log("display update");
    }
  }

  setTimeout(() => updateCalendarSize(calendarRef), 50); // Hack because FullCalendar currently displays the initial view wrong!

  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />

      <IonContent className="ion-padding">
        <FullCalendar
          ref={calendarRef}
          height="100%" // Set height of Calender to fill whole container -> Must be later set to something different/auto if other children elements are added
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          // Define Header Toolbar Elements
          ///stickyHeaderDates={true}
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
          businessHours={businessHoursSettings}
          dateClick={handleDateClick}
          initialView="timeGridWeek"
          weekends={displayWeekends}
          events={mockState.map(transformEvent)}
        />
      </IonContent>
      <IonButton className="ion-padding" onClick={() => updateCalendarSize(calendarRef)}>
        UpdateSize
      </IonButton>
      {/* Button to change fullweek/workweek -> Button and state should be moved to options */}
      <IonToggle
        className="ion-padding"
        onClick={() => setDisplayWeekends(displayWeekends ? false : true)}
      >
        Ganze Woche / Arbeitswoche
      </IonToggle>
    </IonPage>
  );
};
