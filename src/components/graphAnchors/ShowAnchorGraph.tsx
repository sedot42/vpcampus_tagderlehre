import React, { useState, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
  IonSelect,
  IonSelectOption,
} from "@ionic/react";
import { Graph } from "./Graph";
import { AnchorContext } from "../../anchorContext";
import { Anchor } from "../../types/types";
import { StatusHeader } from "../globalUI/StatusHeader";
import { UpdateModal } from "../manageAnchors/UpdateModal"; // Adjust the import path as needed

export const ShowAnchorGraph: React.FC = () => {
  const { anchors } = useContext(AnchorContext);
  const [startNodeId, setStartNodeId] = useState<string | undefined>("");
  const [depth, setDepth] = useState<number>(1);
  const [showOrphans, setShowOrphans] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<Anchor | undefined>(undefined);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleStartNodeChange = (e: any) => {
    setStartNodeId(e.detail.value);
  };

  const handleDepthChange = (e: any) => {
    setDepth(parseInt(e.detail.value));
  };

  const handleOrphansToggle = () => {
    setShowOrphans(!showOrphans);
  };

  const handleResetFilter = () => {
    setStartNodeId("");
    setShowOrphans(false);
  };

  const handleNodeClick = (node: Anchor) => {
    setSelectedNode(node);
    setIsModalOpen(true);
  };

  // Function to determine orphans
  const isOrphan = (node: any, allNodes: any[]) => {
    const hasNoRefs = !node.anchor_ref || node.anchor_ref.length === 0;
    const notReferenced = !allNodes.some((otherNode) =>
      otherNode.anchor_ref?.includes(node.id)
    );
    return hasNoRefs && notReferenced;
  };

  // Calculate depths if needed
  const depths = startNodeId ? calculateDepths(startNodeId, anchors) : {};

  // Filter data based on the current settings
  const filteredData = anchors.filter((node) => {
    const isCurrentOrphan = isOrphan(node, anchors);
    const nodeDepth = depths[node.id] ?? Infinity;

    if (showOrphans) {
      return isCurrentOrphan;
    } else if (startNodeId) {
      return nodeDepth <= depth || isCurrentOrphan;
    } else {
      return true;
    }
  });

  return (
    <IonPage>
      <StatusHeader titleText="Graph" />
      <IonContent fullscreen>
        <Graph
          data={filteredData}
          startNodeId={startNodeId}
          depth={depth}
          onNodeClick={handleNodeClick}
        />
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
            <IonLabel>Depth</IonLabel>
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

      {selectedNode && (
        <UpdateModal
          modalData={selectedNode}
          setModalData={setSelectedNode}
          openUpdateModal={isModalOpen}
          setOpenUpdateModal={setIsModalOpen}
        />
      )}
    </IonPage>
  );
};

// Utility function for calculating node depths
const calculateDepths = (startNodeId, anchors) => {
  const depths = {};
  const queue = [{ id: startNodeId, depth: 0 }];
  const visited = new Set();

  while (queue.length > 0) {
    const { id, depth } = queue.shift();
    if (visited.has(id)) continue;
    visited.add(id);
    depths[id] = depth;

    const node = anchors.find((n) => n.id === id);
    if (node) {
      (node.anchor_ref || []).forEach((refId) => {
        if (!visited.has(refId)) {
          queue.push({ id: refId, depth: depth + 1 });
        }
      });
    }
  }

  return depths;
};
