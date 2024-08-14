import { IonContent, IonPage, IonToggle } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

// Fullcalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction"; // needed for dateClick

import { transformEvent } from "./CalendarAnchorTransform";
import {
  businessHoursSettings,
  buttonTextSettings,
  eventTimeFormatSetting,
  viewsSettings,
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

  // Function to manually update the calendar size
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
          locale="ch" // Time and Date formatting according to locale
          height="100%" // Set height of Calender to fill whole container -> Must be later set to something different/auto if other children elements are added
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          // Define Header Toolbar Elements
          headerToolbar={{
            right: "today prev,next",
            left: "dayGridMonthCustom,timeGridWeekCustom,timeGridDay",
          }}
          // Define Footer Toolbar Elements
          footerToolbar={{
            right: "",
          }}
          views={{
            day: {
              // Applies to all day views, MUST BE DEFINED HERE DUE TO A TYPE BUG IN FULLCALENDAR!
              dayHeaderFormat: {
                day: "numeric",
                month: "long",
                weekday: "long",
                year: "numeric",
              },
            },
            ...viewsSettings, // Load all other settings from external file
          }}
          initialView="timeGridWeekCustom"
          dateClick={handleDateClick}
          events={mockState.map(transformEvent)} // Load and transform events
          // Customization

          weekNumbers={true}
          weekends={displayWeekends}
          eventTimeFormat={eventTimeFormatSetting} // Load event time format settings
          businessHours={businessHoursSettings}
          buttonText={buttonTextSettings}
        />
      </IonContent>
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
