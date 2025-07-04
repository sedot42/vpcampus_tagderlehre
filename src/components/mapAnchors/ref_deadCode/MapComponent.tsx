import { useContext, useState, useEffect } from "react";
import { IonPage, IonContent, useIonViewDidEnter } from "@ionic/react";
import "leaflet/dist/leaflet.css";
import { StatusHeader } from "../../globalUI/StatusHeader";
import { AnchorContext } from "../../../anchorContext";
import { MapContainerComponent } from "./MapContainerComponent";
import { TimeSliderComponent } from "./TimeSliderComponent";
import { DBAnchor } from "../../../types/types";

export const MapComponent: React.FC = () => {
  const { anchors } = useContext(AnchorContext);

  const [selectedDayFilter, setSelectedDayFilter] = useState<Date>(new Date());
  const [startTimeFilter, setStartTimeFilter] = useState<number>(7);
  const [endTimeFilter, setEndTimeFilter] = useState<number>(18);
  const [showToastAnchorNoPos, setShowToastAnchorNoPos] = useState<boolean>(false);
  const [filteredAnchors, setFilteredAnchors] = useState<DBAnchor[]>([]);

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
  });

  useEffect(() => {
    if (anchors.length > 0) {
      const selectedDate = new Date(
        Date.UTC(
          selectedDayFilter.getUTCFullYear(),
          selectedDayFilter.getUTCMonth(),
          selectedDayFilter.getUTCDate()
        )
      );

      const startOfDay = new Date(selectedDate);
      const endOfDay = new Date(selectedDate);
      endOfDay.setUTCHours(23, 59, 59, 999);

      const selectedStartMinutes = startTimeFilter * 60;
      const selectedEndMinutes = endTimeFilter * 60;

      const filteredAnchors = anchors.filter((anchor) => {
        const startDate = new Date(String(anchor.start_at));
        const endDate = new Date(String(anchor.end_at));

        if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
          console.warn(`Invalid date for anchor: ${anchor.id}`);
          return false;
        }

        const anchorStartMinutes = convertTimeToMinutes(startDate);
        const anchorEndMinutes = convertTimeToMinutes(endDate);

        const isDateInSelectedDay =
          (startDate >= startOfDay && startDate <= endOfDay) ||
          (endDate >= startOfDay && endDate <= endOfDay) ||
          (startDate < startOfDay && endDate > endOfDay);

        const isTimeInRange =
          anchorStartMinutes < selectedEndMinutes &&
          anchorEndMinutes > selectedStartMinutes;

        return isDateInSelectedDay && isTimeInRange;
      });

      setFilteredAnchors(filteredAnchors);
    }
  }, [anchors, selectedDayFilter, startTimeFilter, endTimeFilter]);

  return (
    <IonPage>
      <StatusHeader titleText="Erstellen" />
      <IonContent fullscreen>
        <MapContainerComponent anchors={filteredAnchors} />
      </IonContent>
      <TimeSliderComponent
        startTimeFilter={startTimeFilter}
        endTimeFilter={endTimeFilter}
        setStartTimeFilter={setStartTimeFilter}
        setEndTimeFilter={setEndTimeFilter}
        setSelectedDayFilter={setSelectedDayFilter}
        showToastAnchorNoPos={showToastAnchorNoPos}
        setShowToastAnchorNoPos={setShowToastAnchorNoPos}
      />
    </IonPage>
  );
};

function convertTimeToMinutes(date: Date) {
  return date.getUTCHours() * 60 + date.getUTCMinutes();
}
