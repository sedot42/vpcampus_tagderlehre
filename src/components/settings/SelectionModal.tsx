import { ReactElement, useState } from "react";
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
import { UniversalSearchBar } from "../globalUI/UniversalSearchBar";

type SelectionModalProps = {
  closeModal: () => void;
  isOpen: boolean;
  headerText: string;
  selectionList: string[];
  modalConfirmAction: (list: string[]) => void;
  initialSelection: string[];
  hasMultiSelection: boolean;
  children?: ReactElement;
};

export const SelectionModal = ({
  closeModal,
  isOpen,
  headerText,
  selectionList,
  modalConfirmAction,
  initialSelection,
  hasMultiSelection,
  children,
}: SelectionModalProps) => {
  const [checkedBoxes, setCheckedBoxes] = useState<string[]>(initialSelection || []);

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
          renderItem={(item, index) =>
            hasMultiSelection ? (
              <IonItem key={index}>
                <IonCheckbox
                  justify="space-between"
                  key={index}
                  value={item.name}
                  aria-label="item"
                  checked={checkedBoxes.includes(item.name)}
                  onIonChange={(e) => handleChange(e)}
                >
                  {item.name}
                </IonCheckbox>
              </IonItem>
            ) : (
              <IonItem
                key={index}
                onClick={() => {
                  modalConfirmAction([item.name]);
                  closeModal();
                }}
              >
                {item.name}
              </IonItem>
            )
          }
        />
      </IonContent>
      <IonFooter class="ion-padding">
        {children ? (
          children
        ) : (
          <IonButton
            onClick={() => {
              modalConfirmAction(checkedBoxes);
              closeModal();
            }}
            expand="full"
            color="primary"
          >
            Ok
          </IonButton>
        )}
      </IonFooter>
    </IonModal>
  );
};
