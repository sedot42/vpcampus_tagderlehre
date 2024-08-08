import { EventInput } from "@fullcalendar/core";
import { DBAnchor } from "../../types/types";

export const transformEvent = (event: DBAnchor): EventInput => {
  const { anchor_name, start_at, end_at, ...rest } = event;

  return {
    title: anchor_name,
    start: start_at,
    end: end_at,
    ...rest,
  };
};
