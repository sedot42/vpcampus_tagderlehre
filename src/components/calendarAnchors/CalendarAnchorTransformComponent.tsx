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
