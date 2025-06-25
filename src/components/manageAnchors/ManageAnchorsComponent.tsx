/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonFab,
  IonFabButton,
  useIonViewWillEnter,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { UniversalSearchBar } from "../globalUI/UniversalSearchBar";
import { AnchorCard } from "./AnchorCard";
import { addOutline } from "ionicons/icons";
import { AnchorContext } from "../../anchorContext";
import { Anchor, convertDBAnchorToFlatAnchor } from "../../types/types";
import { useParams } from "react-router";

export const ManageAnchorsComponent = ({
  setShowCreate,
  setShowView,
  onOpenUpdateModal,
  basename,
}: {
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenUpdateModal: (anchor: Anchor) => void;
  basename: string;
}) => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);
  const params = useParams<{ id?: string }>();

  useIonViewWillEnter(() => {
    // get highlighted anchor id from URL
    const id = params.id;
    const highlightedAnchor = anchors.find((anchor) => anchor.id == id);
    if (highlightedAnchor) {
      onOpenUpdateModal(convertDBAnchorToFlatAnchor(highlightedAnchor));
    }
  });

  return (
    <IonPage>
      <StatusHeader titleText="Ankerliste" />

      <IonContent fullscreen>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowCreate(true)}>
            <IonIcon icon={addOutline}></IonIcon>
          </IonFabButton>
        </IonFab>

        <UniversalSearchBar
          entitiesToBeSearched={anchors}
          historyKeyName={"searchHistoryAnchors"}
          titlePropertyName={"anchor_name"}
          renderItem={(anchor, index) => (
            <AnchorCard
              key={index}
              anchor={anchor} // Type error in Search Bar Component! (returnes GenericObject instead of DBAnchor)
              index={index}
              deleteOneAnchor={deleteOneAnchor}
              setShowView={setShowView}
              onOpenUpdateModal={onOpenUpdateModal}
              basename={basename}
            ></AnchorCard>
          )}
        />
      </IonContent>
    </IonPage>
  );
};
