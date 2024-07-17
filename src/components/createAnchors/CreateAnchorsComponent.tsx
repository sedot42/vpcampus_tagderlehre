import {
  useState,
  useContext,
  useEffect,
  useRef,
  BaseSyntheticEvent,
} from "react";
import { StatusHeader } from "../globalUI/StatusHeader";
import {
  Anchor,
  convertFlatAnchorToDBAnchor,
  DraftAnchor,
} from "../../types/types";
import { draftAnchor } from "../../types/defaults";
import { AnchorContext } from "../../anchorContext";
import {
  ConfigInput,
  createInputs,
  createTextarea,
} from "../globalUI/GenericFields";
import {
  IonPage,
  IonButton,
  IonFooter,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonLabel,
  IonItem,
  IonToast,
  IonInput,
  IonSearchbar,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonToggle,
  IonHeader,
  IonInfiniteScroll,
  IonList,
  IonIcon,
  IonTitle,
  IonButtons,
  IonToolbar,
} from "@ionic/react";
import {
  addCircleOutline,
  checkmarkCircleOutline,
  alertCircleOutline,
  trashOutline,
  closeOutline,
} from "ionicons/icons";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { divIcon, Marker, icon } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";

export const CreateAnchorComponent = () => {
  // definition of functional components (hooks)
  // ------------------------------------------------------------------------------------------

  // anchors from the server (database)
  const { anchors } = useContext(AnchorContext);

  const [localAnchor, setLocalAnchor] = useState<DraftAnchor>(draftAnchor);
  const { createOneAnchor } = useContext(AnchorContext);
  const [error, setError] = useState(false);

  // functional components for the selection of tags for an anchor
  const [filterTagString, setFilterTagString] = useState<string>(""); // string to filter the tags
  const [selectedTagList, setSelectedTagList] = useState<string[]>([]); // list of all selected tags
  const [newTagString, setNewTagString] = useState<string>(""); // new tag as string
  const [temporaryTagList, setTemporaryTagList] = useState<string[]>([]); // list with all tags created by user
  const [newTagError, setNewTagError] = useState<boolean>(false); // status for permissibility of the created tag
  const [showToastCreateTag, setShowToastCreateTag] = useState<boolean>(false); // status for triggering the user information

  // functional components for date allocation
  const [useDate, setUseDate] = useState<boolean>(false); // status whether date should be set or not
  const [anchorStartDate, setAnchorStartDate] = useState<string>(""); // string for the start point
  const [anchorEndDate, setAnchorEndDate] = useState<string>(""); // string for the end point

  // functional components for valid allocation
  const [useValid, setUseValid] = useState<boolean>(false); // status whether valid should be set or not
  const [anchorStartValid, setAnchorStartValid] = useState<string>(""); // string for the start point
  const [anchorEndValid, setAnchorEndValid] = useState<string>(""); // string for the end point

  // functional components for the selection of group for an anchor
  const [filterGroupString, setFilterGroupString] = useState<string>(""); // string to filter the groups
  const [selectedGroupString, setSelectedGroupString] = useState<string>(""); // string of the selected group
  const [newGroupString, setNewGroupString] = useState<string>(""); // new group as string
  const [temporaryGroupList, setTemporaryGroupList] = useState<string[]>([]); // list with all groups created by user
  const [newGroupError, setNewGroupError] = useState<boolean>(false); // status for permissibility of the created group
  const [showToastCreateGroup, setShowToastCreateGroup] =
    useState<boolean>(false); // status for triggering the user information

  // functional components for the selection of location for an anchor
  const [filterLocationString, setFilterLocationString] = useState<string>(""); // string to filter the locations
  const [selectedLocationDictionary, setSelectedLocationDictionary] = useState<{
    [key: string]: any;
  }>({}); // list of the selected location
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
  const [temporaryLocationList, setTemporaryLocationList] = useState<any[]>([]); // list with all locations created by user
  const [newLocationError, setNewLocationError] = useState<boolean>(false); // status for permissibility of the created location
  const [showToastCreateLocation, setShowToastCreateLocation] =
    useState<boolean>(false); // status for triggering the user information

  const [filterBuildingString, setFilterBuildingString] = useState<string>(""); // string to filter the buildings
  const [selectedBuildingDictionary, setSelectedBuildingDictionary] = useState<{
    [key: string]: any;
  }>({}); // list of the selected building
  const [newBuildingDictionary, setNewBuildingDictionary] = useState<{
    [key: string]: any;
  }>({ building_id: "", address_string: "", campus_id: "" }); // new user building as dictionary
  const [temporaryBuildingList, setTemporaryBuildingList] = useState<any[]>([]); // list with all buildings created by user
  const [newBuildingError, setNewBuildingError] = useState<boolean>(false); // status for permissibility of the created building
  const [showToastCreateBuilding, setShowToastCreateBuilding] =
    useState<boolean>(false); // status for triggering the user information

  const [newPositionLatitude, setNewPositionLatitude] = useState<number>(NaN); // temporary number to save new coordinate - lat
  const [newPositionLongitude, setNewPositionLongitude] = useState<number>(NaN); // temporary number to save new coordinate - lon

  // functional components for the selection of documents for an anchor
  const [selectedFileList, setSelectedFileList] = useState<string[]>([]); // list of all selected documents
  const fileInput = useRef<null>(null); // ref object for input

  // handover of the anchor to the database
  // ------------------------------------------------------------------------------------------

  // send anchor to server
  const handleSubmission = () => {
    console.log(localAnchor);
    if (localAnchor.anchor_name) {
      setError(false);
      createOneAnchor(localAnchor);
      setLocalAnchor(defaultAnchor);
      // reset all
      setSelectedTagList([]); // tags
      setAnchorStartDate(""); // date-start
      setAnchorEndDate(""); // date-end
      setAnchorStartValid(""); // validity-start
      setAnchorEndValid(""); // validity-end
      setSelectedLocationDictionary({}); // location
      setNewPositionLatitude(NaN); // latitude
      setNewPositionLongitude(NaN); // longitude
      setSelectedBuildingDictionary({}); // building
      // reset temporary user creations
      setTemporaryTagList([]); // tag
      setTemporaryGroupList([]); // group
      setTemporaryLocationList([]); // location
      setTemporaryBuildingList([]); // building
      const locationContainerDiv =
        document.getElementById("locationContainer")!;
      locationContainerDiv.innerHTML = "";
      setSelectedGroupString(""); // group
      const groupContainerDiv = document.getElementById("groupContainer")!;
      groupContainerDiv.innerHTML = "";
      setSelectedFileList([]); // documents
    } else {
      setError(true);
    }
  };

  // configuration of the input for the anchor name
  const configTitle: ConfigInput[] = [
    {
      required: true,
      property: "anchor_name",
      placeholder: "Name",
      label: "Name",
      fill: "outline",
    },
  ];

  // configuration of the input for the anchor Description
  const configDescription: ConfigInput[] = [
    {
      required: false,
      property: "anchor_description",
      placeholder: "Beschreibung",
      label: "Beschreibung",
      fill: "outline",
    },
  ];

  // functions (pipelines) for the tags
  // ------------------------------------------------------------------------------------------

  // get all unique tags that occur in the database
  const getTagsFromDB = () => {
    if (!anchors) return [];
    const uniqueTags = new Set();
    anchors.forEach((anchor) => {
      if (anchor && anchor.tags) {
        anchor.tags.forEach((tag) => {
          if (tag) uniqueTags.add(tag);
        });
      }
    });
    return Array.from(uniqueTags);
  };

  // update of the list of tags (tags from database and temporarily created by user)
  const getTagsFromFilter = () => {
    // tags from db
    const tagsDB = getTagsFromDB();
    // combination of all tags and sorted
    const allTags = tagsDB.concat(temporaryTagList).sort();
    // temporary storage of the current selection for subsequent editing
    var selectedTagListValue = selectedTagList;
    // clearing the current display
    var tagFilteredList = document.getElementById("listFilteredTags")!;
    tagFilteredList.innerHTML = "";
    // iteration through all existing (db / user) tags
    let i = 0;
    while (i < allTags.length) {
      const value: any = allTags[i];
      // list of all elements corresponding to the filter
      if (value.startsWith(filterTagString)) {
        // create all elements
        var tagCheckBoxValue = value;
        var tagItem = document.createElement("ion-item");
        tagItem.setAttribute("key", crypto.randomUUID());
        tagItem.setAttribute("lines", "none");
        var tagCheckbox = document.createElement("ion-checkbox");
        tagCheckbox.setAttribute("value", tagCheckBoxValue);
        tagCheckbox.setAttribute("key", crypto.randomUUID());
        // if the element is in the list of selected elements, the checkbox is set
        if (selectedTagListValue.includes(tagCheckBoxValue)) {
          tagCheckbox.setAttribute("checked", "true");
        }
        // as soon as a checkbox is clicked, the list of selected tags is adjusted
        tagCheckbox.addEventListener("ionChange", function (event) {
          var tagChanges = event as CustomEvent;
          // new selection -> add to list
          if (tagChanges.detail.checked == true) {
            selectedTagListValue.push(tagChanges.detail.value);
            setSelectedTagList(selectedTagListValue);
          }
          // omitted selection -> remove from list
          else {
            const index = selectedTagListValue.indexOf(tagChanges.detail.value);
            if (index > -1) {
              // only splice array when item is found
              selectedTagListValue.splice(index, 1); // 2nd parameter means remove one item only
            }
            setSelectedTagList(selectedTagListValue);
          }
          // save changes in the temporary anchor for forwarding to the database
          setLocalAnchor({
            ...localAnchor,
            tags: selectedTagList.length > 0 ? selectedTagList : undefined,
          });
        });
        tagCheckbox.innerHTML = value;
        tagItem.appendChild(tagCheckbox);
        // add the item (tag) to the display
        tagFilteredList.appendChild(tagItem);
      }
      i++;
    }
  };

  // whenever the filter (search) is changed, the listing is updated
  useEffect(() => {
    // check if list is displayed
    if (document.getElementById("listFilteredTags") != null) {
      getTagsFromFilter();
    }
  }, [filterTagString]);

  // update the filter string (search) by event (input)
  function updateTagFilter(event: CustomEvent) {
    setFilterTagString(event.detail.value);
  }

  // whenever the release of an individual tag changes check the validity
  useEffect(() => {
    // error if tag exists or no input
    if (
      getTagsFromDB().includes(newTagString) ||
      temporaryTagList.includes(newTagString) ||
      newTagString == ""
    ) {
      setNewTagError(true);
    } else {
      setNewTagError(false);
    }
  }, [newTagString]);

  // update the tag string by event (input)
  const readNewTagInput = (event: CustomEvent) => {
    setNewTagString(event.detail.value);
  };

  // create a new temporary tag (only for user, until save on database)
  const createNewTempTag = () => {
    if (newTagString != "") {
      if (
        getTagsFromDB().includes(newTagString) ||
        temporaryTagList.includes(newTagString)
      ) {
      } else {
        const temporaryTagListValue = temporaryTagList;
        temporaryTagListValue.push(newTagString);
        setTemporaryTagList(temporaryTagListValue);
        closeDialogCreateTag();
      }
    }
    setShowToastCreateTag(true);
  };

  // closing the dialog (modal) to enter a new tag
  const closeDialogCreateTag = () => {
    var dialogCreateTag = document.getElementById(
      "dialogCreateTag"
    ) as HTMLIonModalElement;
    dialogCreateTag.dismiss();
    // update of the listing (tags)
    getTagsFromFilter();
  };

  // closing the dialog (modal) to select tags
  const closeDialogSelectTag = () => {
    var dialogSelectTag = document.getElementById(
      "dialogSelectTag"
    ) as HTMLIonModalElement;
    dialogSelectTag.dismiss();
  };

  // updating the button for selecting tags (text display including the selected tags)
  const updateTagInput = () => {
    // reset filter string (tag)
    setFilterTagString("");
    // clearing the current display
    const tagContainerDiv = document.getElementById("tagContainer")!;
    tagContainerDiv.innerHTML = "";
    if (selectedTagList.length == 0) {
      //nothing to do
    } else {
      // iteration through all selected tags
      let i = 0;
      while (i < selectedTagList.length) {
        // create all elements
        const tagButton = document.createElement("ion-button");
        tagButton.setAttribute("id", selectedTagList[i]);
        tagButton.setAttribute("class", "tagContainerButton");
        tagButton.setAttribute("color", "medium");
        // add a function to delete tags
        tagButton.addEventListener("click", (event: any) => {
          const targetButton = event.currentTarget as HTMLElement;
          const targetTag = targetButton.getAttribute("id");
          // iterate through list and remove deleted elements
          const selectedTagListValue = [];
          let j = 0;
          while (j < selectedTagList.length) {
            if (selectedTagList[j] != targetTag) {
              selectedTagListValue.push(selectedTagList[j]);
            }
            j++;
          }
          setSelectedTagList(selectedTagListValue);
        });
        const tagButtonLabel = document.createElement("ion-label");
        tagButtonLabel.classList.add(
          "tagContainerButtonLabels",
          "ion-text-wrap"
        );
        tagButtonLabel.innerHTML = selectedTagList[i];
        const tagButtonIcon = document.createElement("ion-icon");
        tagButtonIcon.setAttribute("icon", trashOutline);
        tagButton.appendChild(tagButtonLabel);
        tagButton.appendChild(tagButtonIcon);
        tagContainerDiv.appendChild(tagButton);
        i++;
      }
    }
  };

  // save changes in the temporary anchor for forwarding to the database
  useEffect(() => {
    updateTagInput();
    setLocalAnchor({
      ...localAnchor,
      tags: selectedTagList.length > 0 ? selectedTagList : undefined,
    });
  }, [selectedTagList]);

  // functions (pipelines) for the date
  // ------------------------------------------------------------------------------------------

  // show data selection when toggle is activated
  const addDate = () => {
    if (useDate) {
      setUseDate(false);
      document.getElementById("dateContainer")!.style.display = "none";
    } else {
      setUseDate(true);
      document.getElementById("dateContainer")!.style.display = "inline";
    }
  };

  // update the starttime by event (input)
  function updateStartTimeInput(event: CustomEvent) {
    setAnchorStartDate(event.detail.value);
  }

  // update the endtime by event (input)
  function updateEndTimeInput(event: CustomEvent) {
    setAnchorEndDate(event.detail.value);
  }

  // changing the dates in the event of changes in time or use
  useEffect(() => {
    if (useDate) {
      setLocalAnchor({
        ...localAnchor,
        start_at:
          anchorStartDate != ""
            ? (anchorStartDate as string) + ".000Z"
            : undefined,
        end_at:
          anchorEndDate != "" ? (anchorEndDate as string) + ".000Z" : undefined,
      });
    } else {
      setLocalAnchor({
        ...localAnchor,
        start_at: undefined,
        end_at: undefined,
      });
    }
  }, [useDate, anchorStartDate, anchorEndDate]);

  // functions (pipelines) for the validity
  // ------------------------------------------------------------------------------------------

  // show validity selection when toggle is activated
  const addValid = () => {
    if (useValid) {
      setUseValid(false);
      document.getElementById("validContainer")!.style.display = "none";
    } else {
      setUseValid(true);
      document.getElementById("validContainer")!.style.display = "inline";
    }
  };

  // update the valid starttime by event (input)
  function updateStartValidInput(event: CustomEvent) {
    setAnchorStartValid(event.detail.value);
  }

  // update the valid endtime by event (input)
  function updateEndValidInput(event: CustomEvent) {
    setAnchorEndValid(event.detail.value);
  }

  // changing the dates in the event of changes in time or use
  useEffect(() => {
    if (useValid) {
      setLocalAnchor({
        ...localAnchor,
        valid_from:
          anchorStartValid != ""
            ? (anchorStartValid as string) + ".000Z"
            : undefined,
        valid_until:
          anchorEndValid != ""
            ? (anchorEndValid as string) + ".000Z"
            : undefined,
      });
    } else {
      setLocalAnchor({
        ...localAnchor,
        valid_from: undefined,
        valid_until: undefined,
      });
    }
  }, [useValid, anchorStartValid, anchorEndValid]);

  // functions (pipelines) for the location
  // ------------------------------------------------------------------------------------------

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
    var allLocations = locationsDB.concat(temporaryLocationList);
    // sort the location list
    allLocations.sort((a: any, b: any) => {
      let roomA = a.room_id.toUpperCase(); // not case sensitive
      let roomB = b.room_id.toUpperCase(); // not case sensitive
      if (roomA < roomB) {
        return -1;
      } else if (roomA > roomB) {
        return 1;
      } else {
        return 0;
      } // same room
    });
    // temporary storage of the current selection for subsequent editing
    var selectedLocationDictValue = selectedLocationDictionary;
    // clearing the current display
    var locationFilteredList = document.getElementById(
      "listFilteredLocations"
    )!;
    locationFilteredList.innerHTML = "";
    // create the radio group element
    var locationRadioGroup = document.createElement("ion-radio-group");
    locationRadioGroup.setAttribute(
      "value",
      JSON.stringify(selectedLocationDictValue)
    );
    // create dummy element (no selection)
    var locationItemDummy = document.createElement("ion-item");
    locationItemDummy.setAttribute("key", crypto.randomUUID());
    locationItemDummy.setAttribute("lines", "none");
    var locationRadioDummy = document.createElement("ion-radio");
    locationRadioDummy.setAttribute("value", "{}");
    locationRadioDummy.setAttribute("key", crypto.randomUUID());
    var locationRadioDummyLabel = document.createElement("ion-label");
    locationRadioDummyLabel.innerHTML = "keine Auswahl";
    locationRadioDummyLabel.style.fontWeight = "bold";
    locationRadioDummy.appendChild(locationRadioDummyLabel);
    locationItemDummy.appendChild(locationRadioDummy);
    locationRadioGroup.appendChild(locationItemDummy);
    // iteration through all existing (db / user) locations
    let i = 0;
    while (i < allLocations.length) {
      var value: { [key: string]: any } = allLocations[i];
      // list of all elements corresponding to the filter
      if (value.room_id.startsWith(filterLocationString)) {
        // create all elements
        var locationRadioValue = JSON.stringify(value);
        var locationItem = document.createElement("ion-item");
        locationItem.setAttribute("key", crypto.randomUUID());
        locationItem.setAttribute("lines", "none");
        var locationRadio = document.createElement("ion-radio");
        locationRadio.setAttribute("value", locationRadioValue);
        locationRadio.setAttribute("key", crypto.randomUUID());
        // if exists, add the room name, campus, building and floor to the object in the selection list
        if (
          value.room_id != "" ||
          value.campus_id != "" ||
          value.building_id != "" ||
          value.floor_nr != null
        ) {
          var selectedLocationRoom = document.createElement("ion-label");
          var innerHTMLString = "";
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
          var selectedLocationAddress = document.createElement("ion-label");
          selectedLocationAddress.innerHTML = value.address_string;
          selectedLocationAddress.setAttribute("class", "ion-text-wrap");
          locationRadio.appendChild(selectedLocationAddress);
        }
        // if exists, add the coordinates to the object in the selection list
        if (value.lat != null && value.lon != null) {
          var selectedLocationCoord = document.createElement("ion-label");
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
      var locationChanges = event as CustomEvent;
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
    var dialogCreateLocation = document.getElementById(
      "dialogCreateLocation"
    ) as HTMLIonModalElement;
    dialogCreateLocation.dismiss();
    // update of the listing (locations)
    getLocationsFromFilter();
  };

  // closing the dialog (modal) to select locations
  const closeDialogSelectLocation = () => {
    var dialogSelectLocation = document.getElementById(
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
      locationButton.setAttribute(
        "id",
        JSON.stringify(selectedLocationDictionary)
      );
      locationButton.setAttribute("class", "locationContainerButton");
      locationButton.setAttribute("color", "medium");
      // add a function to delete the location
      locationButton.addEventListener("click", (event: any) => {
        locationContainerDiv.innerHTML = "";
        setSelectedLocationDictionary({});
      });
      const locationButtonLabel = document.createElement("ion-label");
      locationButtonLabel.classList.add(
        "locationContainerButtonLabels",
        "ion-text-wrap"
      );
      var innerHTMLString = "";
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
              String(
                Math.round(selectedLocationDictionary.lat * 100000) / 100000
              ) +
              " / " +
              String(
                Math.round(selectedLocationDictionary.lon * 100000) / 100000
              );
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
            String(
              Math.round(selectedLocationDictionary.lat * 100000) / 100000
            ) +
            " / " +
            String(
              Math.round(selectedLocationDictionary.lon * 100000) / 100000
            );
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
      (location: {
        building_id: string;
        address_string: string;
        campus_id: string;
      }) => ({
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
    var allBuildings = buildingsDBClear.concat(temporaryBuildingList);
    // sort the building list
    allBuildings.sort((a: any, b: any) => {
      let buildingA = a.building_id.toUpperCase(); // not case sensitive
      let buildingB = b.building_id.toUpperCase(); // not case sensitive
      if (buildingA < buildingB) {
        return -1;
      } else if (buildingA > buildingB) {
        return 1;
      } else {
        return 0;
      } // same room
    });
    // temporary storage of the current selection for subsequent editing
    var selectedBuildingDictValue = selectedBuildingDictionary;
    // clearing the current display
    var buildingFilteredList = document.getElementById(
      "listFilteredBuildings"
    )!;
    buildingFilteredList.innerHTML = "";
    // create the radio group element
    var buildingRadioGroup = document.createElement("ion-radio-group");
    buildingRadioGroup.setAttribute(
      "value",
      JSON.stringify(selectedBuildingDictValue)
    );
    // create dummy element (no selection)
    var buildingItemDummy = document.createElement("ion-item");
    buildingItemDummy.setAttribute("key", crypto.randomUUID());
    buildingItemDummy.setAttribute("lines", "none");
    var buildingRadioDummy = document.createElement("ion-radio");
    buildingRadioDummy.setAttribute("value", "{}");
    buildingRadioDummy.setAttribute("key", crypto.randomUUID());
    var buildingRadioDummyLabel = document.createElement("ion-label");
    buildingRadioDummyLabel.innerHTML = "keine Auswahl";
    buildingRadioDummyLabel.style.fontWeight = "bold";
    buildingRadioDummy.appendChild(buildingRadioDummyLabel);
    buildingItemDummy.appendChild(buildingRadioDummy);
    buildingRadioGroup.appendChild(buildingItemDummy);
    // iteration through all existing (db / user) buildings
    let i = 0;
    while (i < allBuildings.length) {
      var value: { [key: string]: any } = allBuildings[i];
      // list of all elements corresponding to the filter
      if (value.building_id.startsWith(filterBuildingString)) {
        // create all elements
        var buildingRadioValue = JSON.stringify(value);
        var buildingItem = document.createElement("ion-item");
        buildingItem.setAttribute("key", crypto.randomUUID());
        buildingItem.setAttribute("lines", "none");
        var buildingRadio = document.createElement("ion-radio");
        buildingRadio.setAttribute("value", buildingRadioValue);
        buildingRadio.setAttribute("key", crypto.randomUUID());
        // if exists, add the building name, address, and campus to the object in the selection list
        if (value.building_id != "" || value.campus_id != "") {
          var selectedBuildingName = document.createElement("ion-label");
          var innerHTMLString = "";
          if (value.building_id != "") {
            innerHTMLString +=
              '<span style="font-weight: bold">' +
              value.building_id +
              "</span> ";
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
          var selectedBuildingAddress = document.createElement("ion-label");
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
      var buildingChanges = event as CustomEvent;
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
      newLocationDictValue.address_string =
        selectedBuildingDictionary.address_string;
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
    var dialogCreateBuilding = document.getElementById(
      "dialogCreateBuilding"
    ) as HTMLIonModalElement;
    dialogCreateBuilding.dismiss();
    // update of the listing (locations)
    getBuildingsFromFilter();
  };

  // closing the dialog (modal) to select locations
  const closeDialogSelectBuilding = () => {
    var dialogSelectBuilding = document.getElementById(
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
      buildingButton.setAttribute(
        "id",
        JSON.stringify(selectedBuildingDictionary)
      );
      buildingButton.setAttribute("class", "buildingContainerButton");
      buildingButton.setAttribute("color", "medium");
      // add a function to delete the building
      buildingButton.addEventListener("click", (event: any) => {
        buildingContainerDiv.innerHTML = "";
        setSelectedBuildingDictionary({});
      });
      const buildingButtonLabel = document.createElement("ion-label");
      buildingButtonLabel.classList.add(
        "buildingContainerButtonLabels",
        "ion-text-wrap"
      );
      var innerHTMLString = "";
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
    if (
      !Number.isNaN(newPositionLatitude) &&
      !Number.isNaN(newPositionLongitude)
    ) {
      // save the coordinates in the new location

      // get container for displaying selection
      const locationContainerDiv =
        document.getElementById("positionContainer")!;
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
      locationButtonLabel.classList.add(
        "positionContainerButtonLabels",
        "ion-text-wrap"
      );
      var innerHTMLString =
        newPositionLatitude.toFixed(5) +
        " / " +
        newPositionLongitude.toFixed(5);
      locationButtonLabel.innerHTML = innerHTMLString;
      const locationButtonIcon = document.createElement("ion-icon");
      locationButtonIcon.setAttribute("icon", trashOutline);
      positionButton.appendChild(locationButtonLabel);
      positionButton.appendChild(locationButtonIcon);
      locationContainerDiv.appendChild(positionButton);
    }
    // close modal
    {
      (
        document.getElementById("dialogSelectPosition")! as HTMLIonModalElement
      ).dismiss();
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
      (
        document.getElementById("dialogSelectPosition")! as HTMLIonModalElement
      ).dismiss();
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

  // functions (pipelines) for the group
  // ------------------------------------------------------------------------------------------

  // get all unique groups that occur in the database
  const getGroupsFromDB = () => {
    if (!anchors) return [];
    const uniqueGroups = new Set();
    anchors.forEach((anchor) => {
      if (anchor && anchor.group_id) {
        uniqueGroups.add(anchor.group_id);
      }
    });
    return Array.from(uniqueGroups);
  };

  // update of the list of groups (groups from database and temporarily created by user)
  const getGroupsFromFilter = () => {
    // groups from db
    const groupsDB = getGroupsFromDB();
    // combination of all groups and sorted
    const allGroups = groupsDB.concat(temporaryGroupList).sort();
    // temporary storage of the current selection for subsequent editing
    var selectedGroupStringValue = selectedGroupString;
    // clearing the current display
    var groupFilteredList = document.getElementById("listFilteredGroups")!;
    groupFilteredList.innerHTML = "";
    // create the radio group element
    var groupRadioGroup = document.createElement("ion-radio-group");
    groupRadioGroup.setAttribute("value", selectedGroupStringValue);
    // create dummy element (no selection)
    var groupItemDummy = document.createElement("ion-item");
    groupItemDummy.setAttribute("key", crypto.randomUUID());
    groupItemDummy.setAttribute("lines", "none");
    var groupRadioDummy = document.createElement("ion-radio");
    groupRadioDummy.setAttribute("value", "");
    groupRadioDummy.setAttribute("key", crypto.randomUUID());
    var groupRadioDummyLabel = document.createElement("ion-label");
    groupRadioDummyLabel.innerHTML = "keine Auswahl";
    groupRadioDummyLabel.style.fontWeight = "bold";
    groupRadioDummy.appendChild(groupRadioDummyLabel);
    groupItemDummy.appendChild(groupRadioDummy);
    groupRadioGroup.appendChild(groupItemDummy);
    // iteration through all existing (db / user) groups
    let i = 0;
    while (i < allGroups.length) {
      const value: any = allGroups[i];
      // list of all elements corresponding to the filter
      if (value.startsWith(filterGroupString)) {
        // create all elements
        var groupCheckBoxValue = value;
        var groupItem = document.createElement("ion-item");
        groupItem.setAttribute("key", crypto.randomUUID());
        groupItem.setAttribute("lines", "none");
        var groupRadio = document.createElement("ion-radio");
        groupRadio.setAttribute("value", groupCheckBoxValue);
        groupRadio.setAttribute("key", crypto.randomUUID());
        var groupRadioLabel = document.createElement("ino-label");
        groupRadioLabel.innerHTML = value;
        groupRadioLabel.setAttribute("class", "ion-text-wrap");
        groupRadio.append(groupRadioLabel);
        groupItem.append(groupRadio);
        // add the item (group) to the group
        groupRadioGroup.append(groupItem);
      }
      i++;
    }
    // add event listener to the radio group
    // as soon as a radio is clicked, the string of the selected group is adjusted
    groupRadioGroup.addEventListener("ionChange", function (event) {
      var groupChanges = event as CustomEvent;
      if (groupChanges.detail.value != "") {
        setSelectedGroupString(groupChanges.detail.value);
      } else {
        // no selection
        setSelectedGroupString("");
      }
    });
    // add the item (group) to the display
    groupFilteredList.appendChild(groupRadioGroup);
  };

  // whenever the filter (search) is changed, the listing is updated
  useEffect(() => {
    // check if list is displayed
    if (document.getElementById("listFilteredGroups") != null) {
      getGroupsFromFilter();
    }
  }, [filterGroupString, selectedGroupString]);

  // update the filter string (search) by event (input)
  function updateGroupFilter(event: CustomEvent) {
    setFilterGroupString(event.detail.value);
  }

  // whenever the release of an individual group changes check the validity
  useEffect(() => {
    // error if group exists or no input
    if (
      getGroupsFromDB().includes(newGroupString) ||
      temporaryGroupList.includes(newGroupString) ||
      newGroupString == ""
    ) {
      setNewGroupError(true);
    } else {
      setNewGroupError(false);
    }
  }, [newGroupString]);

  // update the group string by event (input)
  const readNewGroupInput = (event: CustomEvent) => {
    setNewGroupString(event.detail.value);
  };

  // create a new temporary group (only for user, until save on database)
  const createNewTempGroup = () => {
    if (newGroupString != "") {
      if (
        getGroupsFromDB().includes(newGroupString) ||
        temporaryGroupList.includes(newGroupString)
      ) {
      } else {
        const temporaryGroupListValue = temporaryGroupList;
        temporaryGroupListValue.push(newGroupString);
        setTemporaryGroupList(temporaryGroupListValue);
        closeDialogCreateGroup();
      }
    }
    setShowToastCreateGroup(true);
  };

  // closing the dialog (modal) to enter a new group
  const closeDialogCreateGroup = () => {
    var dialogCreateGroup = document.getElementById(
      "dialogCreateGroup"
    ) as HTMLIonModalElement;
    dialogCreateGroup.dismiss();
    // update of the listing (groups)
    getGroupsFromFilter();
  };

  // closing the dialog (modal) to select groups
  const closeDialogSelectGroup = () => {
    var dialogSelectGroup = document.getElementById(
      "dialogSelectGroup"
    ) as HTMLIonModalElement;
    dialogSelectGroup.dismiss();
  };

  // updating the button for selecting groups (text display including the selected groups)
  const updateGroupsInput = () => {
    // reset filter string (groups)
    setFilterGroupString("");
    // clearing the current display
    const groupContainerDiv = document.getElementById("groupContainer")!;
    groupContainerDiv.innerHTML = "";
    if (selectedGroupString == "") {
      // nothing to do
    } else {
      // create a new element for the selected group
      const groupButton = document.createElement("ion-button");
      groupButton.setAttribute("id", selectedGroupString);
      groupButton.setAttribute("class", "groupContainerButton");
      groupButton.setAttribute("color", "medium");
      // add a function to delete the group
      groupButton.addEventListener("click", (event: any) => {
        groupContainerDiv.innerHTML = "";
        setSelectedGroupString("");
      });
      const groupButtonLabel = document.createElement("ion-label");
      groupButtonLabel.classList.add(
        "groupContainerButtonLabels",
        "ion-text-wrap"
      );
      groupButtonLabel.innerHTML = selectedGroupString;
      const groupButtonIcon = document.createElement("ion-icon");
      groupButtonIcon.setAttribute("icon", trashOutline);
      groupButton.appendChild(groupButtonLabel);
      groupButton.appendChild(groupButtonIcon);
      groupContainerDiv.appendChild(groupButton);
    }
  };

  // save changes in the temporary anchor for forwarding to the database
  useEffect(() => {
    setLocalAnchor({
      ...localAnchor,
      group_id: selectedGroupString != "" ? selectedGroupString : undefined,
    });
  }, [selectedGroupString]);

  // functions (pipelines) for the documents
  // ------------------------------------------------------------------------------------------

  // function for updating the selected documents (adding documents)
  function updateSelectedFileList(event: BaseSyntheticEvent) {
    if (typeof event.target.files[0] !== "undefined") {
      // iterate through list to get a new reference, otherwise useEffect is not triggered
      const selectedFileListValue = [];
      let i = 0;
      while (i < selectedFileList.length) {
        selectedFileListValue.push(selectedFileList[i]);
        i++;
      }
      selectedFileListValue.push(event.target.files[0].name);
      setSelectedFileList(selectedFileListValue);
    }
  }

  // updating the display of the selected elements
  useEffect(() => {
    // clearing the current display
    const documentContainerDiv = document.getElementById("documentContainer")!;
    documentContainerDiv.innerHTML = "";
    // iteration through all appended documents
    let i = 0;
    while (i < selectedFileList.length) {
      // create all elements
      const documentButton = document.createElement("ion-button");
      documentButton.setAttribute("id", selectedFileList[i]);
      documentButton.setAttribute("class", "documentContainerButton");
      documentButton.setAttribute("color", "medium");
      // add a function to delete documents
      documentButton.addEventListener("click", (event: any) => {
        const targetButton = event.currentTarget as HTMLElement;
        const targetDocument = targetButton.getAttribute("id");
        // iterate through list and remove deleted elements
        const selectedFileListValue = [];
        let j = 0;
        while (j < selectedFileList.length) {
          if (selectedFileList[j] != targetDocument) {
            selectedFileListValue.push(selectedFileList[j]);
          }
          j++;
        }
        setSelectedFileList(selectedFileListValue);
      });
      const documentButtonLabel = document.createElement("ion-label");
      documentButtonLabel.classList.add(
        "documentContainerButtonLabels",
        "ion-text-wrap"
      );
      documentButtonLabel.innerHTML = selectedFileList[i];
      const documentButtonIcon = document.createElement("ion-icon");
      documentButtonIcon.setAttribute("icon", trashOutline);
      documentButton.appendChild(documentButtonLabel);
      documentButton.appendChild(documentButtonIcon);
      documentContainerDiv.appendChild(documentButton);
      i++;
    }
    // save changes in the temporary anchor for forwarding to the database
    setLocalAnchor({
      ...localAnchor,
      attachments: selectedFileList.length > 0 ? selectedFileList : undefined,
    });
  }, [selectedFileList]);

  // HTML output
  // ------------------------------------------------------------------------------------------
  return (
    <IonPage>
      <StatusHeader titleText="Erstellen" />
      <IonContent className="ion-padding" fullscreen>
        {/* part for entering the name */}
        {createInputs(localAnchor, setLocalAnchor, configTitle)}

        {/* part for entering the description */}
        {createTextarea(localAnchor, setLocalAnchor, configDescription)}

        {/* part for the selection of tags */}
        <IonButton
          id="openDialogSelectTag"
          expand="block"
          color="light"
          fill="solid"
          size="default"
        >
          <div>
            <IonLabel id="openDialogSelectTagLabel" class="ion-text-wrap">
              Tags
            </IonLabel>
            <IonIcon
              icon={addCircleOutline}
              size="large"
              aria-hidden="true"
            ></IonIcon>
          </div>
        </IonButton>
        <div id="tagContainer">{/* container for showing the selection */}</div>
        {/* overlay (modal) for the selection of tags */}
        <IonModal
          id="dialogSelectTag"
          trigger="openDialogSelectTag"
          onDidPresent={getTagsFromFilter}
          onDidDismiss={updateTagInput}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Tags auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={closeDialogSelectTag}>
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
            <IonSearchbar
              onIonInput={updateTagFilter}
              color="light"
              id="tagSearchBar"
            ></IonSearchbar>
          </IonHeader>
          <IonContent>
            <IonInfiniteScroll>
              <IonList id="listFilteredTags"></IonList>
            </IonInfiniteScroll>
          </IonContent>
          <IonFooter>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    id="openDialogCreateTag"
                    expand="full"
                    color="primary"
                  >
                    Neues Tag
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton
                    onClick={closeDialogSelectTag}
                    id="cancelSelectTag"
                    expand="full"
                    color="primary"
                  >
                    Speichern
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
            {/* overlay (modal) for the creation of tags */}
            <IonModal id="dialogCreateTag" trigger="openDialogCreateTag">
              <IonHeader>
                <IonToolbar>
                  <IonTitle slot="start">Tag erstellen</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={closeDialogCreateTag}>
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
                        onIonInput={readNewTagInput}
                        color="dark"
                        labelPlacement="stacked"
                        type="text"
                        fill="outline"
                        style={{ margin: "16px 0 16px 0" }}
                        placeholder="Tag"
                      >
                        <div slot="label">
                          Tag <IonText color="danger"> (Pflichtfeld) </IonText>
                        </div>
                      </IonInput>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonContent>
              <IonFooter>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton
                        onClick={closeDialogCreateTag}
                        id="cancelTempTag"
                        expand="full"
                        color="primary"
                      >
                        Abbrechen
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton
                        onClick={createNewTempTag}
                        id="saveTempTag"
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

        {/* part for entering date */}
        <IonItem
          lines="none"
          id="useDateToggle"
          style={{ margin: "16px 0 0 0" }}
        >
          <IonToggle onIonChange={addDate} labelPlacement="start">
            Termin
          </IonToggle>
        </IonItem>
        <div id="dateContainer">
          <IonItem lines="none">
            <IonLabel>Start</IonLabel>
            <IonDatetimeButton datetime="starttime">
              {anchorStartDate === "" && (
                <IonLabel slot="date-target">Datum</IonLabel>
              )}
              {anchorStartDate === "" && (
                <IonLabel slot="time-target">Zeit</IonLabel>
              )}
            </IonDatetimeButton>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>Ende</IonLabel>
            <IonDatetimeButton datetime="endtime">
              {anchorEndDate === "" && (
                <IonLabel slot="date-target">Datum</IonLabel>
              )}
              {anchorEndDate === "" && (
                <IonLabel slot="time-target">Zeit</IonLabel>
              )}
            </IonDatetimeButton>
          </IonItem>
          <IonModal keepContentsMounted={true} id="dialogSelectDateStart">
            <IonHeader>
              <IonToolbar>
                <IonTitle slot="start">Startzeit auswählen</IonTitle>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() =>
                      (
                        document.getElementById(
                          "dialogSelectDateStart"
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
              max={anchorEndDate}
              id="starttime"
              onIonChange={(e) => updateStartTimeInput(e)}
            ></IonDatetime>
            <IonFooter class="ion-padding">
              <IonButton
                onClick={() => {
                  (
                    document.getElementById(
                      "dialogSelectDateStart"
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
          <IonModal keepContentsMounted={true} id="dialogSelectDateEnd">
            <IonHeader>
              <IonToolbar>
                <IonTitle slot="start">Endzeit auswählen</IonTitle>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() =>
                      (
                        document.getElementById(
                          "dialogSelectDateEnd"
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
              min={anchorStartDate}
              id="endtime"
              onIonChange={(e) => updateEndTimeInput(e)}
            ></IonDatetime>
            <IonFooter class="ion-padding">
              <IonButton
                onClick={() => {
                  (
                    document.getElementById(
                      "dialogSelectDateEnd"
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
        </div>

        {/* part for entering the validity */}
        <IonItem
          lines="none"
          id="useValidToggle"
          style={{ margin: "16px 0 0 0" }}
        >
          <IonToggle onIonChange={addValid} labelPlacement="start">
            Gültigkeit
          </IonToggle>
        </IonItem>
        <div id="validContainer">
          <IonItem lines="none">
            <IonLabel>Start</IonLabel>
            <IonDatetimeButton datetime="starttimevalid">
              {anchorStartValid === "" && (
                <IonLabel slot="date-target">Datum</IonLabel>
              )}
              {anchorStartValid === "" && (
                <IonLabel slot="time-target">Zeit</IonLabel>
              )}
            </IonDatetimeButton>
          </IonItem>
          <IonItem lines="none">
            <IonLabel>Ende</IonLabel>
            <IonDatetimeButton datetime="endtimevalid">
              {anchorEndValid === "" && (
                <IonLabel slot="date-target">Datum</IonLabel>
              )}
              {anchorEndValid === "" && (
                <IonLabel slot="time-target">Zeit</IonLabel>
              )}
            </IonDatetimeButton>
          </IonItem>
          <IonModal keepContentsMounted={true} id="dialogSelectValidStart">
            <IonHeader>
              <IonToolbar>
                <IonTitle slot="start">Startzeit auswählen</IonTitle>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() =>
                      (
                        document.getElementById(
                          "dialogSelectValidStart"
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
              max={anchorEndValid}
              id="starttimevalid"
              onIonChange={(e) => updateStartValidInput(e)}
            ></IonDatetime>
            <IonFooter class="ion-padding">
              <IonButton
                onClick={() => {
                  (
                    document.getElementById(
                      "dialogSelectValidStart"
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
          <IonModal keepContentsMounted={true} id="dialogSelectValidEnd">
            <IonHeader>
              <IonToolbar>
                <IonTitle slot="start">Endzeit auswählen</IonTitle>
                <IonButtons slot="end">
                  <IonButton
                    onClick={() =>
                      (
                        document.getElementById(
                          "dialogSelectValidEnd"
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
              min={anchorStartValid}
              id="endtimevalid"
              onIonChange={(e) => updateEndValidInput(e)}
            ></IonDatetime>
            <IonFooter class="ion-padding">
              <IonButton
                onClick={() => {
                  (
                    document.getElementById(
                      "dialogSelectValidEnd"
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
        </div>

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
            <IonIcon
              icon={addCircleOutline}
              size="large"
              aria-hidden="true"
            ></IonIcon>
          </div>
        </IonButton>
        <div id="locationContainer">
          {/* container for showing the selection */}
        </div>
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
            <IonModal
              id="dialogCreateLocation"
              trigger="openDialogCreateLocation"
            >
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
                              <IonButton
                                onClick={() => closeLocationSelectionMap()}
                              >
                                <IonIcon
                                  icon={closeOutline}
                                  size="large"
                                ></IonIcon>
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
                                <IonIcon
                                  icon={closeOutline}
                                  size="large"
                                ></IonIcon>
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
                                <IonTitle slot="start">
                                  Gebäude erstellen
                                </IonTitle>
                                <IonButtons slot="end">
                                  <IonButton
                                    onClick={closeDialogCreateBuilding}
                                  >
                                    <IonIcon
                                      icon={closeOutline}
                                      size="large"
                                    ></IonIcon>
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

        {/* part for the selection of a group */}
        <IonButton
          id="openDialogSelectGroup"
          expand="block"
          color="light"
          fill="solid"
          size="default"
        >
          <div>
            <IonLabel id="openDialogSelectGroupLabel" class="ion-text-wrap">
              Gruppe
            </IonLabel>
            <IonIcon
              icon={addCircleOutline}
              size="large"
              aria-hidden="true"
            ></IonIcon>
          </div>
        </IonButton>
        <div id="groupContainer">
          {/* container for showing the selection */}
        </div>
        {/* overlay (modal) for the selection of a group */}
        <IonModal
          id="dialogSelectGroup"
          trigger="openDialogSelectGroup"
          onDidPresent={getGroupsFromFilter}
          onDidDismiss={updateGroupsInput}
        >
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Gruppe auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={closeDialogSelectGroup}>
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
            <IonSearchbar
              onIonInput={updateGroupFilter}
              color="light"
              id="groupSearchBar"
            ></IonSearchbar>
          </IonHeader>
          <IonContent>
            <IonInfiniteScroll>
              <IonList id="listFilteredGroups"></IonList>
            </IonInfiniteScroll>
          </IonContent>
          <IonFooter>
            <IonGrid>
              <IonRow>
                <IonCol>
                  <IonButton
                    id="openDialogCreateGroup"
                    expand="full"
                    color="primary"
                  >
                    Neue Gruppe
                  </IonButton>
                </IonCol>
                <IonCol>
                  <IonButton
                    onClick={closeDialogSelectGroup}
                    id="cancelSelectGroup"
                    expand="full"
                    color="primary"
                  >
                    Speichern
                  </IonButton>
                </IonCol>
              </IonRow>
            </IonGrid>
            {/* overlay (modal) for the creation of groups */}
            <IonModal id="dialogCreateGroup" trigger="openDialogCreateGroup">
              <IonHeader>
                <IonToolbar>
                  <IonTitle slot="start">Gruppe erstellen</IonTitle>
                  <IonButtons slot="end">
                    <IonButton onClick={closeDialogCreateGroup}>
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
                        onIonInput={readNewGroupInput}
                        color="dark"
                        labelPlacement="stacked"
                        type="text"
                        fill="outline"
                        style={{ margin: "16px 0 16px 0" }}
                        placeholder="Gruppe"
                      >
                        <div slot="label">
                          Gruppe{" "}
                          <IonText color="danger"> (Pflichtfeld) </IonText>
                        </div>
                      </IonInput>
                    </IonCol>
                  </IonRow>
                </IonGrid>
              </IonContent>
              <IonFooter>
                <IonGrid>
                  <IonRow>
                    <IonCol>
                      <IonButton
                        onClick={closeDialogCreateGroup}
                        id="cancelTempGroup"
                        expand="full"
                        color="primary"
                      >
                        Abbrechen
                      </IonButton>
                    </IonCol>
                    <IonCol>
                      <IonButton
                        onClick={createNewTempGroup}
                        id="saveTempGroup"
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

        {/* part for the selection of documents */}
        <input
          ref={fileInput}
          accept="*/*"
          hidden
          type="file"
          onChange={(e) => updateSelectedFileList(e)} // onSelectFile
          onClick={(e: BaseSyntheticEvent) => {
            // value reset to enable successive selection of the same element
            e.target!.value = null;
          }}
        />
        <IonButton
          id="openDialogSelectDocument"
          expand="block"
          color="light"
          fill="solid"
          size="default"
          onClick={() => {
            // @ts-ignore
            fileInput?.current?.click();
          }}
        >
          <div>
            <IonLabel id="openDialogSelectDocumentLabel" class="ion-text-wrap">
              Dokumente
            </IonLabel>
            <IonIcon
              icon={addCircleOutline}
              size="large"
              aria-hidden="true"
            ></IonIcon>
          </div>
        </IonButton>
        <div id="documentContainer">
          {/* container for showing the selection */}
        </div>
      </IonContent>

      <IonFooter
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <IonButton
          id="create-anchor"
          fill="solid"
          strong={true}
          onClick={handleSubmission}
          expand="block"
          style={{ padding: "4px" }}
        >
          Erstellen
        </IonButton>
        <IonToast
          style={{ height: 60 }}
          color={error ? "danger" : "success"}
          position="top"
          trigger="create-anchor"
          message={error ? "Überprüfe deine Eingabe" : "Anker wurde erstellt!"}
          duration={1200}
          icon={error ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast>

        {/* toast to report the success or failure for the creation of a new temporary tag */}
        <IonToast
          isOpen={showToastCreateTag}
          onDidDismiss={() => setShowToastCreateTag(false)}
          style={{ height: 80 }}
          color={newTagError ? "danger" : "success"}
          position="top"
          message={
            newTagError
              ? "Erstellung fehlgeschlagen! \nEingabe ungültig oder Tag bereits vorhanden."
              : "Tag erfolgreich erstellt"
          }
          duration={1200}
          icon={newTagError ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast>

        {/* toast to report the success or failure for the creation of a new temporary location */}
        <IonToast
          isOpen={showToastCreateLocation}
          onDidDismiss={() => setShowToastCreateLocation(false)}
          style={{ height: 80 }}
          color={newLocationError ? "danger" : "success"}
          position="top"
          message={
            newLocationError
              ? "Erstellung fehlgeschlagen! \nKeine Werte eingegeben."
              : "Ort erfolgreich erstellt"
          }
          duration={1200}
          icon={newLocationError ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast>

        {/* toast to report the success or failure for the creation of a new temporary building */}
        <IonToast
          isOpen={showToastCreateBuilding}
          onDidDismiss={() => setShowToastCreateBuilding(false)}
          style={{ height: 80 }}
          color={newBuildingError ? "danger" : "success"}
          position="top"
          message={
            newBuildingError
              ? "Erstellung fehlgeschlagen! \nKeine Werte eingegeben."
              : "Gebäude erfolgreich erstellt"
          }
          duration={1200}
          icon={newBuildingError ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast>

        {/* toast to report the success or failure for the creation of a new temporary group */}
        <IonToast
          isOpen={showToastCreateGroup}
          onDidDismiss={() => setShowToastCreateGroup(false)}
          style={{ height: 80 }}
          color={newGroupError ? "danger" : "success"}
          position="top"
          message={
            newGroupError
              ? "Erstellung fehlgeschlagen! \nEingabe ungültig oder Gruppe bereits vorhanden."
              : "Gruppe erfolgreich erstellt"
          }
          duration={1200}
          icon={newGroupError ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast>
      </IonFooter>
    </IonPage>
  );
};
