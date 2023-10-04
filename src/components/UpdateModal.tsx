import { Anchor } from "../types/types";
import React, { useState, useRef } from "react";
import { delete_mutation, update_mutation } from "../requests/mutations";

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
  IonModal,
  IonButtons,
  IonInput,
} from "@ionic/react";

export const UpdateModal = ({
  anchor,
  openModal,
  setOpenModal,
}: {
  anchor: Anchor;
  openModal: boolean;
  setOpenModal: (openModal: boolean) => void;
}) => {
  const [newAnchorName, setNewAnchorName] = useState("");
  const [newOwnerId, setNewOwnerId] = useState("");

  const updateAnchor = (anchor_name: string, owner_id: string, id: string) => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: update_mutation,
        variables: {
          anchor: {
            id: id,
            anchor_name: anchor_name, //"e976e882-50aa-428e-a831-00749d7db311",
            owner_id: owner_id,
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Anchor updated:", data.data.updateAnchor);
      })
      .catch((error) => {
        console.error("Error updating anchor:", error);
        // Handle error, show an error message
      });
  };

  return (
    <IonModal isOpen={openModal}>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonButton onClick={() => setOpenModal(false)}>Cancel</IonButton>
          </IonButtons>
          <IonTitle>Update Anchor {anchor.id}</IonTitle>
          <IonButtons slot="end">
            <IonButton
              strong={true}
              onClick={() => {
                // Use the local state as arguments for the updating
                updateAnchor(newAnchorName, newOwnerId, anchor.id);
                setOpenModal(false);
              }}
            >
              Confirm
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonItem>
          <div>
            <p>{anchor.id}</p>
            <IonInput
              // Use the current value from state here, it changes with onIonInput
              value={newAnchorName}
              type="text"
              // Use the current name (from the backend as placeholder)
              placeholder={anchor.anchor_name}
              // Update local state (see useState-Hook) on User Input. This just saves the input in local state but doesn`t send it to backend. The latter is done with the onClick function in the Confirm Button
              onIonInput={(event) =>
                setNewAnchorName(event.target.value as string)
              }
            />
            <IonInput
              value={newOwnerId}
              placeholder={anchor.owner_id}
              type="text"
              onIonInput={(event) => {
                setNewOwnerId(event.target.value as string);
              }}
            />
          </div>
        </IonItem>
      </IonContent>
    </IonModal>
  );
};
