import { useState } from "react";
import {
  addCircleOutline,
  trashOutline,
  closeOutline,
  qrCodeOutline,
} from "ionicons/icons";
import "leaflet/dist/leaflet.css";

import {
  IonButton,
  IonFooter,
  IonContent,
  IonModal,
  IonLabel,
  IonHeader,
  IonIcon,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  IonInfiniteScroll,
  IonList,
  IonSearchbar,
  IonCard,
  IonItem,
  IonRadio,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";

import { CreatePlaceComponent } from "./CreatePlaceComponent";
import { UniversalSearchBar } from "../globalUI/UniversalSearchBar";

export const CreateLocationComponent = ({
  anchors,
  localAnchor,
  setLocalAnchor,
  setShowToastCreateLocation,
  setShowToastCreateBuilding,
  setNewLocationError,
  setNewBuildingError,
  setNewPositionLatitude,
  newPositionLatitude,
  setNewPositionLongitude,
  newPositionLongitude,
  selectedLocationDictionary,
  setSelectedLocationDictionary,
  selectedBuildingDictionary,
  setSelectedBuildingDictionary,
  temporaryLocationList,
  setTemporaryLocationList,
  temporaryBuildingList,
  setTemporaryBuildingList,
}) => {
  // functional components for the selection of location for an anchor
  const [filterLocationString, setFilterLocationString] = useState<string>(""); // string to filter the locations

  // get all unique locations that occur in the database
  const getLocationsFromDB = () => {
    if (!anchors) return [];
    const locationListDB = anchors.map((location) => ({
      room_id: location.room_id || "",
      lat: location.lat,
      lon: location.lon,
      floor_nr: location.floor_nr,
      building_id: location.building_id || "",
      address_string: location.address_string || "",
      campus_id: location.campus_id || "",
    }));
    // create a new list with unique rows
    const uniqueRows = filterUniqueRows(locationListDB);
    // remove the dictionary for empty location from the list (if exists)
    const dictNoLocation = {
      room_id: "",
      lat: null,
      lon: null,
      floor_nr: null,
      building_id: "",
      address_string: "",
      campus_id: "",
    };
    const uniqueRowsClear = uniqueRows.filter(
      (dict: {}) => JSON.stringify(dict) !== JSON.stringify(dictNoLocation)
    );
    // return the unique list
    return uniqueRowsClear;
  };

  const [newLocationDictionary, setNewLocationDictionary] = useState<{
    [key: string]: any;
  }>({
    room_id: "",
    lat: null,
    lon: null,
    floor_nr: null,
    building_id: "",
    address_string: "",
    campus_id: "",
  }); // new location_id as string

  const [filterBuildingString, setFilterBuildingString] = useState<string>(""); // string to filter the buildings
  const [newBuildingDictionary, setNewBuildingDictionary] = useState<{
    [key: string]: any;
  }>({ building_id: "", address_string: "", campus_id: "" }); // new user building as dictionary

  // function to filter all the unique locations in the db
  function filterUniqueRows(array: any) {
    const seen = new Set();
    return array.filter((row: any) => {
      const rowString = JSON.stringify(row);
      const isNew = !seen.has(rowString);
      seen.add(rowString);
      return isNew;
    });
  }
  // update of the list of locations (locations from database and temporarily created by user)
  const getLocationsFromFilter = () => {
    // locations from db
    const locationsDB = getLocationsFromDB();
    // combination of all locations
    const allLocations = locationsDB.concat(temporaryLocationList);
    // sort the location list
    allLocations.sort((a: any, b: any) => {
      const roomA = a.room_id.toUpperCase(); // not case sensitive
      const roomB = b.room_id.toUpperCase(); // not case sensitive
      if (roomA < roomB) {
        return -1;
      } else if (roomA > roomB) {
        return 1;
      } else {
        return 0;
      } // same room
    });
    // temporary storage of the current selection for subsequent editing
    const selectedLocationDictValue = selectedLocationDictionary;
    // clearing the current display
    const locationFilteredList = document.getElementById("listFilteredLocations")!;
    locationFilteredList.innerHTML = "";
    // create the radio group element
    const locationRadioGroup = document.createElement("ion-radio-group");
    locationRadioGroup.setAttribute("value", JSON.stringify(selectedLocationDictValue));
    // create dummy element (no selection)
    const locationItemDummy = document.createElement("ion-item");
    locationItemDummy.setAttribute("key", crypto.randomUUID());
    locationItemDummy.setAttribute("lines", "none");
    const locationRadioDummy = document.createElement("ion-radio");
    locationRadioDummy.setAttribute("value", "{}");
    locationRadioDummy.setAttribute("key", crypto.randomUUID());
    const locationRadioDummyLabel = document.createElement("ion-label");
    locationRadioDummyLabel.innerHTML = "keine Auswahl";
    locationRadioDummyLabel.style.fontWeight = "bold";
    locationRadioDummy.appendChild(locationRadioDummyLabel);
    locationItemDummy.appendChild(locationRadioDummy);
    locationRadioGroup.appendChild(locationItemDummy);
    // iteration through all existing (db / user) locations
    let i = 0;
    while (i < allLocations.length) {
      const value: { [key: string]: any } = allLocations[i];
      // list of all elements corresponding to the filter
      if (value.room_id.startsWith(filterLocationString)) {
        // create all elements
        const locationRadioValue = JSON.stringify(value);
        const locationItem = document.createElement("ion-item");
        locationItem.setAttribute("key", crypto.randomUUID());
        locationItem.setAttribute("lines", "none");
        const locationRadio = document.createElement("ion-radio");
        locationRadio.setAttribute("value", locationRadioValue);
        locationRadio.setAttribute("key", crypto.randomUUID());
        // if exists, add the room name, campus, building and floor to the object in the selection list
        if (
          value.room_id != "" ||
          value.campus_id != "" ||
          value.building_id != "" ||
          value.floor_nr != null
        ) {
          const selectedLocationRoom = document.createElement("ion-label");
          let innerHTMLString = "";
          if (value.room_id != "") {
            innerHTMLString +=
              '<span style="font-weight: bold">' + value.room_id + "</span> ";
          }
          if (
            value.campus_id != "" ||
            value.building_id != "" ||
            value.floor_nr != null
          ) {
            innerHTMLString += "(";
            if (value.campus_id != "") {
              innerHTMLString += value.campus_id + ", ";
            }
            if (value.building_id != "") {
              innerHTMLString += value.building_id + ", ";
            }
            if (value.floor_nr != null) {
              innerHTMLString += value.floor_nr + ", ";
            }
            innerHTMLString = innerHTMLString.slice(0, -2) + ")";
          }
          selectedLocationRoom.innerHTML = innerHTMLString;
          selectedLocationRoom.setAttribute("class", "ion-text-wrap");
          locationRadio.appendChild(selectedLocationRoom);
        }
        // if exists, add the address to the object in the selection list
        if (value.address_string != "") {
          const selectedLocationAddress = document.createElement("ion-label");
          selectedLocationAddress.innerHTML = value.address_string;
          selectedLocationAddress.setAttribute("class", "ion-text-wrap");
          locationRadio.appendChild(selectedLocationAddress);
        }
        // if exists, add the coordinates to the object in the selection list
        if (value.lat != null && value.lon != null) {
          const selectedLocationCoord = document.createElement("ion-label");
          selectedLocationCoord.innerHTML =
            Math.round(value.lat * 100000) / 100000 +
            " / " +
            Math.round(value.lon * 100000) / 100000;
          selectedLocationCoord.setAttribute("class", "ion-text-wrap");
          locationRadio.appendChild(selectedLocationCoord);
        }
        locationItem.appendChild(locationRadio);
        // add the item (location) to the group
        locationRadioGroup.appendChild(locationItem);
      }
      i++;
    }
    // add event listener to the radio group
    // as soon as a radio is clicked, the string of the selected location is adjusted
    locationRadioGroup.addEventListener("ionChange", function (event) {
      const locationChanges = event as CustomEvent;
      if (Object.keys(locationChanges.detail.value).length > 0) {
        setSelectedLocationDictionary(JSON.parse(locationChanges.detail.value));
      } else {
        // no selection
        setSelectedLocationDictionary({});
      }
    });
    // add the item (location) to the display
    locationFilteredList.appendChild(locationRadioGroup);
  };

  // closing the dialog (modal) to select locations
  const closeDialogSelectLocation = () => {
    const dialogSelectLocation = document.getElementById(
      "dialogSelectLocation"
    ) as HTMLIonModalElement;
    dialogSelectLocation.dismiss();
  };

  // updating the button for selecting locations (text display including the selected locations)
  const updateLocationsInput = () => {
    // reset filter string (locations)
    setFilterLocationString("");
    // clearing the current display
    const locationContainerDiv = document.getElementById("locationContainer")!;
    locationContainerDiv.innerHTML = "";
    if (Object.keys(selectedLocationDictionary).length == 0) {
      // nothing to do
    } else {
      // create a new element for the selected location
      const locationButton = document.createElement("ion-button");
      locationButton.setAttribute("id", JSON.stringify(selectedLocationDictionary));
      locationButton.setAttribute("class", "locationContainerButton");
      locationButton.setAttribute("color", "medium");
      // add a function to delete the location
      locationButton.addEventListener("click", (event: any) => {
        locationContainerDiv.innerHTML = "";
        setSelectedLocationDictionary({});
      });
      const locationButtonLabel = document.createElement("ion-label");
      locationButtonLabel.classList.add("locationContainerButtonLabels", "ion-text-wrap");
      let innerHTMLString = "";
      if (selectedLocationDictionary.room_id != "") {
        if (
          selectedLocationDictionary.campus_id != "" ||
          selectedLocationDictionary.building_id != "" ||
          selectedLocationDictionary.floor_nr != null ||
          selectedLocationDictionary.address_string != "" ||
          (selectedLocationDictionary.lat != null &&
            selectedLocationDictionary.lon != null)
        ) {
          innerHTMLString += selectedLocationDictionary.room_id + ", ";
          if (selectedLocationDictionary.building_id != "") {
            innerHTMLString += selectedLocationDictionary.building_id;
          } else if (selectedLocationDictionary.campus_id != "") {
            innerHTMLString += selectedLocationDictionary.campus_id;
          } else if (selectedLocationDictionary.address_string != "") {
            innerHTMLString += selectedLocationDictionary.address_string;
          } else if (
            selectedLocationDictionary.lat != null &&
            selectedLocationDictionary.lon != null
          ) {
            innerHTMLString +=
              String(Math.round(selectedLocationDictionary.lat * 100000) / 100000) +
              " / " +
              String(Math.round(selectedLocationDictionary.lon * 100000) / 100000);
          } else if (selectedLocationDictionary.floor_nr != null) {
            innerHTMLString += selectedLocationDictionary.floor_nr;
          }
        } else {
          innerHTMLString += selectedLocationDictionary.room_id;
        }
      } else {
        if (selectedLocationDictionary.building_id != "") {
          innerHTMLString += selectedLocationDictionary.building_id;
        } else if (selectedLocationDictionary.campus_id != "") {
          innerHTMLString += selectedLocationDictionary.campus_id;
        } else if (selectedLocationDictionary.address_string != "") {
          innerHTMLString += selectedLocationDictionary.address_string;
        } else if (
          selectedLocationDictionary.lat != null &&
          selectedLocationDictionary.lon != null
        ) {
          innerHTMLString +=
            String(Math.round(selectedLocationDictionary.lat * 100000) / 100000) +
            " / " +
            String(Math.round(selectedLocationDictionary.lon * 100000) / 100000);
        } else if (selectedLocationDictionary.floor_nr != null) {
          innerHTMLString += selectedLocationDictionary.floor_nr;
        }
      }
      locationButtonLabel.innerHTML = innerHTMLString;
      const locationButtonIcon = document.createElement("ion-icon");
      locationButtonIcon.setAttribute("icon", trashOutline);
      locationButton.appendChild(locationButtonLabel);
      locationButton.appendChild(locationButtonIcon);
      locationContainerDiv.appendChild(locationButton);
    }
  };

  // update the filter string (search) by event (input)
  function updateLocationFilter(event: CustomEvent) {
    setFilterLocationString(event.detail.value);
  }

  // reset the constants for a new temporary location
  const resetConstantsTempLocation = () => {
    setNewLocationDictionary({
      room_id: "",
      lat: null,
      lon: null,
      floor_nr: null,
      building_id: "",
      address_string: "",
      campus_id: "",
    });
    setSelectedLocationDictionary({});
  };

  return (
    <>
      {/* part for the selection of a location */}
      <IonButton
        id="openDialogSelectLocation"
        expand="block"
        color="light"
        fill="solid"
        size="default"
      >
        <div>
          <IonLabel id="openDialogSelectLocationLabel" class="ion-text-wrap">
            Ort
          </IonLabel>
          <IonIcon icon={addCircleOutline} size="large" aria-hidden="true"></IonIcon>
        </div>
      </IonButton>
      <div id="locationContainer">{/* container for showing the selection */}</div>
      {/* overlay (modal) for the selection of a location */}
      <IonModal
        id="dialogSelectLocation"
        trigger="openDialogSelectLocation"
        onDidPresent={getLocationsFromFilter}
        onDidDismiss={updateLocationsInput}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle slot="start">Ort auswählen</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={closeDialogSelectLocation}>
                <IonIcon icon={closeOutline} size="large"></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent>
          <UniversalSearchBar
            entitiesToBeSearched={anchors}
            historyKeyName={"searchHistoryLocations"}
            titlePropertyName={"anchor_name"}
            renderItem={(anchor, index) => (
              <IonItem
                key={index}
                style={{ cursor: "pointer" }}
                button
                onClick={() => console.log("Nicht implementiert")}
              >
                <IonLabel>
                  {`${anchor.campus_id || ""}  ${anchor.building_id || ""} ${
                    anchor.floor_nr || ""
                  } ${anchor.room_id || ""}`}
                  {`${anchor.lat || ""}  ${anchor.lon || ""}`}
                </IonLabel>
              </IonItem>
            )}
          />
        </IonContent>
        <div style={{ position: "relative", width: "100%" }}>
          <IonButton
            onClick={() => alert("Ready for QR-Scanning?")}
            shape="round"
            style={{
              position: "absolute",
              right: "2px",
              bottom: "2px",
            }}
          >
            <IonIcon icon={qrCodeOutline} slot="icon-only" size="large"></IonIcon>
          </IonButton>
        </div>

        <IonFooter>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  onClick={resetConstantsTempLocation}
                  id="openDialogCreateLocation"
                  expand="full"
                  color="primary"
                >
                  Neuer Ort
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  onClick={closeDialogSelectLocation}
                  id="cancelSelectLocation"
                  expand="full"
                  color="primary"
                >
                  Speichern
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>

          <CreatePlaceComponent
            localAnchor={localAnchor}
            setLocalAnchor={setLocalAnchor}
            setShowToastCreateLocation={setShowToastCreateLocation}
            setNewLocationError={setNewLocationError}
            setNewPositionLatitude={setNewPositionLatitude}
            newPositionLatitude={newPositionLatitude}
            setNewPositionLongitude={setNewPositionLongitude}
            newPositionLongitude={newPositionLongitude}
            selectedLocationDictionary={selectedLocationDictionary}
            temporaryLocationList={temporaryLocationList}
            setTemporaryLocationList={setTemporaryLocationList}
            getLocationsFromFilter={getLocationsFromFilter}
            filterLocationString={filterLocationString}
            newLocationDictionary={newLocationDictionary}
            setNewLocationDictionary={setNewLocationDictionary}
            updateLocationsInput={updateLocationsInput}
          />
        </IonFooter>
      </IonModal>
    </>
  );
};
