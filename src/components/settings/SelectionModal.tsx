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
  IonFooter,
  IonItem,
  IonCheckbox,
} from "@ionic/react";
import { CheckboxChangeEventDetail, IonCheckboxCustomEvent } from "@ionic/core";
import { closeOutline } from "ionicons/icons";
import { SettingsGroup } from "./SettingsComponent";
import { UniversalSearchBar } from "../globalUI/UniversalSearchBar";

type SelectionModalProps = {
  closeModal: () => void;
  isOpen: boolean;
  headerText: string;
  searchFunction: (term: string) => void;
  selectionList: string[];
  settingsGroup: SettingsGroup;
  modalConfirmAction: () => void;
};

export const SelectionModal = ({
  closeModal,
  isOpen,
  headerText,
  selectionList,
  settingsGroup,
  modalConfirmAction,
}: SelectionModalProps) => {
  const storedValues = JSON.parse(localStorage.getItem(settingsGroup) || "[]");
  const [checkedBoxes, setCheckedBoxes] = useState<string[]>(storedValues);

  const handleChange = (event: IonCheckboxCustomEvent<CheckboxChangeEventDetail>) => {
    const isChecked = event?.target.checked;
    if (isChecked) {
      setCheckedBoxes([...checkedBoxes, event.target.value]);
    } else {
      setCheckedBoxes(checkedBoxes.filter((i) => i !== event.target.value));
    }
  };

  const listForSearch = selectionList.map((item: string) => ({ name: item }));
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
          entitiesToBeSearched={listForSearch}
          historyKeyName={"searchHistoryTags"}
          titlePropertyName={"name"}
          renderItem={(tag, index) => (
            <IonItem key={index}>
              <IonCheckbox
                justify="space-between"
                key={index}
                value={tag.name}
                aria-label="item"
                checked={checkedBoxes.includes(tag.name)}
                onIonChange={(e) => handleChange(e)}
              >
                {tag.name}
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
