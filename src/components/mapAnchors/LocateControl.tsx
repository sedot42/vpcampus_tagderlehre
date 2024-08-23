import { useRef } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { IonButton, IonIcon } from "@ionic/react";
import { locateOutline } from "ionicons/icons";
import "./map.css";

export const LocateControl = () => {
  const map = useMap();
  const locateMarkerRef = useRef<L.Marker | null>(null);

  const handleLocate = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Update the map view without removing any layers or markers
          map.setView([latitude, longitude], 18);

          if (locateMarkerRef.current) {
            locateMarkerRef.current.setLatLng([latitude, longitude]);
          } else {
            // Create a new locate marker with a popup
            locateMarkerRef.current = L.marker([latitude, longitude]).addTo(map);
          }
        },
        (error) => {
          alert("Geolocation failed: " + error.message);
        }
      );
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  };

  return (
    <IonButton className="locate-control" shape="round" onClick={handleLocate}>
      <IonIcon slot="icon-only" icon={locateOutline} />
    </IonButton>
  );
};
