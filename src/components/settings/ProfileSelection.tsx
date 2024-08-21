import {
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonIcon,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonModal,
  IonHeader,
  IonContent,
  IonFooter,
} from "@ionic/react";
import { closeOutline } from "ionicons/icons";
import { Profile } from "./SettingsComponent";

type ProfileSelectionType = {
  setProfile: (profile: Profile) => void;
};

type ProfilModalTypes = {
  profile: Profile;
  isOpen: boolean;
  closeModal: () => void;
};

export const ProfileSelection = ({ setProfile }: ProfileSelectionType) => {
  return (
    <IonSelect
      label="Profil"
      placeholder="Nicht gewählt"
      onIonChange={(e) => setProfile(e.target.value)}
      fill="outline"
      style={{ margin: "15px -10px 15px 0px" }}
    >
      <IonSelectOption value={Profile.STUDIERENDE}>{Profile.STUDIERENDE}</IonSelectOption>
      <IonSelectOption value={Profile.LEHRENDE}>{Profile.LEHRENDE}</IonSelectOption>
      <IonSelectOption value={Profile.EXTERNE}>{Profile.EXTERNE}</IonSelectOption>
    </IonSelect>
  );
};

export const ProfileModal = ({ profile, isOpen, closeModal }: ProfilModalTypes) => {
  return (
    <IonModal
      id="dialogFilterInfo"
      isOpen={isOpen}
      onDidDismiss={() => closeModal()}
      style={{ "--min-height": "100vh", "--min-width": "100vw" }}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">Einstellungen</IonTitle>
          <IonButtons slot="end">
            <IonButton
              onClick={() => {
                closeModal();
              }}
            >
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent>
        <ProfileSettings profile={profile} />
      </IonContent>
      <IonFooter class="ion-padding">
        <IonButton
          onClick={() => {
            closeModal();
          }}
          expand="full"
          color="primary"
        >
          Ok
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};

const ProfileSettings = ({ profile }: { profile: Profile }) => {
  switch (profile) {
    case Profile.STUDIERENDE:
      return (
        <>
          <IonItem>
            <IonSelect
              label="Studiengang"
              placeholder="Nicht gewählt"
              onIonChange={(e) => console.log("Nicht implementiert", e.target.value)}
            >
              {["BSc Geomatik", "MSc Geomatik", "BSc Architektur", "MSc Architektur"].map(
                (fach, index) => (
                  <IonSelectOption key={index} value={fach}>
                    {fach}
                  </IonSelectOption>
                )
              )}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonSelect
              label="Start-Semester"
              placeholder="Nicht gewählt"
              onIonChange={(e) => console.log("Nicht implementiert", e.target.value)}
            >
              {["FS23", "HS23", "FS24", "HS24"].map((semester, index) => (
                <IonSelectOption key={index} value={semester}>
                  {semester}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
        </>
      );
    case Profile.LEHRENDE:
      return (
        <IonItem>
          <IonSelect
            label="Institut"
            placeholder="Nicht gewählt"
            onIonChange={(e) => console.log("Nicht implementiert", e.target.value)}
          >
            {["Geomatik", "Architektur", "Bau"].map((department, index) => (
              <IonSelectOption key={index} value={department}>
                {department}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>
      );
    case Profile.EXTERNE:
      return <div>Externe</div>;
  }
};
