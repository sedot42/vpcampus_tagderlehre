import { useContext, useState, useEffect, useRef } from "react";
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
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { Marker, divIcon, Map as LeafletMap, tileLayer } from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  closeOutline,
  homeOutline,
  layersOutline,
  mapOutline,
  alertCircleOutline,
} from "ionicons/icons";
import { arrangeDictionaries } from "./TimeLayering";

export const TimeSliderComponent = ({
  startTimeFilter,
  endTimeFilter,
  setStartTimeFilter,
  setEndTimeFilter,
  setSelectedDayFilter,
  showToastAnchorNoPos,
  setShowToastAnchorNoPos,
}) => {
  // update the left slider (thumb)
  const timeSliderLeftOnInput = (event: any) => {
    const slideMarker = document.getElementById("TimeStampeLeftMarker")!;
    const slideValue = document.getElementById("TimeStampLeftNumber")!;
    const value = event.target.value;
    if (Number(value) < endTimeFilter) {
      slideMarker.style.left = Number(value) * 14 + 9.5 + "px";
      slideValue.innerHTML = value + ":00";
      slideMarker.style.transform = "translateY(-70px) scale(1)";
    }
  };

  // deactivate display of time after end of dragging -> not in use ...
  const timeSliderLeftOnBlur = () => {
    const slideMarker = document.getElementById("TimeStampeLeftMarker")!;
    slideMarker.style.transform = "translateY(-70px) scale(1)"; // scale should be 0 if deactivation is desired
  };

  // update the right slider (thumb)
  const timeSliderRightOnInput = (event: any) => {
    const slideMarker = document.getElementById("TimeStampeRightMarker")!;
    const slideValue = document.getElementById("TimeStampRightNumber")!;
    const value = event.target.value;
    if (Number(value) > startTimeFilter) {
      slideMarker.style.left = Number(value) * 14 + 9.5 + "px";
      slideValue.innerHTML = value + ":00";
      slideMarker.style.transform = "translateY(-70px) scale(1)";
    }
  };

  // deactivate display of time after end of dragging -> not in use ...
  const timeSliderRightOnBlur = () => {
    const slideMarker = document.getElementById("TimeStampeRightMarker")!;
    slideMarker.style.transform = "translateY(-70px) scale(1)"; // scale should be 0 if deactivation is desired
  };

  return (
    <>
      <IonFooter id="footerTimeLineFilter" class="ion-padding">
        <IonDatetimeButton
          id="filterMenuDateSelection"
          datetime="datetime"
        ></IonDatetimeButton>
        {/* slider for time filtering */}
        <div id="filterMenuTimeSlider">
          <div id="anchorDisplaySlider"></div>
          <div id="TimeSliderControl">
            {/* slider for selecting the start time  */}
            <div id="TimeStampeLeftMarker">
              <div id="TimeStampLeftNumber">7:00</div>
            </div>
            <input
              id="TimeStampLeft"
              className="TimeSlider"
              type="range"
              value={startTimeFilter}
              min="0"
              max="24"
              onInput={(e) => {
                timeSliderLeftOnInput(e);
              }}
              // onBlur={() => timeSliderLeftOnBlur()} -> don't work with touch
              onChange={(e) => {
                Number(e.target.value) < endTimeFilter
                  ? setStartTimeFilter(Number(e.target.value))
                  : setStartTimeFilter(startTimeFilter);
              }}
              onMouseUp={() => timeSliderLeftOnBlur()}
              onTouchEnd={() => timeSliderLeftOnBlur()}
            />
            {/* slider to select the end time  */}
            <div id="TimeStampeRightMarker">
              <div id="TimeStampRightNumber">18:00</div>
            </div>
            <input
              id="TimeStampRight"
              className="TimeSlider"
              type="range"
              value={endTimeFilter}
              min="0"
              max="24"
              onInput={(e) => {
                timeSliderRightOnInput(e);
              }}
              // onBlur={() => timeSliderRightOnBlur()} -> don't work with touch
              onChange={(e) => {
                Number(e.target.value) > startTimeFilter
                  ? setEndTimeFilter(Number(e.target.value))
                  : setEndTimeFilter(endTimeFilter);
              }}
              onMouseUp={() => timeSliderRightOnBlur()}
              onTouchEnd={() => timeSliderRightOnBlur()}
            />
          </div>
        </div>
        {/* optical improvement data input */}
        <IonModal keepContentsMounted={true} id="dialogSelectFilterDate">
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Datum auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton
                  onClick={() =>
                    (
                      document.getElementById(
                        "dialogSelectFilterDate"
                      ) as HTMLIonModalElement
                    ).dismiss()
                  }
                >
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
          </IonHeader>
          <IonDatetime
            id="datetime"
            presentation="date"
            onIonChange={(e) => setSelectedDayFilter(new Date(e.target.value + ".000Z"))}
          ></IonDatetime>
          <IonFooter class="ion-padding">
            <IonButton
              onClick={() => {
                (
                  document.getElementById(
                    "dialogSelectFilterDate"
                  )! as HTMLIonModalElement
                ).dismiss();
              }}
              expand="full"
              color="primary"
            >
              Speichern
            </IonButton>
          </IonFooter>
        </IonModal>
        {/* toast when clicking on an anchor in the timeline without spatial assignment */}
        <IonToast
          isOpen={showToastAnchorNoPos}
          onDidDismiss={() => setShowToastAnchorNoPos(false)}
          style={{ height: 80 }}
          color={"warning"}
          position="top"
          message={"Anker verfügt über keine räumliche Zuordnung."}
          duration={1200}
          icon={alertCircleOutline}
        ></IonToast>
      </IonFooter>
    </>
  );
};
