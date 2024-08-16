import { IonContent, IonPage, IonToggle, useIonViewDidEnter } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";

// Fullcalendar imports
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";

import { transformEvent } from "./CalendarAnchorTransform";
import {
  businessHoursSettings,
  buttonTextSettings,
  eventTimeFormatSetting,
  viewsSettings,
} from "./CalendarAnchorSettings";
import { mockState } from "../../mockState";
import { RefObject, useRef, useState } from "react";
import { CalendarAnchorCreate } from "./CalendarAnchorCreate";
import { DateSelectArg } from "@fullcalendar/core";
import { CalendarAnchorEvent } from "./CalendarAnchorEvent";

export const CalendarAnchorComponent = () => {
  const [displayWeekends, setDisplayWeekends] = useState(true);

  // Create reference to the calendar (Needs to be checked against 0)
  const calendarRef = useRef<FullCalendar>(null);

  // Function for select interaction
  function handleSelect(eventInfo: DateSelectArg) {
    setCreateStart(eventInfo.startStr);
    setCreateEnd(eventInfo.endStr);
    setShowCreate(true);
  }
  const [showCreate, setShowCreate] = useState<boolean>(false);
  const [createStart, setCreateStart] = useState<string>("");
  const [createEnd, setCreateEnd] = useState<string>("");

  // function for event interaction
  function handleEvent(event: EventInput) {
    setShowEvent(true);
    setEventID(event.event.id);
    //console.log(event.event);
  }
  const [showEvent, setShowEvent] = useState<boolean>(false);
  const [eventID, setEventID] = useState<string>("");

  // Function to manually update the calendar size
  function updateCalendarSize(calendarRef: RefObject<FullCalendar>) {
    if (calendarRef.current !== null) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.updateSize();
    }
  }

  // Hack because FullCalendar currently renders wrong on ionic component load
  // When Ion component is entered, the calendar size should be updated
  useIonViewDidEnter(() => {
    updateCalendarSize(calendarRef);
  });

  return (
    <IonPage>
      <StatusHeader titleText="Kalender" />

      <IonContent className="ion-padding">
        <FullCalendar
          ref={calendarRef}
          locale="ch" // Time and Date formatting according to locale
          events={mockState.map(transformEvent)} // Load and transform events
          height="100%" // Set height of Calender to fill whole container -> Must be later set to something different/auto if other children elements are added
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          //
          // Define Header Toolbar Elements
          headerToolbar={{
            right: "today prev,next",
            left: "dayGridMonthCustom,timeGridWeekCustom,timeGridDay",
          }}
          // Define Footer Toolbar Elements
          footerToolbar={{
            right: "",
          }}
          //
          // Define Views and Layout of Calendar
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
          weekNumbers={true}
          weekends={displayWeekends}
          eventTimeFormat={eventTimeFormatSetting} // Load event time format settings
          businessHours={businessHoursSettings}
          buttonText={buttonTextSettings}
          //
          // Interaction
          //dateClick={handleDateClick}
          editable={false} //events cannot be edited directly in calendar
          droppable={false} // events cannot be dragged and dropped (edited) in the calendar view)
          longPressDelay={50}
          selectLongPressDelay={100}
          selectable={true}
          selectMirror={true}
          select={handleSelect}
          // Handle eventClick
          eventClick={handleEvent}
        />
        <CalendarAnchorCreate
          showCreate={showCreate}
          setShowCreate={setShowCreate}
          createStart={createStart}
          createEnd={createEnd}
        ></CalendarAnchorCreate>
        <CalendarAnchorEvent
          showEvent={showEvent}
          setShowEvent={setShowEvent}
          eventID={eventID}
        ></CalendarAnchorEvent>
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
