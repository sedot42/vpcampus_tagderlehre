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
  IonInput,
  IonLabel,
  IonList,
  IonModal,
  IonRow,
  IonSearchbar,
  IonText,
  IonTitle,
  IonToolbar,
  IonRadioGroup,
  IonRadio,
  IonItem,
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
  const [filterGroupString, setFilterGroupString] = useState("");
  const [newGroupString, setNewGroupString] = useState("");
  const [groups, setGroups] = useState<string[]>([]);
  const [showCreateGroupModal, setShowCreateGroupModal] = useState(false);
  const [showSelectGroupModal, setShowSelectGroupModal] = useState(false);

  const getGroupsFromDB = () => {
    if (!anchors) return [];
    const uniqueGroups = new Set<string>();
    anchors.forEach((anchor) => {
      if (anchor?.group_id) {
        uniqueGroups.add(anchor.group_id);
      }
    });
    return Array.from(uniqueGroups);
  };

  const updateGroupsList = () => {
    const groupsDB = getGroupsFromDB();
    const allGroups = [...groupsDB, ...temporaryGroupList].sort();
    setGroups(allGroups);
  };

  useEffect(() => {
    updateGroupsList();
  }, [filterGroupString, temporaryGroupList]);

  useEffect(() => {
    if (
      getGroupsFromDB().includes(newGroupString) ||
      temporaryGroupList.includes(newGroupString) ||
      newGroupString === ""
    ) {
      setNewGroupError(true);
    } else {
      setNewGroupError(false);
    }
  }, [newGroupString]);

  const handleCreateNewGroup = () => {
    if (newGroupString !== "") {
      if (
        !getGroupsFromDB().includes(newGroupString) &&
        !temporaryGroupList.includes(newGroupString)
      ) {
        setTemporaryGroupList((prevList) => [...prevList, newGroupString]);
        setSelectedGroupString(newGroupString);
        setShowToastCreateGroup(true);
        setShowCreateGroupModal(false);
      }
    }
  };

  const handleModalDismiss = () => {
    setFilterGroupString("");
    setShowSelectGroupModal(false);
  };

  useEffect(() => {
    setLocalAnchor((prev) => ({
      ...prev,
      group_id: selectedGroupString || undefined,
    }));
  }, [selectedGroupString]);

  return (
    <>
      <IonButton
        id="openDialogSelectGroup"
        expand="block"
        color="light"
        fill="solid"
        size="default"
        onClick={() => setShowSelectGroupModal(true)}
      >
        <div>
          <IonLabel id="openDialogSelectGroupLabel" className="ion-text-wrap">
            Gruppe
          </IonLabel>
          <IonIcon icon={addCircleOutline} size="large" aria-hidden="true"></IonIcon>
        </div>
      </IonButton>
      <div id="groupContainer">
        {selectedGroupString && (
          <IonButton
            id={selectedGroupString}
            className="groupContainerButton"
            color="medium"
            onClick={() => setSelectedGroupString("")}
          >
            <IonLabel className="groupContainerButtonLabels ion-text-wrap">
              {selectedGroupString}
            </IonLabel>
            <IonIcon icon={trashOutline} />
          </IonButton>
        )}
      </div>

      {/* Group selection modal */}
      <IonModal isOpen={showSelectGroupModal} onDidDismiss={handleModalDismiss}>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Gruppe auswählen</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowSelectGroupModal(false)}>
                <IonIcon icon={closeOutline} size="large"></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
          <IonSearchbar
            onIonInput={(e) => setFilterGroupString(e.detail.value as string)}
            color="light"
            value={filterGroupString}
          ></IonSearchbar>
        </IonHeader>
        <IonContent>
          <IonList>
            <IonRadioGroup
              value={selectedGroupString}
              onIonChange={(e) => setSelectedGroupString(e.detail.value as string)}
            >
              <IonItem>
                <IonRadio value="" />
                <IonLabel>keine Auswahl</IonLabel>
              </IonItem>
              {groups
                .filter((group) => group.startsWith(filterGroupString))
                .map((group) => (
                  <IonItem key={group}>
                    <IonRadio value={group} />
                    <IonLabel>{group}</IonLabel>
                  </IonItem>
                ))}
            </IonRadioGroup>
          </IonList>
        </IonContent>
        <IonFooter>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  expand="full"
                  color="primary"
                  onClick={() => setShowCreateGroupModal(true)}
                >
                  Neue Gruppe
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="full" color="primary" onClick={handleModalDismiss}>
                  Speichern
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonFooter>
      </IonModal>

      {/* Create group modal */}
      <IonModal
        isOpen={showCreateGroupModal}
        onDidDismiss={() => setShowCreateGroupModal(false)}
      >
        <IonHeader>
          <IonToolbar>
            <IonTitle>Gruppe erstellen</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={() => setShowCreateGroupModal(false)}>
                <IonIcon icon={closeOutline} size="large"></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent className="padding">
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonInput
                  onIonInput={(e) => setNewGroupString(e.detail.value as string)}
                  color="dark"
                  labelPlacement="stacked"
                  type="text"
                  fill="outline"
                  style={{ margin: "16px 0" }}
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
                  expand="full"
                  color="primary"
                  onClick={() => setShowCreateGroupModal(false)}
                >
                  Abbrechen
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton expand="full" color="primary" onClick={handleCreateNewGroup}>
                  Speichern
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonFooter>
      </IonModal>
    </>
  );
};
