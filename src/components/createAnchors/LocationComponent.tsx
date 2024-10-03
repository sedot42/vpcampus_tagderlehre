import React, { useState, useContext } from "react";
import {
  IonButton,
  IonFab,
  IonFabButton,
  IonIcon,
  IonItem,
  IonItemGroup,
  IonLabel,
  useIonViewDidEnter,
} from "@ionic/react";
import { qrCodeOutline, trashOutline } from "ionicons/icons";
import { AnchorContext } from "../../anchorContext";
import { SelectionModal } from "../settings/SelectionModal";
import { PickLocationFromMapModal } from "./PickLocationFromMapModal";
import {
  CapacitorBarcodeScanner,
  CapacitorBarcodeScannerTypeHint,
} from "@capacitor/barcode-scanner";
import * as wellknown from "wellknown";
import "../../theme/styles.css";
import "leaflet/dist/leaflet.css";
import { Anchor, DraftAnchor } from "../../types/types";
import roomData from "../mapAnchors/floorplan/room_geometries/mapdata-campus-default.jsonDB.json";

export const LocationGroup = ({
  localAnchor,
  setLocalAnchor,
  setShowMapLocation,
  showMapLocation,
}: {
  localAnchor: DraftAnchor<Anchor>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
  setShowMapLocation: React.Dispatch<React.SetStateAction<boolean>>;
  showMapLocation: boolean;
}) => {
  const { anchors } = useContext(AnchorContext);

  const [locationListModalOpen, setLocationListModalOpen] = useState(false);
  const [locationMapModalOpen, setLocationMapModalOpen] = useState(false);
  const [locationSet, setLocationSet] = useState<boolean>(false);
  const [locationSetMap, setLocationSetMap] = useState<boolean>(false);
  const [activeButton, setActiveButton] = useState<"none" | "map" | "list" | "current">(
    "none"
  );

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event("resize"));
  });

  const locationList =
    localAnchor &&
    [...new Set(anchors.flatMap((anchor) => anchor.room_id))]
      .filter((item) => item !== undefined)
      .sort();

  const handleLocationClick = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocalAnchor({ ...localAnchor, lat: latitude, lon: longitude });
          setLocationSet(true);
          setActiveButton("current");
        },
        (error) => {
          console.error("Error getting geolocation: ", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const resetLocation = () => {
    setLocalAnchor({
      ...localAnchor,
      lat: undefined,
      lon: undefined,
      room_id: undefined,
    });
    setLocationSet(false);
    setLocationSetMap(false);
    setShowMapLocation(false);
    setActiveButton("none");
  };

  const handleListeClick = () => {
    setLocationListModalOpen(true);
    setActiveButton("list");
  };

  const handleSaveRoom = (selectedRoom: string[]) => {
    setLocalAnchor({
      ...localAnchor,
      room_id: selectedRoom[0],
    });
    setLocationListModalOpen(false);
    setActiveButton("list");
  };

  const handleMapButtonClick = () => {
    setLocationMapModalOpen(true);
    setActiveButton("map");
  };

  // reset the constants for a new temporary location
  const scanRoomQRCode = async function () {
    try {
      const { ScanResult } = await CapacitorBarcodeScanner.scanBarcode({
        scanInstructions: "Scanne den QR-Code eines Raumes",
        hint: CapacitorBarcodeScannerTypeHint.ALL,
      });
      console.log("Barcode data", ScanResult);
      // try to get the room number from the scan result
      const roomID = new URL(ScanResult).searchParams.get("idRoom");
      if (roomID) {
        // TODO Extract roomNumber from roomID via evento?
      }
      const roomNumber = RegExp(/(\d+\.\d+\.)(?<room>.+)$/, "gm").exec(ScanResult)?.groups
        ?.room;
      console.log(roomNumber, roomID, ScanResult);
      const room = roomData.rooms.find((room) => room.nr === roomNumber);
      // TODO geometry is in the local pixel CRS of the campusapp floorplan
      const roomGeometry = wellknown.parse(String(room?.wkt_pt));
      if (!room || !roomGeometry || roomGeometry.type !== "Point")
        throw "Raum konnte nicht ermittelt werden";
      console.log(roomGeometry, room);
      handleSaveRoom([room.nr]);
    } catch (err) {
      alert(`Fehler beim Scannen des Raumes: ${err}`);
    }
  };

  return (
    <>
      <IonItem lines="none">
        Ort
        <IonItemGroup>
          {/* There are thre buttons how to fill out the location (map, roomlist or current location.
          If one of it is filled the other should be disabled) */}
          {!locationSetMap && !showMapLocation ? (
            <IonButton
              onClick={handleMapButtonClick}
              disabled={
                (activeButton !== "none" && activeButton !== "map") || showMapLocation
              }
            >
              Über Karte wählen
            </IonButton>
          ) : (
            (showMapLocation || locationSetMap) && (
              <IonButton
                color="medium"
                className="tagContainerButton"
                onClick={resetLocation}
              >
                <IonLabel className="tagContainerButtonLabels ion-text-wrap">
                  {`Lat: ${localAnchor.lat}, Lon: ${localAnchor.lon}`}
                </IonLabel>
                <IonIcon icon={trashOutline} />
              </IonButton>
            )
          )}

          <PickLocationFromMapModal
            localAnchor={localAnchor}
            setLocalAnchor={setLocalAnchor}
            locationMapModalOpen={locationMapModalOpen}
            setLocationMapModalOpen={setLocationMapModalOpen}
            setLocationSetMap={setLocationSetMap}
          />

          <IonButton
            color={localAnchor.room_id ? "medium" : "primary"}
            onClick={localAnchor.room_id ? resetLocation : handleListeClick}
            disabled={
              (activeButton !== "none" && activeButton !== "list") || showMapLocation
            }
          >
            <IonLabel className="ion-text-wrap">
              {localAnchor.room_id ? `Room: ${localAnchor.room_id}` : "Raum über Liste"}
            </IonLabel>
            {localAnchor.room_id && <IonIcon icon={trashOutline} />}
          </IonButton>

          <SelectionModal
            headerText="Ort auswählen"
            hasMultiSelection={false}
            closeModal={() => setLocationListModalOpen(false)}
            isOpen={locationListModalOpen}
            selectionList={locationList}
            initialSelection={localAnchor.room_id ? [localAnchor.room_id] : []}
            modalConfirmAction={handleSaveRoom}
          >
            <>
              <IonFab vertical="top" horizontal="end" edge>
                <IonFabButton onClick={scanRoomQRCode}>
                  {/* TODO QR-Code trigger */}
                  <IonIcon icon={qrCodeOutline}></IonIcon>
                </IonFabButton>
              </IonFab>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                }}
              >
                <IonButton onClick={() => handleSaveRoom} expand="full" color="primary">
                  Speichern
                </IonButton>
              </div>
            </>
          </SelectionModal>

          {!locationSet ? (
            <IonButton
              onClick={handleLocationClick}
              disabled={
                (activeButton !== "none" && activeButton !== "current") || showMapLocation
              }
            >
              Aktuellen Standort verwenden
            </IonButton>
          ) : (
            <IonButton
              color="medium"
              className="tagContainerButton"
              onClick={resetLocation}
            >
              <IonLabel className="tagContainerButtonLabels ion-text-wrap">
                {`Lat: ${localAnchor.lat}, Lon: ${localAnchor.lon}`}
              </IonLabel>
              <IonIcon icon={trashOutline} />
            </IonButton>
          )}
        </IonItemGroup>
      </IonItem>
    </>
  );
};
