export const timeGridSettings = {
  type: "timeGrid",
  slotMinTime: "00:00:00",
  slotMaxTime: "24:00:00",
  scrollTime: "08:00:00", // Initial Time at which the Calendar will be zoomed to
  nowIndicator: true,
};

export const buttonTextSettings = {
  today: "Heute",
  month: "Monat",
  week: "Woche",
  day: "Tag",
};

export const businessHoursSettings = {
  daysOfWeek: [1, 2, 3, 4, 5], // Monday - Friday
  startTime: "08:00", // a start time
  endTime: "18:00", // an end time
};

export const eventTimeFormatSetting: Intl.DateTimeFormatOptions = {
  // like '14:30:00'
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
};
