import { EventInput } from "@fullcalendar/core";
import { Anchor } from "../../types/types";

export const transformEvent = (event: Anchor): EventInput => {
  const { anchor_name, start_at, end_at, ...rest } = event;

  let allDay: boolean = false;

  // calculate all day param
  if (start_at && end_at) {
    // type guard to ensure that only string types are looked at
    const start: Date = new Date(start_at);
    const end: Date = new Date(end_at);

    // Calculate the duration in milliseconds
    const durationMs = end.getTime() - start.getTime();

    // Convert the duration to hours and minutes
    const durationMinutes = Math.floor(durationMs / (1000 * 60));
    const durationHours = Math.floor(durationMinutes / 60);

    if (durationHours > 30) {
      allDay = true;
    } else {
      allDay = false;
    }
  }

  return {
    title: anchor_name,
    start: start_at,
    end: end_at,
    allDay: allDay,
    ...rest,
  };
};
