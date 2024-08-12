import { useState, useEffect } from "react";
import { addCircleOutline, trashOutline, closeOutline } from "ionicons/icons";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInfiniteScroll,
  IonInput,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

export const CreateGroupComponent = ({
  anchors,
  localAnchor,
  setLocalAnchor,
  setNewGroupError,
  setShowToastCreateGroup,
  temporaryGroupList,
  setTemporaryGroupList,
  selectedGroupString,
  setSelectedGroupString,
}) => {
  // functional components for the selection of group for an anchor
  const [filterGroupString, setFilterGroupString] = useState<string>(""); // string to filter the groups
  const [newGroupString, setNewGroupString] = useState<string>(""); // new group as string

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
    const selectedGroupStringValue = selectedGroupString;
    // clearing the current display
    const groupFilteredList = document.getElementById("listFilteredGroups")!;
    groupFilteredList.innerHTML = "";
    // create the radio group element
    const groupRadioGroup = document.createElement("ion-radio-group");
    groupRadioGroup.setAttribute("value", selectedGroupStringValue);
    // create dummy element (no selection)
    const groupItemDummy = document.createElement("ion-item");
    groupItemDummy.setAttribute("key", crypto.randomUUID());
    groupItemDummy.setAttribute("lines", "none");
    const groupRadioDummy = document.createElement("ion-radio");
    groupRadioDummy.setAttribute("value", "");
    groupRadioDummy.setAttribute("key", crypto.randomUUID());
    const groupRadioDummyLabel = document.createElement("ion-label");
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
        const groupCheckBoxValue = value;
        const groupItem = document.createElement("ion-item");
        groupItem.setAttribute("key", crypto.randomUUID());
        groupItem.setAttribute("lines", "none");
        const groupRadio = document.createElement("ion-radio");
        groupRadio.setAttribute("value", groupCheckBoxValue);
        groupRadio.setAttribute("key", crypto.randomUUID());
        const groupRadioLabel = document.createElement("ino-label");
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
      const groupChanges = event as CustomEvent;
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
    const dialogCreateGroup = document.getElementById(
      "dialogCreateGroup"
    ) as HTMLIonModalElement;
    dialogCreateGroup.dismiss();
    // update of the listing (groups)
    getGroupsFromFilter();
  };

  // closing the dialog (modal) to select groups
  const closeDialogSelectGroup = () => {
    const dialogSelectGroup = document.getElementById(
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
      groupButtonLabel.classList.add("groupContainerButtonLabels", "ion-text-wrap");
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

  return (
    <>
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
          <IonIcon icon={addCircleOutline} size="large" aria-hidden="true"></IonIcon>
        </div>
      </IonButton>
      <div id="groupContainer">{/* container for showing the selection */}</div>
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
                <IonButton id="openDialogCreateGroup" expand="full" color="primary">
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
                        Gruppe <IonText color="danger"> (Pflichtfeld) </IonText>
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
    </>
  );
};
