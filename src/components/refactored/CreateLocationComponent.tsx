import { useState, useEffect } from "react";
import { addCircleOutline, trashOutline, closeOutline } from "ionicons/icons";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { divIcon, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";

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
  IonInput,
  IonInfiniteScroll,
  IonList,
  IonSearchbar,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";

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

  // whenever the filter (search) is changed, the listing is updated
  useEffect(() => {
    // check if list is displayed
    if (document.getElementById("listFilteredLocations") != null) {
      getLocationsFromFilter();
    }
  }, [filterLocationString]);

  // update the filter string (search) by event (input)
  function updateLocationFilter(event: CustomEvent) {
    setFilterLocationString(event.detail.value);
  }

  // whenever the release of an individual location changes check the validity
  useEffect(() => {
    // error if location exists or no input
    if (
      newLocationDictionary.room_id == "" &&
      newLocationDictionary.lat == null &&
      newLocationDictionary.lon == null &&
      newLocationDictionary.floor_nr == null &&
      newLocationDictionary.building_id == "" &&
      newLocationDictionary.campus_id == "" &&
      newLocationDictionary.address_string == ""
    ) {
      setNewLocationError(true);
    } else {
      setNewLocationError(false);
    }
  }, [newLocationDictionary]);

  // update the location room_id by event (input)
  const readNewLocationInputRoom = (event: CustomEvent) => {
    const newLocationDictValue: { [key: string]: any } = Object.assign(
      {},
      newLocationDictionary
    );
    newLocationDictValue.room_id = event.detail.value;
    setNewLocationDictionary(newLocationDictValue);
  };

  // update the location floor_nr by event (input)
  const readNewLocationInputFloor = (event: CustomEvent) => {
    const newLocationDictValue: { [key: string]: any } = Object.assign(
      {},
      newLocationDictionary
    );
    if (event.detail.value == "") {
      newLocationDictValue.floor_nr = null;
    } else {
      newLocationDictValue.floor_nr = Math.round(event.detail.value);
    }
    setNewLocationDictionary(newLocationDictValue);
  };

  // create a new temporary location (only for user, until save on database)
  const createNewTempLocation = () => {
    if (
      newLocationDictionary.room_id != "" ||
      newLocationDictionary.lat != null ||
      newLocationDictionary.lon != null ||
      newLocationDictionary.floor_nr != null ||
      newLocationDictionary.building_id != "" ||
      newLocationDictionary.campus_id != "" ||
      newLocationDictionary.address_string != ""
    ) {
      const temporaryLocationListValue = temporaryLocationList;
      temporaryLocationListValue.push(newLocationDictionary);
      setTemporaryLocationList(temporaryLocationListValue);
      closeDialogCreateLocation();
      // reset dictionary for new user location
    }
    setShowToastCreateLocation(true);
  };

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

  // closing the dialog (modal) to enter a new location
  const closeDialogCreateLocation = () => {
    const dialogCreateLocation = document.getElementById(
      "dialogCreateLocation"
    ) as HTMLIonModalElement;
    dialogCreateLocation.dismiss();
    // update of the listing (locations)
    getLocationsFromFilter();
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

  // update of the list of buildings (buildings from database and temporarily created by user)
  const getBuildingsFromFilter = () => {
    // buildings from db
    const locationsDB = getLocationsFromDB();
    // cut out the relevant information for the building selection
    const allbuildingsDB = locationsDB.map(
      (location: { building_id: string; address_string: string; campus_id: string }) => ({
        building_id: location.building_id,
        address_string: location.address_string,
        campus_id: location.campus_id,
      })
    );
    // filter out the unique buildings
    const buildingsDB = filterUniqueRows(allbuildingsDB);
    // remove the dictionary for empty buildings from the list (if exists)
    const dictNoBuilding = {
      building_id: "",
      address_string: "",
      campus_id: "",
    };
    const buildingsDBClear = buildingsDB.filter(
      (dict: {}) => JSON.stringify(dict) !== JSON.stringify(dictNoBuilding)
    );
    // combination of all buildings
    const allBuildings = buildingsDBClear.concat(temporaryBuildingList);
    // sort the building list
    allBuildings.sort((a: any, b: any) => {
      const buildingA = a.building_id.toUpperCase(); // not case sensitive
      const buildingB = b.building_id.toUpperCase(); // not case sensitive
      if (buildingA < buildingB) {
        return -1;
      } else if (buildingA > buildingB) {
        return 1;
      } else {
        return 0;
      } // same room
    });
    // temporary storage of the current selection for subsequent editing
    const selectedBuildingDictValue = selectedBuildingDictionary;
    // clearing the current display
    const buildingFilteredList = document.getElementById("listFilteredBuildings")!;
    buildingFilteredList.innerHTML = "";
    // create the radio group element
    const buildingRadioGroup = document.createElement("ion-radio-group");
    buildingRadioGroup.setAttribute("value", JSON.stringify(selectedBuildingDictValue));
    // create dummy element (no selection)
    const buildingItemDummy = document.createElement("ion-item");
    buildingItemDummy.setAttribute("key", crypto.randomUUID());
    buildingItemDummy.setAttribute("lines", "none");
    const buildingRadioDummy = document.createElement("ion-radio");
    buildingRadioDummy.setAttribute("value", "{}");
    buildingRadioDummy.setAttribute("key", crypto.randomUUID());
    const buildingRadioDummyLabel = document.createElement("ion-label");
    buildingRadioDummyLabel.innerHTML = "keine Auswahl";
    buildingRadioDummyLabel.style.fontWeight = "bold";
    buildingRadioDummy.appendChild(buildingRadioDummyLabel);
    buildingItemDummy.appendChild(buildingRadioDummy);
    buildingRadioGroup.appendChild(buildingItemDummy);
    // iteration through all existing (db / user) buildings
    let i = 0;
    while (i < allBuildings.length) {
      const value: { [key: string]: any } = allBuildings[i];
      // list of all elements corresponding to the filter
      if (value.building_id.startsWith(filterBuildingString)) {
        // create all elements
        const buildingRadioValue = JSON.stringify(value);
        const buildingItem = document.createElement("ion-item");
        buildingItem.setAttribute("key", crypto.randomUUID());
        buildingItem.setAttribute("lines", "none");
        const buildingRadio = document.createElement("ion-radio");
        buildingRadio.setAttribute("value", buildingRadioValue);
        buildingRadio.setAttribute("key", crypto.randomUUID());
        // if exists, add the building name, address, and campus to the object in the selection list
        if (value.building_id != "" || value.campus_id != "") {
          const selectedBuildingName = document.createElement("ion-label");
          let innerHTMLString = "";
          if (value.building_id != "") {
            innerHTMLString +=
              '<span style="font-weight: bold">' + value.building_id + "</span> ";
          }
          if (value.campus_id != "") {
            innerHTMLString += "(";
            if (value.campus_id != "") {
              innerHTMLString += value.campus_id + ", ";
            }
            innerHTMLString = innerHTMLString.slice(0, -2) + ")";
          }
          selectedBuildingName.innerHTML = innerHTMLString;
          selectedBuildingName.setAttribute("class", "ion-text-wrap");
          buildingRadio.appendChild(selectedBuildingName);
        }
        // if exists, add the address to the object in the selection list
        if (value.address_string != "") {
          const selectedBuildingAddress = document.createElement("ion-label");
          selectedBuildingAddress.innerHTML = value.address_string;
          selectedBuildingAddress.setAttribute("class", "ion-text-wrap");
          buildingRadio.appendChild(selectedBuildingAddress);
        }
        buildingItem.appendChild(buildingRadio);
        // add the item (building) to the group
        buildingRadioGroup.appendChild(buildingItem);
      }
      i++;
    }
    // add event listener to the radio group
    // as soon as a radio is clicked, the string of the selected building is adjusted
    buildingRadioGroup.addEventListener("ionChange", function (event) {
      const buildingChanges = event as CustomEvent;
      if (Object.keys(buildingChanges.detail.value).length > 0) {
        setSelectedBuildingDictionary(JSON.parse(buildingChanges.detail.value));
      } else {
        // no selection
        setSelectedBuildingDictionary({});
      }
    });
    // add the item (building) to the display
    buildingFilteredList.appendChild(buildingRadioGroup);
  };

  // whenever the filter (search) is changed, the listing is updated
  useEffect(() => {
    // check if list is displayed
    if (document.getElementById("listFilteredBuildings") != null) {
      getBuildingsFromFilter();
    }
  }, [filterBuildingString]);

  // whenever the selected building ist changed, update the new location dict
  useEffect(() => {
    // check if list is displayed
    if (document.getElementById("listFilteredBuildings") != null) {
      getBuildingsFromFilter();
    }
    // save the building selection in the new location dictionary
    const newLocationDictValue: { [key: string]: any } = Object.assign(
      {},
      newLocationDictionary
    );
    if (Object.keys(selectedBuildingDictionary).length > 0) {
      newLocationDictValue.building_id = selectedBuildingDictionary.building_id;
      newLocationDictValue.address_string = selectedBuildingDictionary.address_string;
      newLocationDictValue.campus_id = selectedBuildingDictionary.campus_id;
      setNewLocationDictionary(newLocationDictValue);
    } else {
      newLocationDictValue.building_id = "";
      newLocationDictValue.address_string = "";
      newLocationDictValue.campus_id = "";
      setNewLocationDictionary(newLocationDictValue);
    }
  }, [selectedBuildingDictionary]);

  // update the filter string (search) by event (input)
  function updateBuildingFilter(event: CustomEvent) {
    setFilterBuildingString(event.detail.value);
  }

  // whenever the release of an individual building changes check the validity
  useEffect(() => {
    // error if location exists or no input
    if (
      newBuildingDictionary.building_id == "" &&
      newBuildingDictionary.address_string == "" &&
      newBuildingDictionary.campus_id == ""
    ) {
      setNewBuildingError(true);
    } else {
      setNewBuildingError(false);
    }
  }, [newBuildingDictionary]);

  // update the building building_id by event (input)
  const readNewBuildingInputBuilding = (event: CustomEvent) => {
    const newBuildingDictValue: { [key: string]: any } = Object.assign(
      {},
      newBuildingDictionary
    );
    newBuildingDictValue.building_id = event.detail.value;
    setNewBuildingDictionary(newBuildingDictValue);
  };

  // update the building address_string by event (input)
  const readNewBuildingInputAddress = (event: CustomEvent) => {
    const newBuildingDictValue: { [key: string]: any } = Object.assign(
      {},
      newBuildingDictionary
    );
    newBuildingDictValue.address_string = event.detail.value;
    setNewBuildingDictionary(newBuildingDictValue);
  };

  // update the building address_string by event (input)
  const readNewBuildingInputCampus = (event: CustomEvent) => {
    const newBuildingDictValue: { [key: string]: any } = Object.assign(
      {},
      newBuildingDictionary
    );
    newBuildingDictValue.campus_id = event.detail.value;
    setNewBuildingDictionary(newBuildingDictValue);
  };

  // create a new temporary building (only for user, until save on database)
  const createNewTempBuilding = () => {
    if (
      newBuildingDictionary.building_id != "" ||
      newBuildingDictionary.address_string != "" ||
      newBuildingDictionary.campus_id != ""
    ) {
      const temporaryBuildingListValue = temporaryBuildingList;
      temporaryBuildingListValue.push(newBuildingDictionary);
      setTemporaryBuildingList(temporaryBuildingListValue);
      closeDialogCreateBuilding();
    }
    setShowToastCreateBuilding(true);
  };

  // reset the constants for a new temporary building
  const resetConstantsTempBuilding = () => {
    setNewBuildingDictionary({
      building_id: "",
      address_string: "",
      campus_id: "",
    });
    setSelectedBuildingDictionary({});
  };

  // closing the dialog (modal) to enter a new location
  const closeDialogCreateBuilding = () => {
    const dialogCreateBuilding = document.getElementById(
      "dialogCreateBuilding"
    ) as HTMLIonModalElement;
    dialogCreateBuilding.dismiss();
    // update of the listing (locations)
    getBuildingsFromFilter();
  };

  // closing the dialog (modal) to select locations
  const closeDialogSelectBuilding = () => {
    const dialogSelectBuilding = document.getElementById(
      "dialogSelectBuilding"
    ) as HTMLIonModalElement;
    dialogSelectBuilding.dismiss();
  };

  // updating the button for selecting buildings (text display including the selected buildings)
  const updateBuildingsInput = () => {
    // reset filter string (buildings)
    setFilterBuildingString("");
    // clearing the current display
    const buildingContainerDiv = document.getElementById("buildingContainer")!;
    buildingContainerDiv.innerHTML = "";
    if (Object.keys(selectedBuildingDictionary).length == 0) {
      // nothing to do
    } else {
      // create a new element for the selected building
      const buildingButton = document.createElement("ion-button");
      buildingButton.setAttribute("id", JSON.stringify(selectedBuildingDictionary));
      buildingButton.setAttribute("class", "buildingContainerButton");
      buildingButton.setAttribute("color", "medium");
      // add a function to delete the building
      buildingButton.addEventListener("click", (event: any) => {
        buildingContainerDiv.innerHTML = "";
        setSelectedBuildingDictionary({});
      });
      const buildingButtonLabel = document.createElement("ion-label");
      buildingButtonLabel.classList.add("buildingContainerButtonLabels", "ion-text-wrap");
      let innerHTMLString = "";
      if (selectedBuildingDictionary.building_id != "") {
        if (
          selectedBuildingDictionary.address_string != "" ||
          selectedBuildingDictionary.campus_id != ""
        ) {
          innerHTMLString += selectedBuildingDictionary.building_id + ", ";
          if (selectedBuildingDictionary.address_string != "") {
            innerHTMLString += selectedBuildingDictionary.address_string;
          } else if (selectedBuildingDictionary.campus_id != "") {
            innerHTMLString += selectedBuildingDictionary.campus_id;
          }
        } else {
          innerHTMLString += selectedBuildingDictionary.building_id;
        }
      } else {
        if (selectedBuildingDictionary.address_string != "") {
          innerHTMLString += selectedBuildingDictionary.address_string;
        } else if (selectedBuildingDictionary.campus_id != "") {
          innerHTMLString += selectedBuildingDictionary.campus_id;
        }
      }
      buildingButtonLabel.innerHTML = innerHTMLString;
      const buildingButtonIcon = document.createElement("ion-icon");
      buildingButtonIcon.setAttribute("icon", trashOutline);
      buildingButton.appendChild(buildingButtonLabel);
      buildingButton.appendChild(buildingButtonIcon);
      buildingContainerDiv.appendChild(buildingButton);
    }
  };

  // get click position and place marker
  function GetPosClickDisplayedMap() {
    const customMarkerStyle = `
      background-color: #44a2fa;
      width: 3rem;
      height: 3rem;
      display: block;
      left: -1.5rem;
      top: -1.5rem;
      position: relative;
      border-radius: 3rem 3rem 0;
      transform: rotate(45deg);
      border: 1px solid #FFFFFF`;
    const customPosIcon = divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      html: `<span style="${customMarkerStyle}" />`,
    });
    const map = useMapEvents({
      click: (e) => {
        map.eachLayer((layer) => {
          if (layer.options.pane === "markerPane") {
            map.removeLayer(layer);
          }
        });
        const mapPositionMarker = new Marker(e.latlng, { icon: customPosIcon });
        mapPositionMarker.addTo(map); // add to map;
        setNewPositionLatitude(e.latlng.lat);
        setNewPositionLongitude(e.latlng.lng);
      },
    });
    return null;
  }

  // save the selected coordinates from the map
  const saveClickedLocation = () => {
    if (!Number.isNaN(newPositionLatitude) && !Number.isNaN(newPositionLongitude)) {
      // save the coordinates in the new location

      // get container for displaying selection
      const locationContainerDiv = document.getElementById("positionContainer")!;
      locationContainerDiv.innerHTML = "";

      // create a new element for the selected position
      const positionButton = document.createElement("ion-button");
      positionButton.setAttribute("id", JSON.stringify(newPositionLatitude));
      positionButton.setAttribute("class", "positionContainerButton");
      positionButton.setAttribute("color", "medium");
      // add a function to delete the building
      positionButton.addEventListener("click", (event: any) => {
        locationContainerDiv.innerHTML = "";
        // reset temp clicked position
        setNewPositionLatitude(NaN);
        setNewPositionLongitude(NaN);
      });
      const locationButtonLabel = document.createElement("ion-label");
      locationButtonLabel.classList.add("positionContainerButtonLabels", "ion-text-wrap");
      const innerHTMLString =
        newPositionLatitude.toFixed(5) + " / " + newPositionLongitude.toFixed(5);
      locationButtonLabel.innerHTML = innerHTMLString;
      const locationButtonIcon = document.createElement("ion-icon");
      locationButtonIcon.setAttribute("icon", trashOutline);
      positionButton.appendChild(locationButtonLabel);
      positionButton.appendChild(locationButtonIcon);
      locationContainerDiv.appendChild(positionButton);
    }
    // close modal
    {
      (document.getElementById("dialogSelectPosition")! as HTMLIonModalElement).dismiss();
    }
  };

  // update the coordinates
  useEffect(() => {
    const newLocationDictValue: { [key: string]: any } = Object.assign(
      {},
      newLocationDictionary
    );
    newLocationDictValue.lat = Number.isNaN(newPositionLatitude)
      ? undefined
      : newPositionLatitude;
    newLocationDictValue.lon = Number.isNaN(newPositionLongitude)
      ? undefined
      : newPositionLongitude;
    setNewLocationDictionary(newLocationDictValue);
  }, [newPositionLatitude, newPositionLongitude]);

  // close location selection on map without selection
  const closeLocationSelectionMap = () => {
    // reset temp clicked position
    setNewPositionLatitude(NaN);
    setNewPositionLongitude(NaN);
    // close modal
    {
      (document.getElementById("dialogSelectPosition")! as HTMLIonModalElement).dismiss();
    }
  };

  // save changes in the temporary anchor for forwarding to the database
  useEffect(() => {
    setLocalAnchor({
      ...localAnchor,
      room_id:
        selectedLocationDictionary.room_id !== ""
          ? selectedLocationDictionary.room_id
          : undefined,
      // manipulate coordinates (multiply by 100000 and integer) for storage in database -> problems with floating point numbers
      lat:
        selectedLocationDictionary.lat === null
          ? undefined
          : Math.round(selectedLocationDictionary.lat * 1_000_000),
      lon:
        selectedLocationDictionary.lon === null
          ? undefined
          : Math.round(selectedLocationDictionary.lon * 1_000_000),
      floor_nr:
        selectedLocationDictionary.floor_nr === null
          ? undefined
          : selectedLocationDictionary.floor_nr,
      building_id:
        selectedLocationDictionary.building_id !== ""
          ? selectedLocationDictionary.building_id
          : undefined,
      address_string:
        selectedLocationDictionary.address_string !== ""
          ? selectedLocationDictionary.address_string
          : undefined,
      campus_id:
        selectedLocationDictionary.campus_id !== ""
          ? selectedLocationDictionary.campus_id
          : undefined,
    });
    updateLocationsInput;
  }, [selectedLocationDictionary]);

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
          <IonSearchbar
            onIonInput={updateLocationFilter}
            color="light"
            id="locationSearchBar"
          ></IonSearchbar>
        </IonHeader>
        <IonContent>
          <IonInfiniteScroll>
            <IonList id="listFilteredLocations"></IonList>
          </IonInfiniteScroll>
        </IonContent>
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
          {/* overlay (modal) for the creation of locations */}
          <IonModal id="dialogCreateLocation" trigger="openDialogCreateLocation">
            <IonHeader>
              <IonToolbar>
                <IonTitle slot="start">Ort erstellen</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={closeDialogCreateLocation}>
                    <IonIcon icon={closeOutline} size="large"></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent class="padding">
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonInput
                      onIonInput={readNewLocationInputRoom}
                      color="dark"
                      label="Raum"
                      labelPlacement="stacked"
                      type="text"
                      fill="outline"
                      style={{ margin: "16px 0 16px 0" }}
                      placeholder="Raum"
                    ></IonInput>
                    <IonButton
                      id="openDialogSelectPosition"
                      expand="block"
                      color="light"
                      fill="solid"
                      size="default"
                    >
                      <div>
                        <IonLabel
                          id="openDialogSelectPositionLabel"
                          class="ion-text-wrap"
                        >
                          Position auf Karte
                        </IonLabel>
                        <IonIcon
                          icon={addCircleOutline}
                          size="large"
                          aria-hidden="true"
                        ></IonIcon>
                      </div>
                    </IonButton>
                    <div id="positionContainer">
                      {/* container for showing the selection */}
                    </div>
                    {/* overlay (modal) for the selection of the position */}
                    <IonModal
                      id="dialogSelectPosition"
                      trigger="openDialogSelectPosition"
                      onIonModalDidPresent={() => {
                        window.dispatchEvent(new Event("resize"));
                      }}
                    >
                      <IonHeader>
                        <IonToolbar>
                          <IonTitle slot="start">Position wählen</IonTitle>
                          <IonButtons slot="end">
                            <IonButton onClick={() => closeLocationSelectionMap()}>
                              <IonIcon icon={closeOutline} size="large"></IonIcon>
                            </IonButton>
                          </IonButtons>
                        </IonToolbar>
                      </IonHeader>
                      <IonContent class="padding">
                        <MapContainer
                          id="selectPositionMap"
                          center={[47.5349015179286, 7.6419409280402535]}
                          zoom={18}
                          maxBounds={[
                            [45.8148308954386, 5.740290246442871],
                            [47.967830538595194, 10.594475942663449],
                          ]}
                        >
                          <WMSTileLayer
                            id="backgroundPixelKarte"
                            url="https://wms.geo.admin.ch/?"
                            layers="ch.swisstopo.pixelkarte-farbe"
                            format="image/jpeg"
                            detectRetina={true}
                            minZoom={7.5}
                            maxZoom={20}
                            attribution="Map by <a href = 'https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
                          />
                          <GetPosClickDisplayedMap />
                        </MapContainer>
                      </IonContent>
                      <IonFooter>
                        <IonGrid>
                          <IonRow>
                            <IonCol>
                              <IonButton
                                onClick={() => closeLocationSelectionMap()}
                                id="cancelTempLocation"
                                expand="full"
                                color="primary"
                              >
                                Abbrechen
                              </IonButton>
                            </IonCol>
                            <IonCol>
                              <IonButton
                                onClick={() => saveClickedLocation()}
                                id="saveTempLocation"
                                expand="full"
                                color="primary"
                              >
                                Speichern
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                      </IonFooter>
                    </IonModal>
                    <IonInput
                      onIonInput={readNewLocationInputFloor}
                      color="dark"
                      label="Stockwerk"
                      labelPlacement="stacked"
                      type="number"
                      fill="outline"
                      style={{ margin: "16px 0 16px 0" }}
                      placeholder="Stockwerk"
                    ></IonInput>
                    <IonButton
                      id="openDialogSelectBuilding"
                      expand="block"
                      color="light"
                      fill="solid"
                      size="default"
                    >
                      <div>
                        <IonLabel
                          id="openDialogSelectBuildingLabel"
                          class="ion-text-wrap"
                        >
                          Gebäude
                        </IonLabel>
                        <IonIcon
                          icon={addCircleOutline}
                          size="large"
                          aria-hidden="true"
                        ></IonIcon>
                      </div>
                    </IonButton>
                    <div id="buildingContainer">
                      {/* container for showing the selection */}
                    </div>
                    {/* overlay (modal) for the selection of a building */}
                    <IonModal
                      id="dialogSelectBuilding"
                      trigger="openDialogSelectBuilding"
                      onDidPresent={getBuildingsFromFilter}
                      onDidDismiss={updateBuildingsInput}
                    >
                      <IonHeader>
                        <IonToolbar>
                          <IonTitle slot="start">Gebäude auswählen</IonTitle>
                          <IonButtons slot="end">
                            <IonButton onClick={closeDialogSelectBuilding}>
                              <IonIcon icon={closeOutline} size="large"></IonIcon>
                            </IonButton>
                          </IonButtons>
                        </IonToolbar>
                        <IonSearchbar
                          onIonInput={updateBuildingFilter}
                          color="light"
                          id="buildingSearchBar"
                        ></IonSearchbar>
                      </IonHeader>
                      <IonContent>
                        <IonInfiniteScroll>
                          <IonList id="listFilteredBuildings"></IonList>
                        </IonInfiniteScroll>
                      </IonContent>
                      <IonFooter>
                        <IonGrid>
                          <IonRow>
                            <IonCol>
                              <IonButton
                                onClick={resetConstantsTempBuilding}
                                id="openDialogCreateBuilding"
                                expand="full"
                                color="primary"
                              >
                                Neues Gebäude
                              </IonButton>
                            </IonCol>
                            <IonCol>
                              <IonButton
                                onClick={closeDialogSelectBuilding}
                                id="cancelSelectBuilding"
                                expand="full"
                                color="primary"
                              >
                                Speichern
                              </IonButton>
                            </IonCol>
                          </IonRow>
                        </IonGrid>
                        {/* overlay (modal) for the creation of buildings */}
                        <IonModal
                          id="dialogCreateBuilding"
                          trigger="openDialogCreateBuilding"
                        >
                          <IonHeader>
                            <IonToolbar>
                              <IonTitle slot="start">Gebäude erstellen</IonTitle>
                              <IonButtons slot="end">
                                <IonButton onClick={closeDialogCreateBuilding}>
                                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                                </IonButton>
                              </IonButtons>
                            </IonToolbar>
                          </IonHeader>
                          <IonContent class="padding">
                            <IonGrid>
                              <IonRow>
                                <IonCol>
                                  <IonInput
                                    onIonInput={readNewBuildingInputBuilding}
                                    color="dark"
                                    label="Gebäudename"
                                    labelPlacement="stacked"
                                    type="text"
                                    fill="outline"
                                    style={{ margin: "16px 0 16px 0" }}
                                    placeholder="Gebäudenamen"
                                  ></IonInput>
                                  <IonInput
                                    onIonInput={readNewBuildingInputAddress}
                                    color="dark"
                                    label="Adresse"
                                    labelPlacement="stacked"
                                    type="text"
                                    fill="outline"
                                    style={{ margin: "16px 0 16px 0" }}
                                    placeholder="Adresse"
                                  ></IonInput>
                                  <IonInput
                                    onIonInput={readNewBuildingInputCampus}
                                    color="dark"
                                    label="Campus"
                                    labelPlacement="stacked"
                                    type="text"
                                    fill="outline"
                                    style={{ margin: "16px 0 16px 0" }}
                                    placeholder="Campus"
                                  ></IonInput>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </IonContent>
                          <IonFooter>
                            <IonGrid>
                              <IonRow>
                                <IonCol>
                                  <IonButton
                                    onClick={closeDialogCreateBuilding}
                                    id="cancelTempBuilding"
                                    expand="full"
                                    color="primary"
                                  >
                                    Abbrechen
                                  </IonButton>
                                </IonCol>
                                <IonCol>
                                  <IonButton
                                    onClick={createNewTempBuilding}
                                    id="saveTempBuilding"
                                    expand="full"
                                    color="primary"
                                  >
                                    Speichern
                                  </IonButton>
                                </IonCol>
                              </IonRow>
                            </IonGrid>
                          </IonFooter>
                        </IonModal>
                      </IonFooter>
                    </IonModal>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonContent>
            <IonFooter>
              <IonGrid>
                <IonRow>
                  <IonCol>
                    <IonButton
                      onClick={closeDialogCreateLocation}
                      id="cancelTempLocation"
                      expand="full"
                      color="primary"
                    >
                      Abbrechen
                    </IonButton>
                  </IonCol>
                  <IonCol>
                    <IonButton
                      onClick={createNewTempLocation}
                      id="saveTempLocation"
                      expand="full"
                      color="primary"
                    >
                      Speichern
                    </IonButton>
                  </IonCol>
                </IonRow>
              </IonGrid>
            </IonFooter>
          </IonModal>
        </IonFooter>
      </IonModal>
    </>
  );
};
