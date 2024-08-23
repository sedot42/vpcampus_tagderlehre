/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useContext } from "react";
import { IonPage, IonContent, IonIcon, IonFab, IonFabButton } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { UniversalSearchBar } from "../globalUI/UniversalSearchBar";
import { ListAnchorsAsCardsComponent } from "./ListAnchorsAsCardsComponent";
import { addOutline } from "ionicons/icons";
import { AnchorContext } from "../../anchorContext";

export const ManageAnchorsComponent = ({
  setShowCreate,
  setShowView,
}: //anchors,
//deleteOneAnchor,
{
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  //anchors: DBAnchor[];
  //</React.SetStateAction>deleteOneAnchor: (anchor: DBAnchor["id"]) => void;
}) => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);
  return (
    <IonPage>
      <StatusHeader titleText="Übersicht" />

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
            <ListAnchorsAsCardsComponent
              key={index}
              anchor={anchor} // Type error in Search Bar Component! (returnes GenericObject instead of DBAnchor)
              index={index}
              deleteOneAnchor={deleteOneAnchor}
              setShowView={setShowView}
            ></ListAnchorsAsCardsComponent>
          )}
        />
      </IonContent>
    </IonPage>
  );
};
