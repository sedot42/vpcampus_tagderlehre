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

export const CreateTagComponent = ({
  anchors,
  localAnchor,
  setLocalAnchor,
  setShowToastCreateTag,
  setNewTagError,
  selectedTagList,
  setSelectedTagList,
  temporaryTagList,
  setTemporaryTagList,
}) => {
  // functional components for the selection of tags for an anchor
  const [filterTagString, setFilterTagString] = useState(""); // string to filter the tags
  const [newTagString, setNewTagString] = useState<string>(""); // new tag as string

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
    const selectedTagListValue = selectedTagList;
    // clearing the current display
    const tagFilteredList = document.getElementById("listFilteredTags")!;
    tagFilteredList.innerHTML = "";
    // iteration through all existing (db / user) tags
    let i = 0;
    while (i < allTags.length) {
      const value: any = allTags[i];
      // list of all elements corresponding to the filter
      if (value.startsWith(filterTagString)) {
        // create all elements
        const tagCheckBoxValue = value;
        const tagItem = document.createElement("ion-item");
        tagItem.setAttribute("key", crypto.randomUUID());
        tagItem.setAttribute("lines", "none");
        const tagCheckbox = document.createElement("ion-checkbox");
        tagCheckbox.setAttribute("value", tagCheckBoxValue);
        tagCheckbox.setAttribute("key", crypto.randomUUID());
        // if the element is in the list of selected elements, the checkbox is set
        if (selectedTagListValue.includes(tagCheckBoxValue)) {
          tagCheckbox.setAttribute("checked", "true");
        }
        // as soon as a checkbox is clicked, the list of selected tags is adjusted
        tagCheckbox.addEventListener("ionChange", function (event) {
          const tagChanges = event as CustomEvent;
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
    const dialogCreateTag = document.getElementById(
      "dialogCreateTag"
    ) as HTMLIonModalElement;
    dialogCreateTag.dismiss();
    // update of the listing (tags)
    getTagsFromFilter();
  };

  // closing the dialog (modal) to select tags
  const closeDialogSelectTag = () => {
    const dialogSelectTag = document.getElementById(
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
        tagButtonLabel.classList.add("tagContainerButtonLabels", "ion-text-wrap");
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

  return (
    <>
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
          <IonIcon icon={addCircleOutline} size="large" aria-hidden="true"></IonIcon>
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
                <IonButton id="openDialogCreateTag" expand="full" color="primary">
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
    </>
  );
};
