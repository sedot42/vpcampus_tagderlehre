import { useContext, useState, useEffect, useRef } from "react";
import { Marker, divIcon, Map as LeafletMap, tileLayer } from "leaflet";
import {
  IonPage,
  IonContent,
  useIonViewDidEnter,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButton,
  IonTitle,
  IonButtons,
  IonFooter,
  IonIcon,
  IonDatetimeButton,
  IonDatetime,
  IonToast,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";
import { StatusHeader } from "../../globalUI/StatusHeader";
import { AnchorContext } from "../../../anchorContext";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";

import { MapContainerComponent } from "./MapContainerComponent";
import { TimeSliderComponent } from "./TimeSliderComponent";
import { AnchorInfoModal } from "./AnchorInfoModal";
import { arrangeDictionaries } from "./TimeLayering";
import { Anchor } from "../../../types/types";

export const MapComponent: React.FC = () => {
  const { anchors } = useContext(AnchorContext);
  const [showModal, setShowModal] = useState(false); // status to open information modal
  const mapContainerRef = useRef<LeafletMap | null>(null); // reference map display
  const [mapIsLoad, setMapIsLoad] = useState<boolean>(false); // status whether map is loaded
  const [layerSettingsVisible, setLayerSettingVisible] = useState<boolean>(false); // status whether background settings visible
  const [layerFloorplanVisible, setLayerFloorplanVisible] = useState<boolean>(false); // status whether floorplan visible
  // functional components for filtering
  const [selectedDayFilter, setSelectedDayFilter] = useState<Date>(new Date()); // day
  const [selectedFloor, setSelectedFloor] = useState<number>(2); // floor
  const [startTimeFilter, setStartTimeFilter] = useState<number>(7); // starttime
  const [endTimeFilter, setEndTimeFilter] = useState<number>(18); // endtime

  const [showToastAnchorNoPos, setShowToastAnchorNoPos] = useState<boolean>(false); // status for warning with anchor without spatial assignment

  const [modalData, setModalData] = useState<Anchor>();

  // // by entering the view
  // // by entering the view resize
  useIonViewDidEnter(() => {
    setMapIsLoad(false);
    window.dispatchEvent(new Event("resize"));
  });

  // function to check whether an appointment starts on the selected day or before
  function startsOnSameDayOrBevor(selDate: Date, date: Date) {
    return (
      date.getFullYear() <= selDate.getFullYear() &&
      date.getMonth() <= selDate.getMonth() &&
      date.getDate() <= selDate.getDate()
    );
  }

  // function to check whether an appointment ends on the selected day or later
  function endsOnSameDayOrLater(selDate: Date, date: Date) {
    return (
      date.getFullYear() >= selDate.getFullYear() &&
      date.getMonth() >= selDate.getMonth() &&
      date.getDate() >= selDate.getDate()
    );
  }

  // filter the anchors from the server with the settings
  const filterAnchorFromServer = (serverAnchorData: any) => {
    // list of anchors that match the filters
    const filteredAnchorListHasDate: any = [];
    const filteredAnchorListHasDateWrongTime: any = []; // right day but wrong time
    const filteredAnchorListHasDateWrongFloor: any = [];
    let filteredAnchorListIsValid: any = [];
    const filteredAnchorListIsValidWrongTime: any = []; // right day but wrong time
    let filteredAnchorListIsValidWrongFloor: any = [];
    for (const anchor of serverAnchorData) {
      {
        // filter for anchors for the selected day
        const startDate: Date = new Date(anchor.start_at);
        const endDate: Date = new Date(anchor.end_at);
        // appointment
        if (
          startsOnSameDayOrBevor(selectedDayFilter, startDate) &&
          endsOnSameDayOrLater(selectedDayFilter, endDate)
        ) {
          // filter for selected filter for start and end time
          const anchorStartTime =
            selectedDayFilter.getDate() === startDate.getDate()
              ? startDate.getHours() + startDate.getMinutes() / 60
              : 0;
          const anchorEndTime =
            selectedDayFilter.getDate() === endDate.getDate()
              ? endDate.getHours() + endDate.getMinutes() / 60
              : 23.999;
          console.log(anchorStartTime, anchorEndTime);
          if (anchorStartTime < endTimeFilter && anchorEndTime > startTimeFilter) {
            // filter for selected floor
            if (anchor.floor_nr === selectedFloor) {
              filteredAnchorListHasDate.push(anchor);
            } else {
              filteredAnchorListHasDateWrongFloor.push(anchor);
            }
          } else {
            filteredAnchorListHasDateWrongTime.push(anchor);
          }
        }
      }
    }
    // ensure that anchors are not displayed twice
    // remove anchors that have an appointment in the selected time and are valid
    const idsInFilteredAnchorListHasDate = new Set(
      filteredAnchorListHasDate.map((d: any) => d.id)
    );
    filteredAnchorListIsValid = filteredAnchorListIsValid.filter(
      (d: any) => !idsInFilteredAnchorListHasDate.has(d.id)
    );
    const idsInFilteredAnchorListHasDateWrongFloor = new Set(
      filteredAnchorListHasDateWrongFloor.map((d: any) => d.id)
    );
    filteredAnchorListIsValidWrongFloor = filteredAnchorListIsValidWrongFloor.filter(
      (d: any) => !idsInFilteredAnchorListHasDateWrongFloor.has(d.id)
    );
    // retrun lists
    return [
      filteredAnchorListHasDate,
      filteredAnchorListHasDateWrongTime,
      filteredAnchorListHasDateWrongFloor,
      filteredAnchorListIsValid,
      filteredAnchorListIsValidWrongTime,
      filteredAnchorListIsValidWrongFloor,
    ];
  };

  return (
    <IonPage>
      <StatusHeader titleText="Erstellen" />
      <IonContent fullscreen>
        <MapContainerComponent anchors={anchors} />
      </IonContent>
      <TimeSliderComponent
        anchors={anchors}
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
