import { useState, useContext, useEffect } from "react";
import { IonPage, IonContent, IonButton, IonIcon, IonText, IonItem } from "@ionic/react";
import { addCircleOutline, informationCircleOutline } from "ionicons/icons";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { SelectionModal } from "./SelectionModal";
import { ProfileModal, ProfileSelection } from "./ProfileSelection";
import { InfoModal } from "./InfoModal";

export enum SettingsGroup {
  TAGS = "TAGS",
  GROUPS = "GROUPS",
}

export enum Profile {
  STUDIERENDE = "Studierende",
  LEHRENDE = "Lehrende",
  EXTERNE = "Externe",
  NONE = "NONE",
}

import { SettingsComponentCalendar } from "./SettingsComponentsCalendar";
import { ModalButton } from "../globalUI/Buttons";

export const SettingsComponent = () => {
  const { anchors } = useContext(AnchorContext);

  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [infoModalOpen, setInfoModalOpen] = useState(false);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState(Profile.NONE);

  useEffect(() => {
    profile !== Profile.NONE && setProfileModalOpen(true);
  }, [profile]);

  const tagList =
    anchors &&
    [...new Set(anchors.flatMap((anchor) => anchor.tags))]
      .sort()
      .filter((tag) => tag !== undefined);

  const saveToLocalStorage = (newList: string[], settingsGroup: SettingsGroup) => {
    localStorage.setItem(settingsGroup, JSON.stringify([...newList]));
  };

  return (
    <IonPage>
      <StatusHeader titleText="Optionen" />
      <IonContent className="ion-padding" fullscreen>
        <IonItem
          lines="none"
          style={{
            marginLeft: "-16px",
            marginRight: "-16px",
            "--background": "transparent",
          }}
        >
          <IonText class="ion-text-wrap">
            <h4>Profileinstellungen</h4>
          </IonText>
          <IonButton
            onClick={() => setInfoModalOpen(true)}
            slot="end"
            style={{
              "--box-shadow": "none",
              "--color": "#000000",
              "--background": "#ffffff",
            }}
          >
            <IonIcon icon={informationCircleOutline} size="large"></IonIcon>
          </IonButton>
        </IonItem>
        <ProfileSelection setProfile={setProfile} />
        {/* <IonButton
          id="selectTagButton"
          className="buttonAddElements"
          expand="block"
          color="light"
          fill="solid"
          size="default"
          onClick={() => setTagsModalOpen(true)}
        >
          <div>
            <IonLabel
              id="selectTagButtonLabel"
              class="ion-text-wrap"
              className="buttonAddElementsLabel"
            >
              Tags
            </IonLabel>
            <IonIcon
              icon={addCircleOutline}
              className="buttonAddElementsIcon"
              size="large"
              aria-hidden="true"
            ></IonIcon>
          </div>
        </IonButton> */}

        <ModalButton
          id="openGroupModal"
          text="Tags"
          icon={addCircleOutline}
          onClick={() => setTagsModalOpen(true)}
        />
        <ModalButton
          id="openTagModal"
          text="Gruppen"
          icon={addCircleOutline}
          onClick={() => setGroupsModalOpen(true)}
        />

        <SelectionModal
          headerText="Tags auswählen"
          closeModal={() => setTagsModalOpen(false)}
          isOpen={tagsModalOpen}
          searchFunction={() => console.log("Nicht implementiert")}
          selectionList={tagList}
          settingsGroup={SettingsGroup.TAGS}
          modalConfirmAction={}
        />

        <SelectionModal
          headerText="Gruppen auswählen"
          closeModal={() => setGroupsModalOpen(false)}
          isOpen={groupsModalOpen}
          searchFunction={() => console.log("Nicht implementiert")}
          selectionList={[]}
          settingsGroup={SettingsGroup.GROUPS}
        />

        <ProfileModal
          profile={profile}
          isOpen={profileModalOpen}
          closeModal={() => setProfileModalOpen(false)}
        />
        <SettingsComponentCalendar></SettingsComponentCalendar>
        <InfoModal
          headerText="Informationen"
          isOpen={infoModalOpen}
          closeModal={() => setInfoModalOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};
