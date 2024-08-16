import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, WMSTileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import {
  IonFab,
  IonFabButton,
  IonIcon,
  IonLabel,
  IonList,
  IonItem,
  IonButton,
  useIonViewDidEnter,
} from "@ionic/react";
import { locateOutline } from "ionicons/icons";
import "./map.css";

export const LocateControl = () => {
  const map = useMap();

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
  });

  const handleLocate = (e) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          map.setView([latitude, longitude], 20);
          L.marker([latitude, longitude]).addTo(map).openPopup();
        },
        (error) => {
          alert("Geolocation failed: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by.");
    }
  };

  return (
    <IonButton className="locate-control" shape="round" onClick={handleLocate}>
      <IonIcon slot="icon-only" icon={locateOutline} />
    </IonButton>
  );
};
