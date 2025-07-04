import { useState, useContext } from "react";
import { IonButton, IonLabel, IonIcon } from "@ionic/react";
import { addCircleOutline, trashOutline } from "ionicons/icons";
import { AnchorContext } from "../../anchorContext";
import { SelectionModal } from "../settings/SelectionModal";
import { Anchor, DraftAnchor } from "../../types/types";
import { ModalButton } from "../globalUI/Buttons";
import "../../theme/styles.css";

export const TagComponent = ({
  localAnchor,
  setLocalAnchor,
}: {
  localAnchor: DraftAnchor<Anchor>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
}) => {
  const { anchors } = useContext(AnchorContext);

  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const { tags } = localAnchor;

  const tagList =
    anchors &&
    [...new Set(anchors.flatMap((anchor) => anchor.tags))]
      .sort()
      .filter((tag) => tag !== undefined);

  return (
    <>
      <ModalButton
        id="openTagsModal"
        text="Tags"
        icon={addCircleOutline}
        onClick={() => setTagsModalOpen(true)}
      />
      <div id="tagContainer">
        {tags &&
          tags.length > 0 &&
          tags.map((tag) => (
            <IonButton
              key={tag}
              color="medium"
              className="tagContainerButton"
              onClick={() =>
                setLocalAnchor({ ...localAnchor, tags: tags.filter((t) => t !== tag) })
              }
            >
              <IonLabel className="tagContainerButtonLabels ion-text-wrap">
                {tag}
              </IonLabel>
              <IonIcon icon={trashOutline} />
            </IonButton>
          ))}
      </div>
      <SelectionModal
        headerText="Tags auswählen"
        hasMultiSelection
        closeModal={() => setTagsModalOpen(false)}
        isOpen={tagsModalOpen}
        selectionList={tagList}
        initialSelection={localAnchor.tags || []}
        modalConfirmAction={(newList: string[]) =>
          setLocalAnchor({
            ...localAnchor,
            tags: [...newList],
          })
        }
      />
    </>
  );
};
