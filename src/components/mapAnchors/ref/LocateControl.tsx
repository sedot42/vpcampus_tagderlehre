import React, { useEffect, useState } from "react";
import { MapContainer, Marker, TileLayer, WMSTileLayer, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IonFab, IonFabButton, IonIcon, IonLabel, IonList, IonItem } from "@ionic/react";
import { locateOutline } from "ionicons/icons";
import "./map.css";

export const LocateControl = () => {
  const map = useMap();

  const handleLocate = () => {
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
    <div className="locate-control">
      <button className="locate-button" onClick={handleLocate}>
        <IonIcon icon={locateOutline} />
      </button>
    </div>
  );
};
