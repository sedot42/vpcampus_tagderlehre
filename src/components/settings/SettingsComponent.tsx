import { useState, useContext, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonLabel,
  IonButton,
  IonIcon,
  IonList,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSearchbar,
  IonInfiniteScroll,
  IonFooter,
  IonGrid,
  IonRow,
  IonCol,
  IonText,
  IonItem,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../context";
import { addCircleOutline, closeOutline, informationCircleOutline, trashOutline } from "ionicons/icons";

type SettingsProps = undefined;

export const SettingsComponent = () => {

  // anchors from the server (database)
  const { anchors } = useContext(AnchorContext);

  // functional components for the selection of tags (filter)
  const [filterStringTag, setFilterStringTag] = useState<string>("");                               // string to filter the tags
  const storedTags = localStorage.getItem('campus_v_p_selTags');                                    // load settings from local storage
  const storedTagsParsed = storedTags ? JSON.parse(storedTags) : [];
  const [listSelectedTag, setListSelectedTag] = useState<string[]>(storedTagsParsed);               // list of all selected tags
  const [timeChangeTagSelection, setTimeChangeTagSelection] = useState<number>(Date.now());         // changetime to detect all changes (useEffect)

  // functional components for the selection of groups (filter)
  const [filterStringGroup, setFilterStringGroup] = useState<string>("");                           // string to filter the groups
  const storedGroups = localStorage.getItem('campus_v_p_selGroups');                                // load settings from local storage
  const storedGroupsParsed = storedGroups ? JSON.parse(storedGroups) : [];
  const [listSelectedGroups, setListSelectedGroups] = useState<string[]>(storedGroupsParsed);       // list of all selected groups
  const [timeChangeGroupSelection, setTimeChangeGroupSelection] = useState<number>(Date.now());     // changetime to detect all changes (useEffect)


  // functions (pipelines) for the tag selection
  // ------------------------------------------------------------------------------------------

  // get a list with the unique tags from the server
  const getUniqueTagsFromServer = () => {
    if (!anchors) return;
    const uniqueTags = new Set();
    anchors.forEach(anchor => {
      if (anchor && anchor.tags) {
        anchor.tags.forEach(tag => {
          if (tag) uniqueTags.add(tag);
        });
      }
    });
    return Array.from(uniqueTags);
  };

  // filter the tags with the search string for display
  const getFilteredTags = () => {
    const tagsDB = getUniqueTagsFromServer()?.sort();
    var filteredTags: string[] = [];
    if (tagsDB) {
      for (const element of tagsDB) {
        // check whether the element is a string
        if (typeof element === 'string' && element.startsWith(filterStringTag)) {
          filteredTags.push(element);
        };
      };
    };
    return filteredTags;
  };

  // show the filtered tags on the selection list
  const showTagsOnSelection = () => {
    const filteredTagsDB = getFilteredTags();
    // temporary storage of the current selection for subsequent editing
    var listSelectedTagValue = [...listSelectedTag];
    // clearing the current display
    var tagFilteredList = document.getElementById("listAllFilteredTags")!;
    tagFilteredList.innerHTML = "";
    if (filteredTagsDB) {
      for (const element of filteredTagsDB) {
        var tagItem = document.createElement("ion-item");
        tagItem.setAttribute("key", crypto.randomUUID());
        tagItem.setAttribute("lines", "none");
        var tagCheckbox = document.createElement("ion-checkbox");
        tagCheckbox.setAttribute("value", element);
        tagCheckbox.setAttribute("key", crypto.randomUUID());
        if (listSelectedTagValue.includes(element)) {
          tagCheckbox.setAttribute("checked", "true")
        };
        // as soon as a checkbox is clicked, the list of selected tags is adjusted
        tagCheckbox.addEventListener("ionChange", function(event) {
          var tagChanges = (event as CustomEvent);
          // new selection -> add to list
          if (tagChanges.detail.checked == true) {
            listSelectedTagValue.push(tagChanges.detail.value);
            setListSelectedTag(listSelectedTagValue);
            setTimeChangeTagSelection(Date.now());
          }
          // omitted selection -> remove from list
          else {
            const index = listSelectedTagValue.indexOf(tagChanges.detail.value);
            if (index > -1) {                           // only splice array when item is found
              listSelectedTagValue.splice(index, 1);    // 2nd parameter means remove one item only
            };
            setListSelectedTag(listSelectedTagValue);
            setTimeChangeTagSelection(Date.now());
          };
        });
        tagCheckbox.innerHTML = element;
        tagItem.appendChild(tagCheckbox);
        // add the item (tag) to the display
        tagFilteredList.appendChild(tagItem);
      };
    };
  };

  // whenever the filter (search) is changed, the listing is updated
  useEffect(() => {
    // check if list is displayed
    if (document.getElementById("listAllFilteredTags") != null) {
      showTagsOnSelection();
    };
  }, [filterStringTag]);

  // update the filter string (search) by event (input)
  function updateFilterTag(event: CustomEvent) {
    setFilterStringTag(event.detail.value);
  };

  // closing the dialog (modal) to select tags
  const closeDialogSelectTags = () => {
    var dialogSelectTag = document.getElementById("dialogSelectTags") as HTMLIonModalElement;
    dialogSelectTag.dismiss();
  };

  // updating the function for selecting tags
  const updateTagSelectionInput = (modalClose = false) => {
    // reset filter string (tag)
    if (modalClose == true) {
      setFilterStringTag("");
    };
    // temporary storage of the current selection for subsequent editing
    var listSelectedTagValue = [...listSelectedTag];
    // clearing the current display
    const selTagContainerDiv = document.getElementById("selectedTagContainer")!;
    selTagContainerDiv.innerHTML = "";
    if (listSelectedTagValue.length == 0) {
      //nothing to do
    }
    else {    
      // iteration through all selected tags
      for (const element of listSelectedTagValue) {
        const tagButton = document.createElement("ion-button");
        tagButton.setAttribute("id", element);
        tagButton.setAttribute("class", "tagContainerButton");
        tagButton.setAttribute("color", "medium")
        // add a function to delete tag
        tagButton.addEventListener("click", (event: any) => {
          const targetButton = event.currentTarget as HTMLElement;
          const targetTag = targetButton.getAttribute("id");
          // iterate through list and remove deleted elements
          const selectedTagListValue = [];
          for (const selElement of listSelectedTagValue) {
            if (selElement != targetTag) {
              selectedTagListValue.push(selElement);
            };
          };
          setListSelectedTag(selectedTagListValue);
          setTimeChangeTagSelection(Date.now())
        });
        const tagButtonLabel = document.createElement("ion-label");
        tagButtonLabel.classList.add("tagContainerButtonLabels", "ion-text-wrap")
        tagButtonLabel.innerHTML = element;
        const tagButtonIcon = document.createElement("ion-icon");
        tagButtonIcon.setAttribute("icon", trashOutline);
        tagButton.appendChild(tagButtonLabel);
        tagButton.appendChild(tagButtonIcon);
        selTagContainerDiv.appendChild(tagButton);
      };
    };
  };

  // update display of selected tags (e.g. by removing a tag from selection)
  // save selected tag list on local storage
  useEffect(() => {
    updateTagSelectionInput();
    // save on local storage
    localStorage.setItem('campus_v_p_selTags', JSON.stringify(listSelectedTag.sort()));
  }, [listSelectedTag, timeChangeTagSelection]);


  // functions (pipelines) for the group selection
  // ------------------------------------------------------------------------------------------
  
  // get a liist with the unique groups from the server
  const getUniqueGroupsFromServer = () => {
    if (!anchors) return;
    const uniqueGroups = new Set();
    anchors.forEach(anchor => {
      if (anchor && anchor.group_id) {
        uniqueGroups.add(anchor.group_id);
      }
    });
    return Array.from(uniqueGroups);
  };

  // filter the groups with the search string for display
  const getFilteredGroups = () => {
    const groupsDB = getUniqueGroupsFromServer()?.sort();
    var filteredGroups: string[] = [];
    if (groupsDB) {
      for (const element of groupsDB) {
        // check whether the element is a string
        if (typeof element === 'string' && element.startsWith(filterStringGroup)) {
          filteredGroups.push(element);
        };
      };
    };
    return filteredGroups;
  };

  // show the filtered groups on the selection list
  const showGroupsOnSelection = () => {
    const filteredGroupsDB = getFilteredGroups();
    // temporary storage of the current selection for subsequent editing
    var listSelectedGroupValue = [...listSelectedGroups];
    // clearing the current display
    var groupFilteredList = document.getElementById("listAllFilteredGroups")!;
    groupFilteredList.innerHTML = "";
    if (filteredGroupsDB) {
      for (const element of filteredGroupsDB) {
        var groupItem = document.createElement("ion-item");
        groupItem.setAttribute("key", crypto.randomUUID());
        groupItem.setAttribute("lines", "none");
        var groupCheckbox = document.createElement("ion-checkbox");
        groupCheckbox.setAttribute("value", element);
        groupCheckbox.setAttribute("key", crypto.randomUUID());
        if (listSelectedGroupValue.includes(element)) {
          groupCheckbox.setAttribute("checked", "true")
        };
        // as soon as a checkbox is clicked, the list of selected groups is adjusted
        groupCheckbox.addEventListener("ionChange", function(event) {
          var groupChanges = (event as CustomEvent);
          // new selection -> add to list
          if (groupChanges.detail.checked == true) {
            listSelectedGroupValue.push(groupChanges.detail.value);
            setListSelectedGroups(listSelectedGroupValue);
            setTimeChangeGroupSelection(Date.now());
          }
          // omitted selection -> remove from list
          else {
            const index = listSelectedGroupValue.indexOf(groupChanges.detail.value);
            if (index > -1) {                           // only splice array when item is found
              listSelectedGroupValue.splice(index, 1);    // 2nd parameter means remove one item only
            };
            setListSelectedGroups(listSelectedGroupValue);
            setTimeChangeGroupSelection(Date.now());
          };
        });
        groupCheckbox.innerHTML = element;
        groupItem.appendChild(groupCheckbox);
        // add the item (group) to the display
        groupFilteredList.appendChild(groupItem);
      };
    };
  };

  // whenever the filter (search) is changed, the listing is updated
  useEffect(() => {
    // check if list is displayed
    if (document.getElementById("listAllFilteredGroups") != null) {
      showGroupsOnSelection();
    };
  }, [filterStringGroup]);

  // update the filter string (search) by event (input)
  function updateFilterGroup(event: CustomEvent) {
    setFilterStringGroup(event.detail.value);
  };

  // closing the dialog (modal) to select groups
  const closeDialogSelectGroups = () => {
    var dialogSelectGroup = document.getElementById("dialogSelectGroups") as HTMLIonModalElement;
    dialogSelectGroup.dismiss();
  };
  
  // updating the function for selecting groups
  const updateGroupSelectionInput = (modalClose = false) => {
    // reset filter string (group)
    if (modalClose == true) {
      setFilterStringGroup("");
    };
    // temporary storage of the current selection for subsequent editing
    var listSelectedGroupValue = [...listSelectedGroups];
    // clearing the current display
    const selGroupsContainerDiv = document.getElementById("selectedGroupContainer")!;
    selGroupsContainerDiv.innerHTML = "";
    if (listSelectedGroupValue.length == 0) {
      //nothing to do
    }
    else {    
      // iteration through all selected groups
      for (const element of listSelectedGroupValue) {
        const groupButton = document.createElement("ion-button");
        groupButton.setAttribute("id", element);
        groupButton.setAttribute("class", "groupContainerButton");
        groupButton.setAttribute("color", "medium")
        // add a function to delete group
        groupButton.addEventListener("click", (event: any) => {
          const targetButton = event.currentTarget as HTMLElement;
          const targetGroup = targetButton.getAttribute("id");
          // iterate through list and remove deleted elements
          const selectedGroupListValue = [];
          for (const selElement of listSelectedGroupValue) {
            if (selElement != targetGroup) {
              selectedGroupListValue.push(selElement);
            };
          };
          setListSelectedGroups(selectedGroupListValue);
          setTimeChangeGroupSelection(Date.now())
        });
        const groupButtonLabel = document.createElement("ion-label");
        groupButtonLabel.classList.add("groupContainerButtonLabels", "ion-text-wrap")
        groupButtonLabel.innerHTML = element;
        const groupButtonIcon = document.createElement("ion-icon");
        groupButtonIcon.setAttribute("icon", trashOutline);
        groupButton.appendChild(groupButtonLabel);
        groupButton.appendChild(groupButtonIcon);
        selGroupsContainerDiv.appendChild(groupButton);
      };
    };
  };

  // update display of selected groups (e.g. by removing a group from selection)
  // save selected group list on local storage
  useEffect(() => {
    updateGroupSelectionInput();
    // save on local storage
    localStorage.setItem('campus_v_p_selGroups', JSON.stringify(listSelectedGroups.sort()));
  }, [listSelectedGroups, timeChangeGroupSelection]);


  // HTML output
  // ------------------------------------------------------------------------------------------
  return (
    <IonPage>
      <StatusHeader titleText="Optionen" />
      <IonContent className="ion-padding" fullscreen>

        {/* part for title and information */}
        <IonItem lines="none" style={{marginLeft: "-16px", marginRight: "-16px", "--background": "transparent"}}>
          <IonText class="ion-text-wrap"><h3>Filteroptionen für relevante Tags und Gruppen</h3></IonText>
          <IonButton id="openFilterInfo" slot="end" style={{"--box-shadow": "none", "--color": "#000000", "--background": "#ffffff"}}><IonIcon icon={informationCircleOutline} size="large"></IonIcon></IonButton>
        </IonItem>
        <IonModal id="dialogFilterInfo" trigger="openFilterInfo">
            <IonHeader>
              <IonToolbar>
                <IonTitle slot="start">Filteroptionen</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={() => {(document.getElementById('dialogFilterInfo')! as HTMLIonModalElement).dismiss()}}>
                    <IonIcon icon={closeOutline} size="large"></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
              <IonText>An dieser Stelle besteht die Möglichkeit, eine Auswahl relevanter Tags und Gruppen zu treffen. Die innerhalb der Applikation angezeigten Anker beschränken sich in diesem Fall auf die ausgewählten Gruppen und gewählten Stichworte. Liegt keine Auswahl vor, werden alle Anker angezeigt. </IonText>
            </IonContent>
            <IonFooter class="ion-padding">
              <IonButton onClick={() => {(document.getElementById('dialogFilterInfo')! as HTMLIonModalElement).dismiss()}} expand="full" color="primary">Ok</IonButton>
            </IonFooter>
        </IonModal>

        {/* part for the selection of tags */}
        <IonButton id="selectTagButton" className="buttonAddElements" expand="block" color="light" fill="solid" size="default">
          <div>
            <IonLabel id="selectTagButtonLabel" class="ion-text-wrap" className="buttonAddElementsLabel">Tags</IonLabel>
            <IonIcon icon={addCircleOutline} className="buttonAddElementsIcon" size="large" aria-hidden="true"></IonIcon>
          </div>
        </IonButton>
        <div id="selectedTagContainer">
          {/* container for showing the tag selection */}
        </div>
        {/* overlay (modal) for the selection of tags */}
        <IonModal id="dialogSelectTags" trigger="selectTagButton" onDidPresent={showTagsOnSelection} onDidDismiss={() => updateTagSelectionInput(true)}>
            <IonHeader>
              <IonToolbar>
                <IonTitle slot="start">Tags auswählen</IonTitle>
                <IonButtons slot="end">
                  <IonButton onClick={closeDialogSelectTags}>
                    <IonIcon icon={closeOutline} size="large"></IonIcon>
                  </IonButton>
                </IonButtons>
              </IonToolbar>
              <IonSearchbar onIonInput={updateFilterTag} color="light" id="tagSearchBar"></IonSearchbar>
            </IonHeader>
            <IonContent>
              <IonInfiniteScroll>
                <IonList id="listAllFilteredTags">
                </IonList>
              </IonInfiniteScroll>
            </IonContent>
            <IonFooter class="ion-padding">
              <IonButton onClick={closeDialogSelectTags} id="cancelSelectTag" expand="full" color="primary">Speichern</IonButton>
            </IonFooter>
        </IonModal>

        {/* part for the selection of groups */}
        <IonButton id="selectGroupButton" className="buttonAddElements" expand="block" color="light" fill="solid" size="default">
          <div>
            <IonLabel id="selectGroupButtonLabel" class="ion-text-wrap" className="buttonAddElementsLabel">Gruppen</IonLabel>
            <IonIcon icon={addCircleOutline} className="buttonAddElementsIcon" size="large" aria-hidden="true"></IonIcon>
          </div>
        </IonButton>
        <div id="selectedGroupContainer">
          {/* container for showing the group selection */}
        </div>
        {/* overlay (modal) for the selection of groups */}
        <IonModal id="dialogSelectGroups" trigger="selectGroupButton" onDidPresent={showGroupsOnSelection} onDidDismiss={() => updateGroupSelectionInput(true)}>
          <IonHeader>
            <IonToolbar>
              <IonTitle slot="start">Gruppen auswählen</IonTitle>
              <IonButtons slot="end">
                <IonButton onClick={closeDialogSelectGroups}>
                  <IonIcon icon={closeOutline} size="large"></IonIcon>
                </IonButton>
              </IonButtons>
            </IonToolbar>
            <IonSearchbar onIonInput={updateFilterGroup} color="light" id="groupSearchBar"></IonSearchbar>
          </IonHeader>
          <IonContent>
            <IonInfiniteScroll>
              <IonList id="listAllFilteredGroups">
              </IonList>
            </IonInfiniteScroll>
          </IonContent>
          <IonFooter class="ion-padding">
            <IonButton onClick={closeDialogSelectGroups} id="cancelSelectGroup" expand="full" color="primary">Speichern</IonButton>
          </IonFooter>
        </IonModal>

      </IonContent>
    </IonPage>
  );
};


