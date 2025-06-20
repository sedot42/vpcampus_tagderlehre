import { useContext, useState, useEffect } from "react";
import {
  IonPage,
  IonContent,
  useIonViewWillEnter,
  useIonViewWillLeave,
  useIonRouter,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { MapComponent } from "./MapContainerComponent";
import { TimeSliderComponent } from "./TimeSliderComponent";
import { Anchor, DBAnchor, DraftAnchor } from "../../types/types";
import { useLocation } from "react-router";

interface MapPageProps {
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
  setShowMapLocation: React.Dispatch<React.SetStateAction<boolean>>;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  setShowViewAnchorIDs: React.Dispatch<React.SetStateAction<string[]>>;
}

export const MapPage = ({
  setShowCreate,
  setLocalAnchor,
  setShowMapLocation,
  setShowView,
  setShowViewAnchorIDs,
}: MapPageProps) => {
  const { anchors } = useContext(AnchorContext);
  const [highlightedAnchor, setHighlightedAnchor] = useState<DBAnchor | null>(null);
  const [selectedDayFilter, setSelectedDayFilter] = useState<Date>(
    new Date("06/27/2025 12:00")
  );
  const [startTimeFilter, setStartTimeFilter] = useState<number>(7);
  const [endTimeFilter, setEndTimeFilter] = useState<number>(18);
  const [showToastAnchorNoPos, setShowToastAnchorNoPos] = useState<boolean>(false);
  const [filteredAnchors, setFilteredAnchors] = useState<DBAnchor[]>([]);
  const currentURL = useLocation();
  const router = useIonRouter();

  useIonViewWillEnter(() => {
    // get highlighted anchor id from URL
    const id = new URLSearchParams(currentURL.search).get("id");
    const highlightedAnchor = anchors.filter((anchor) => anchor.id == id)[0];
    if (highlightedAnchor?.lat && highlightedAnchor.start_at) {
      setSelectedDayFilter(new Date(highlightedAnchor.start_at));
    }
    setHighlightedAnchor(highlightedAnchor);
    setShowView(!!id);
    setShowViewAnchorIDs(id ? [id] : [""]);
  }, [currentURL, anchors]);

  useIonViewWillLeave(() => {
    const targetRoute = window.location.hash.substring(1);
    router.push("/mapAnchors", "root", "replace"); // inelegant way to reset the ID search param
    router.push(targetRoute);
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
        <MapComponent
          filteredAnchors={filteredAnchors}
          setShowCreate={setShowCreate}
          setLocalAnchor={setLocalAnchor}
          setShowMapLocation={setShowMapLocation}
          setShowView={setShowView}
          setShowViewAnchorIDs={setShowViewAnchorIDs}
          highlightedAnchor={highlightedAnchor}
        />
      </IonContent>
      <TimeSliderComponent
        startTimeFilter={startTimeFilter}
        endTimeFilter={endTimeFilter}
        setStartTimeFilter={setStartTimeFilter}
        setEndTimeFilter={setEndTimeFilter}
        selectedDayFilter={selectedDayFilter}
        setSelectedDayFilter={setSelectedDayFilter}
        showToastAnchorNoPos={showToastAnchorNoPos}
        setShowToastAnchorNoPos={setShowToastAnchorNoPos}
      />
    </IonPage>
  );
};
