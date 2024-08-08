// Test interface for events
interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
}

export const events: Event[] = [
  {
    id: "a",
    title: "testevent",
    start: "2024-08-07T12:15:00",
    end: "2024-08-07T16:30:00",
  },
  {
    id: "b",
    title: "test meeting",
    start: "2024-08-08T08:15:00",
    end: "2024-08-08T11:30:00",
  },
];

interface OriginalEvent {
  anchor_name: string;
  start_at: string;
  end_at: string;
  [key: string]: string; // Allow for additional properties
}

interface TransformedEvent {
  title: string;
  startStr: string;
  endStr: string;
  [key: string]: string; // Allow for additional properties
}

export const transformEvent = (event: OriginalEvent): TransformedEvent => {
  const { anchor_name, start_at, end_at, ...rest } = event;

  return {
    title: anchor_name,
    startStr: start_at,
    endStr: end_at,
    ...rest,
  };
};

/* // Example usage:
const mockState: OriginalEvent[] = [
  {
    anchor_name: "Meeting with Bob",
    start_at: "2024-08-01T10:00:00Z",
    end_at: "2024-08-01T11:00:00Z",
    location: "Room 101",
  },
  {
    anchor_name: "Lunch with Alice",
    start_at: "2024-08-01T12:00:00Z",
    end_at: "2024-08-01T13:00:00Z",
    location: "Cafeteria",
  },
];

const transformedEvents: TransformedEvent[] = mockState.map(transformEvent);

console.log(transformedEvents); */
