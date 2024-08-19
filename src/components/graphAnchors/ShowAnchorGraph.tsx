import React, { useContext, useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonList,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { Graph } from "./Graph";
import { AnchorContext } from "../../anchorContext";
import { StatusHeader } from "../globalUI/StatusHeader";

export const ShowAnchorGraph: React.FC = () => {
  console.log("ola");
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);
  const [startNodeId, setStartNodeId] = useState<string | undefined>("");
  const [depth, setDepth] = useState<number>(1);
  const [showOrphans, setShowOrphans] = useState<boolean>(false);

  const handleStartNodeChange = (e: any) => {
    setStartNodeId(e.detail.value);
  };

  const handleDepthChange = (e: any) => {
    setDepth(parseInt(e.detail.value, 10));
  };

  const handleOrphansToggle = () => {
    setShowOrphans(!showOrphans);
  };

  const handleResetFilter = () => {
    setStartNodeId("");
    setShowOrphans(false);
  };

  const filteredData = showOrphans
    ? anchors.filter((node) => !(node.anchor_ref && node.anchor_ref.length > 0))
    : startNodeId
    ? anchors.filter(
        (node) =>
          node.id === startNodeId ||
          (node.anchor_ref && node.anchor_ref.includes(startNodeId))
      )
    : anchors;

  return (
    <IonPage>
      <StatusHeader titleText="Erstellen" />
      <IonContent fullscreen>
        <Graph data={filteredData} startNodeId={startNodeId} depth={depth} />
        <IonList>
          <IonItem>
            <IonLabel position="floating">Start Node</IonLabel>
            <IonSelect
              value={startNodeId}
              placeholder="Select Start Node"
              onIonChange={handleStartNodeChange}
            >
              {anchors.map((node) => (
                <IonSelectOption key={node.id} value={node.id}>
                  {node.anchor_name}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>
          <IonItem>
            <IonLabel position="floating">Depth</IonLabel>
            <IonInput type="number" value={depth} onIonChange={handleDepthChange} />
          </IonItem>
          <IonItem>
            <IonButton onClick={handleOrphansToggle}>
              {showOrphans ? "Hide Orphans" : "Show Orphans"}
            </IonButton>
            <IonButton
              onClick={handleResetFilter}
              color="medium"
              style={{ marginLeft: "10px" }}
            >
              Show All
            </IonButton>
          </IonItem>
        </IonList>
      </IonContent>
    </IonPage>
  );
};
