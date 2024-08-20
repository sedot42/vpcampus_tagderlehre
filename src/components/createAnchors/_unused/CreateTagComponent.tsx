import React, { useState, useEffect } from "react";
import {
  IonButton,
  IonButtons,
  IonCol,
  IonContent,
  IonFooter,
  IonGrid,
  IonHeader,
  IonIcon,
  IonInput,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  IonItem,
  IonCheckbox,
} from "@ionic/react";
import { addCircleOutline, trashOutline, closeOutline } from "ionicons/icons";

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
  const [filterTagString, setFilterTagString] = useState("");
  const [newTagString, setNewTagString] = useState("");

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

  const allTags = [...new Set([...getTagsFromDB(), ...temporaryTagList])].sort();

  const filteredTags = allTags.filter((tag) =>
    tag.toLowerCase().includes(filterTagString.toLowerCase())
  );

  const handleCheckboxChange = (tag) => (event) => {
    const { checked } = event.detail;
    if (checked) {
      setSelectedTagList((prev) => [...prev, tag]);
    } else {
      setSelectedTagList((prev) => prev.filter((t) => t !== tag));
    }
    setLocalAnchor({
      ...localAnchor,
      tags: selectedTagList.length > 0 ? selectedTagList : undefined,
    });
  };

  const createNewTempTag = () => {
    if (
      newTagString &&
      !getTagsFromDB().includes(newTagString) &&
      !temporaryTagList.includes(newTagString)
    ) {
      setTemporaryTagList((prev) => [...prev, newTagString]);
      setSelectedTagList((prev) => [...prev, newTagString]);
      setLocalAnchor({
        ...localAnchor,
        tags: [...selectedTagList, newTagString],
      });
      setShowToastCreateTag(true);
      closeDialogCreateTag();
    }
  };

  const closeDialogCreateTag = () => {
    const dialogCreateTag = document.getElementById(
      "dialogCreateTag"
    ) as HTMLIonModalElement;
    dialogCreateTag.dismiss();
  };

  const closeDialogSelectTag = () => {
    const dialogSelectTag = document.getElementById(
      "dialogSelectTag"
    ) as HTMLIonModalElement;
    dialogSelectTag.dismiss();
  };

  useEffect(() => {
    setLocalAnchor({
      ...localAnchor,
      tags: selectedTagList.length > 0 ? selectedTagList : undefined,
    });
  }, [selectedTagList]);

  return (
    <>
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
      <div id="tagContainer">
        {selectedTagList.map((tag) => (
          <IonButton
            key={tag}
            color="medium"
            className="tagContainerButton"
            onClick={() => setSelectedTagList((prev) => prev.filter((t) => t !== tag))}
          >
            <IonLabel className="tagContainerButtonLabels ion-text-wrap">{tag}</IonLabel>
            <IonIcon icon={trashOutline} />
          </IonButton>
        ))}
      </div>
      <IonModal
        id="dialogSelectTag"
        trigger="openDialogSelectTag"
        onDidPresent={() => {}}
        onDidDismiss={() => {}}
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
            onIonInput={(e) => setFilterTagString(e.detail.value)}
            color="light"
            id="tagSearchBar"
          />
        </IonHeader>
        <IonContent>
          <IonList>
            {filteredTags.map((tag) => (
              <IonItem key={tag}>
                <IonCheckbox
                  slot="start"
                  checked={selectedTagList.includes(tag)}
                  onIonChange={handleCheckboxChange(tag)}
                />
                <IonLabel>{tag}</IonLabel>
              </IonItem>
            ))}
          </IonList>
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
                      onIonInput={(e) => setNewTagString(e.detail.value)}
                      color="dark"
                      labelPlacement="stacked"
                      type="text"
                      fill="outline"
                      style={{ margin: "16px 0" }}
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
