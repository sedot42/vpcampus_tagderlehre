import { useState, useContext } from "react";
import { IonButton, IonLabel, IonIcon } from "@ionic/react";
import { addCircleOutline, trashOutline } from "ionicons/icons";
import { AnchorContext } from "../../anchorContext";
import { SelectionModal } from "../settings/SelectionModal";
import { ModalButton } from "../globalUI/Buttons";
import { Anchor, DraftAnchor } from "../../types/types";
import "../../theme/styles.css";

export const GroupComponent = ({
  localAnchor,
  setLocalAnchor,
}: {
  localAnchor: DraftAnchor<Anchor>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
}) => {
  const { anchors } = useContext(AnchorContext);

  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const { groups } = localAnchor;

  const groupList =
    anchors &&
    [...new Set(anchors.flatMap((anchor) => anchor.groups))]
      .sort()
      .filter((group) => group !== undefined);

  return (
    <>
      <ModalButton
        id="openGroupsModal"
        text="Gruppen"
        icon={addCircleOutline}
        onClick={() => setGroupsModalOpen(true)}
      />
      <div id="groupContainer">
        {groups &&
          groups.length > 0 &&
          groups.map((group) => (
            <IonButton
              key={group}
              color="medium"
              className="groupContainerButton"
              onClick={() =>
                setLocalAnchor({
                  ...localAnchor,
                  groups: groups.filter((g) => g !== group),
                })
              }
            >
              <IonLabel className="groupContainerButtonLabels ion-text-wrap">
                {group}
              </IonLabel>
              <IonIcon icon={trashOutline} />
            </IonButton>
          ))}
      </div>
      <SelectionModal
        headerText="Gruppen auswählen"
        hasMultiSelection
        closeModal={() => setGroupsModalOpen(false)}
        isOpen={groupsModalOpen}
        selectionList={groupList}
        initialSelection={localAnchor.groups || []}
        modalConfirmAction={(newList: string[]) =>
          setLocalAnchor({
            ...localAnchor,
            groups: [...newList],
          })
        }
      />
    </>
  );
};
