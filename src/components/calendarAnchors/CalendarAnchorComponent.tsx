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
import { RefObject, useContext, useRef, useState } from "react";
import { DateSelectArg } from "@fullcalendar/core";
import { Anchor, DraftAnchor } from "../../types/types";
import { draftAnchor } from "../../types/defaults";
import { AnchorContext } from "../../anchorContext";

export const CalendarAnchorComponent = ({
  setShowCreate,
  setLocalAnchor,
  setShowDate,
  setShowView,
  setShowViewAnchorID,
}: {
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
  setShowDate: React.Dispatch<React.SetStateAction<boolean>>;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  setShowViewAnchorID: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const [displayWeekends, setDisplayWeekends] = useState(true);
  const { anchors } = useContext(AnchorContext);

  // Create reference to the calendar (Needs to be checked against 0)
  const calendarRef = useRef<FullCalendar>(null);

  // Function for select interaction
  function handleSelect(eventInfo: DateSelectArg) {
    // create draft Anchor with start and end time
    const selectAnchor: DraftAnchor<Anchor> = {
      start_at: eventInfo.startStr,
      end_at: eventInfo.endStr,
      ...draftAnchor,
    };
    setLocalAnchor(selectAnchor);
    setShowDate(true);
    setShowCreate(true);
  }

  // function for event interaction
  function handleEvent(event: EventInput) {
    setShowView(true);
    setShowViewAnchorID(event.event.id);
  }

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

      <IonContent className="ion-padding" style={{ "--ion-color-primary": "black" }}>
        <FullCalendar
          ref={calendarRef}
          locale="ch" // Time and Date formatting according to locale
          events={anchors.map(transformEvent)} // Load and transform events
          height="100%"
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
            dayGrid: {
              monthStartFormat: { month: "short", day: "numeric" },
            },
            ...viewsSettings, // Load all other settings from external file
          }}
          initialView="timeGridWeekCustom"
          weekNumbers={false} // We do not show week numbers as they overlap with other content and the position cannot be changed
          weekNumberCalculation={"ISO"} // For better display of Month labels in Month View
          weekends={displayWeekends}
          eventTimeFormat={eventTimeFormatSetting} // Load event time format settings
          businessHours={businessHoursSettings}
          buttonText={buttonTextSettings}
          eventDisplay="block" // In dayGridMonth View all events should be displayed solid
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
