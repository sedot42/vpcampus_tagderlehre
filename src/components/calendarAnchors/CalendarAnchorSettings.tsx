// Define View range of custom Week View
const currentDate: Date = new Date();
function defineWeekVisibleRange(currentDate: Date, dayDuration: number) {
  const startDate =
    currentDate.getFullYear() +
    "-" +
    currentDate.getMonth() +
    "-" +
    currentDate.getDate();
  const endDate =
    currentDate.getFullYear() +
    "-" +
    currentDate.getMonth() +
    "-" +
    (currentDate.getDate() + dayDuration);

  return { start: startDate, end: endDate };
}

// Define View range of custom Month View
function defineMonthVisibleRange(currentDate: Date, dayDuration: number) {
  const startDate =
    currentDate.getFullYear() +
    "-" +
    currentDate.getMonth() +
    "-" +
    currentDate.getDate();
  const endDate =
    currentDate.getFullYear() +
    "-" +
    currentDate.getMonth() +
    "-" +
    (currentDate.getDate() + dayDuration);

  return { start: startDate, end: endDate };
}

// Set the Views which can be displayed
export const viewsSettings = {
  // cannot define type of const View, ViewOptions or ViewOptionsRefiner (do not exist?!) -> Defined locally!

  timeGrid: {
    // Applies to all timeGrids
    slotMinTime: "00:00:00",
    slotMaxTime: "24:00:00",
    scrollTime: "08:00:00", // Initial Time at which the Calendar will be zoomed to
    nowIndicator: true,
  },
  // Create new custom Week view which starts with current day
  timeGridWeekCustom: {
    type: "timeGrid",
    duration: { days: 7 },
    buttonText: "Woche",
    visibleRange: defineWeekVisibleRange(currentDate, 7),
  },
  // Create custom Month view which starts with current week
  dayGridMonthCustom: {
    type: "dayGrid",
    duration: { weeks: 4 },
    buttonText: "Monat",
    visibleRange: defineMonthVisibleRange(currentDate, 28),
  },
};

// Rename buttonTexts when using standard Views
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
