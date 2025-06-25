import { IonContent, IonList, IonModal } from "@ionic/react";
import {} from "ionicons/icons";
import { useContext, useRef } from "react";
import { AnchorContext } from "../../anchorContext";
import { AnchorCard } from "./AnchorCard";
import { Anchor } from "../../types/types";

export const ViewAnchorModal = ({
  showView,
  setShowView,
  showViewAnchorIDs,
  onOpenUpdateModal,
  basename,
}: {
  showView: boolean;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  showViewAnchorIDs: string[];
  onOpenUpdateModal: (anchorData: Anchor) => void;
  basename: string;
}) => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);
  // Reference of the viewModal
  const viewModalRef = useRef<HTMLIonModalElement>(null);
  // Filter all anchors which match the List of IDs (which is set by other component)
  const filteredAnchors = anchors.filter((anchor) =>
    showViewAnchorIDs.includes(anchor.id)
  );

  return (
    <IonModal
      ref={viewModalRef}
      isOpen={showView}
      initialBreakpoint={filteredAnchors.length > 2 ? 1 : 0.6}
      breakpoints={[0, 0.6, 1]}
      handleBehavior="cycle"
      onIonModalDidDismiss={() => {
        setShowView(false);
      }}
    >
      <IonContent>
        <IonList>
          {showViewAnchorIDs && // If there is no Event ID (e.g. on App Launch) this content should not render
            filteredAnchors.map((anchor, index) => (
              // Load content from CardsComponent (shared with other components)
              <AnchorCard
                key={index}
                anchor={anchor}
                index={index}
                deleteOneAnchor={deleteOneAnchor}
                setShowView={setShowView}
                onOpenUpdateModal={onOpenUpdateModal}
                basename={basename}
              />
            ))}
        </IonList>
      </IonContent>
    </IonModal>
  );
};
