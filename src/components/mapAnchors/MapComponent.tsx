import { useContext, useState, useEffect } from "react";
import { IonPage, IonContent, useIonViewDidEnter } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { MapContainerComponent } from "./MapContainerComponent";
import { TimeSliderComponent } from "./TimeSliderComponent";
import { Anchor, DBAnchor, DraftAnchor } from "../../types/types";

export const MapComponent = ({
  setShowCreate,
  setLocalAnchor,
  setShowMapLocation,
  setShowView,
  setShowViewAnchorIDs,
}: {
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
  setShowMapLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  setShowViewAnchorIDs: React.Dispatch<React.SetStateAction<string[]>>;
}) => {
  const { anchors } = useContext(AnchorContext);

  const [selectedDayFilter, setSelectedDayFilter] = useState<Date>(new Date());
  const [startTimeFilter, setStartTimeFilter] = useState<number>(7);
  const [endTimeFilter, setEndTimeFilter] = useState<number>(18);
  const [showToastAnchorNoPos, setShowToastAnchorNoPos] = useState<boolean>(false);
  const [filteredAnchors, setFilteredAnchors] = useState<DBAnchor[]>([]);

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
  });

  const convertTimeToMinutes = (date: Date) =>
    date.getUTCHours() * 60 + date.getUTCMinutes();

  // Unify times of range-filter and anchor and then filter the anchors based on this
  const filterAnchors = () => {
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
      const startDate = anchor.start_at
        ? new Date(anchor.start_at)
        : new Date("2000-01-01T00:00:00Z");

      const endDate = anchor.end_at
        ? new Date(anchor.end_at)
        : new Date("2000-01-01T00:00:00Z");

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
  };

  useEffect(() => {
    if (anchors.length > 0) {
      filterAnchors();
    }
  }, [anchors, selectedDayFilter, startTimeFilter, endTimeFilter]);

  return (
    <IonPage>
      <StatusHeader titleText="Karte" />
      <IonContent fullscreen>
        <MapContainerComponent
          filteredAnchors={filteredAnchors}
          setShowCreate={setShowCreate}
          setLocalAnchor={setLocalAnchor}
          setShowMapLocation={setShowMapLocation}
          setShowView={setShowView}
          setShowViewAnchorIDs={setShowViewAnchorIDs}
        />
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
