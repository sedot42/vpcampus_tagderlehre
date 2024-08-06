import { useState, useContext, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonLabel,
  IonButton,
  IonIcon,
  IonText,
  IonItem,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { addCircleOutline, informationCircleOutline } from "ionicons/icons";
import { SelectionModal } from "./SelectionModal";
import { ProfileModal, ProfileSelection } from "./ProfileSelection";

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

export const SettingsComponent = () => {
  const { anchors } = useContext(AnchorContext);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profile, setProfile] = useState(Profile.NONE);

  useEffect(() => {
    profile !== Profile.NONE && setProfileModalOpen(true);
  }, [profile]);

  const tagList =
    anchors && [...new Set(anchors.flatMap((anchor) => anchor.tags))].sort();

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
            <h3>Filteroptionen für relevante Tags und Gruppen</h3>
          </IonText>
          <IonButton
            id="openFilterInfo"
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

        <ProfileSelection profile={profile} setProfile={setProfile} />

        <IonButton
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
        </IonButton>

        <IonButton
          id="selectGroupButton"
          className="buttonAddElements"
          expand="block"
          color="light"
          fill="solid"
          size="default"
          onClick={() => setGroupsModalOpen(true)}
        >
          <div>
            <IonLabel
              id="selectGroupButtonLabel"
              class="ion-text-wrap"
              className="buttonAddElementsLabel"
            >
              Gruppen
            </IonLabel>
            <IonIcon
              icon={addCircleOutline}
              className="buttonAddElementsIcon"
              size="large"
              aria-hidden="true"
            ></IonIcon>
          </div>
        </IonButton>
        <SelectionModal
          closeModal={() => setTagsModalOpen(false)}
          isOpen={tagsModalOpen}
          headerText="Tags auswählen"
          searchFunction={(x) => console.log(x)}
          selectionList={tagList}
          settingsGroup={SettingsGroup.TAGS}
        />
        <SelectionModal
          closeModal={() => setGroupsModalOpen(false)}
          isOpen={groupsModalOpen}
          headerText="Gruppen auswählen"
          searchFunction={(x) => console.log(x)}
          selectionList={[]}
          settingsGroup={SettingsGroup.GROUPS}
        />
        <ProfileModal
          profile={profile}
          isOpen={profileModalOpen}
          closeModal={() => setProfileModalOpen(false)}
        />
      </IonContent>
    </IonPage>
  );
};
