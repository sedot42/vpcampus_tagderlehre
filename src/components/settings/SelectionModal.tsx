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
import { closeOutline } from "ionicons/icons";
import { SettingsGroup } from "./SettingsComponent";

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

  const handleChange = (event) => {
    const isChecked = event?.target.checked;
    if (isChecked) {
      setCheckedBoxes([...checkedBoxes, event.target.value]);
    } else {
      setCheckedBoxes(checkedBoxes.filter((i) => i !== event.target.value));
    }
  };
  return (
    <IonModal id="dialogFilterInfo" trigger="openFilterInfo" isOpen={isOpen}>
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
        <IonSearchbar
          onIonInput={(e) => console.log(e.target.value || "")}
          color="light"
          id="tagSearchBar"
        ></IonSearchbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonInfiniteScroll>
          <IonList id="listAllFilteredTags">
            {selectionList &&
              selectionList.length > 0 &&
              selectionList.map((item, index) => (
                <IonItem key={index}>
                  <IonCheckbox
                    justify="space-between"
                    key={index}
                    value={item}
                    aria-label="item"
                    checked={checkedBoxes.includes(item)}
                    onIonChange={(e) => handleChange(e)}
                  >
                    {item}
                  </IonCheckbox>
                </IonItem>
              ))}
          </IonList>
        </IonInfiniteScroll>
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
