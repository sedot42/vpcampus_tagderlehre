import React, { useState } from "react";
import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonItem,
  IonList,
  IonInput,
} from "@ionic/react";
import { Anchor } from "../types/types";
import { delete_mutation, update_mutation } from "../requests/mutations";
import { query } from "../requests/queries";

const Tab4 = ({
  anchors,
  setAnchors,
}: {
  anchors: Anchor[];
  setAnchors: (anchors: Anchor[]) => void;
}) => {
  const [anchorId, setAnchorId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  const [editingAnchor, setEditingAnchor] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false); // State for form visibility

  const openForm = (anchor) => {
    setEditingAnchor(anchor);
    setAnchorId(anchor.anchor_name);
    setOwnerId(anchor.owner_id);
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setEditingAnchor(null);
    setIsFormOpen(false);
  };

  const getAnchors = () => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((res) => setAnchors(res.data.anchors));
  };

  const updateAnchor = () => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: update_mutation,
        variables: {
          updateAnchorId: editingAnchor.id,
          anchor: {
            anchor_name: anchorId,
            owner_id: ownerId,
          },
        },
      }),
    })
      .then((res) => res.json())
      .then(() => {
        getAnchors(); // Update the list of anchors
        closeForm(); // Close the form after successful update
      });
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 4</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 4</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div>
          <IonButton onClick={getAnchors}>Read Anchor</IonButton>
        </div>
        <IonList>
          {anchors &&
            anchors.length > 0 &&
            anchors.map((anchor, index) => (
              <IonItem key={index}>
                <IonLabel>
                  {anchor.anchor_name} from {anchor.owner_id}
                </IonLabel>
                <IonButton onClick={() => openForm(anchor)}>Edit</IonButton>
                <IonButton
                  onClick={() => {
                    fetch("http://localhost:5000/", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },
                      body: JSON.stringify({
                        query: delete_mutation,
                        variables: {
                          deleteAnchorId: anchor.id,
                        },
                      }),
                    })
                      .then((res) => res.json())
                      .then(() => getAnchors());
                  }}
                >
                  Delete me
                </IonButton>
              </IonItem>
            ))}
        </IonList>

        {isFormOpen && (
          <div>
            <IonInput
              type="text"
              placeholder="New Anchor Name"
              value={anchorId}
              onIonInput={(event: any) =>
                setAnchorId(event.target.value as string)
              }
            />
            <IonInput
              type="text"
              placeholder="New Owner ID"
              value={ownerId}
              onIonInput={(event: any) =>
                setOwnerId(event.target.value as string)
              }
            />
            <IonButton onClick={updateAnchor}>Save</IonButton>
            <IonButton onClick={closeForm}>Cancel</IonButton>
          </div>
        )}
      </IonContent>
    </IonPage>
  );
};

export default Tab4;
