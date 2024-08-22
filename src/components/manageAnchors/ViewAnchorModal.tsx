import { IonList, IonModal } from "@ionic/react";
import {} from "ionicons/icons";
import { Anchor } from "../../types/types";
import { useContext, useRef, useState } from "react";
import { AnchorContext } from "../../anchorContext";
import { ListAnchorsAsCardsComponent } from "./ListAnchorsAsCardsComponent";

export const ViewAnchorModal = ({
  showView,
  setShowView,
  showViewAnchorID,
}: //anchors,
//deleteOneAnchor,
{
  showView: boolean;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  showViewAnchorID: string;
  //anchors: DBAnchor[];
  //deleteOneAnchor: (anchor: DBAnchor["id"]) => void;
}) => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext); // load anchors state and delete action

  // Reference of the viewModal
  const viewModal = useRef<HTMLIonModalElement>(null); // reference for the viewModal

  // Filter all anchors which match the List of IDs (which is set by other component)
  const filteredAnchors = anchors.filter((anchor) => anchor.id === showViewAnchorID);

  return (
    <IonModal
      ref={viewModal}
      isOpen={showView}
      initialBreakpoint={0.3}
      breakpoints={[0, 0.3, 1]}
      handleBehavior="cycle"
      onIonModalDidDismiss={() => {
        setShowView(false);
      }}
    >
      <IonList>
        {showViewAnchorID && // If there is no Event ID (e.g. on App Launch) this content should not render
          filteredAnchors.map((anchor, index) => (
            // Load content from CardsComponent (shared with other components)
            <ListAnchorsAsCardsComponent
              key={index}
              anchor={anchor}
              index={index}
              //setModalData={setModalData}
              //setOpenUpdateModal={setOpenUpdateModal}
              deleteOneAnchor={deleteOneAnchor}
            ></ListAnchorsAsCardsComponent>
          ))}
      </IonList>
    </IonModal>
  );
};
