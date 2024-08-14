import { useState } from "react";
import {
  IonContent,
  IonButton,
  IonIcon,
  IonModal,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonSearchbar,
  IonFooter,
  IonInfiniteScroll,
  IonList,
  IonItem,
  IonCheckbox,
} from "@ionic/react";
import { CheckboxChangeEventDetail, IonCheckboxCustomEvent } from "@ionic/core";
import { closeOutline } from "ionicons/icons";
import { SettingsGroup } from "./SettingsComponent";
import { UniversalSearchBar } from "../shared/UniversalSearchBar";

type SelectionModalProps = {
  closeModal: () => void;
  isOpen: boolean;
  headerText: string;
  searchFunction: (term: string) => void;
  selectionList: string[];
  settingsGroup: SettingsGroup;
};

export const SelectionModal = ({
  closeModal,
  isOpen,
  headerText,
  selectionList,
  settingsGroup,
}: SelectionModalProps) => {
  const storedValues = JSON.parse(localStorage.getItem(settingsGroup) || "[]");
  const [checkedBoxes, setCheckedBoxes] = useState<string[]>(storedValues);

  const saveToLocalStorage = (newList: string[]) => {
    localStorage.setItem(settingsGroup, JSON.stringify([...newList]));
  };

  const handleChange = (event: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) => {
    const isChecked = event?.target.checked;
    if (isChecked) {
      setCheckedBoxes([...checkedBoxes, event.target.value]);
    } else {
      setCheckedBoxes(checkedBoxes.filter((i) => i !== event.target.value));
    }
  };
  return (
    <IonModal
      id="dialogFilterInfo"
      isOpen={isOpen}
      onDidDismiss={() => closeModal()}
      style={{ "--min-height": "100vh", "--min-width": "100vw" }}
    >
      <IonHeader>
        <IonToolbar>
          <IonTitle slot="start">{headerText}</IonTitle>
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
      <IonContent className="ion-padding">
        <UniversalSearchBar
          entitiesToBeSearched={storedValues}
          historyKeyName={"searchHistoryAnchors"}
          renderItem={(anchor, index) => (
            <IonItem key={index}>
              <IonCheckbox
                justify="space-between"
                key={index}
                value={storedValues}
                aria-label="item"
                checked={checkedBoxes.includes(storedValues)}
                onIonChange={(e) => handleChange(e)}
              >
                {storedValues}
              </IonCheckbox>
            </IonItem>
          )}
        />
      </IonContent>
      <IonFooter class="ion-padding">
        <IonButton
          onClick={() => {
            saveToLocalStorage(checkedBoxes);
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
