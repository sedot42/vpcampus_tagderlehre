import { useState, useContext, useEffect } from "react";
import { IonPage, IonContent, IonButton, IonIcon, IonText, IonItem } from "@ionic/react";
import { addCircleOutline, informationCircleOutline } from "ionicons/icons";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { SelectionModal } from "./SelectionModal";
import { ProfileModal, ProfileSelection } from "./ProfileSelection";
import { InfoModal } from "./InfoModal";
import { SettingsComponentCalendar } from "./SettingsComponentsCalendar";
import { ModalButton } from "../globalUI/Buttons";

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
  const groupList =
    anchors &&
    [...new Set(anchors.flatMap((anchor) => anchor.group_id))]
      .sort()
      .filter((tag) => tag !== undefined);

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
          hasMultiSelection
          closeModal={() => setTagsModalOpen(false)}
          isOpen={tagsModalOpen}
          selectionList={tagList}
          modalConfirmAction={(newList: string[]) =>
            localStorage.setItem(SettingsGroup.TAGS, JSON.stringify([...newList]))
          }
          initialSelection={JSON.parse(localStorage.getItem(SettingsGroup.TAGS) || "[]")}
        />
        <SelectionModal
          headerText="Gruppen auswählen"
          hasMultiSelection
          closeModal={() => setGroupsModalOpen(false)}
          isOpen={groupsModalOpen}
          selectionList={groupList}
          modalConfirmAction={(newList: string[]) =>
            localStorage.setItem(SettingsGroup.GROUPS, JSON.stringify([...newList]))
          }
          initialSelection={JSON.parse(
            localStorage.getItem(SettingsGroup.GROUPS) || "[]"
          )}
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
