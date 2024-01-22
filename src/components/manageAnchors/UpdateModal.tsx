import { Anchor } from "../../types/types";
import React, { useState, useRef } from "react";
import { delete_mutation, update_mutation } from "../../requests/mutations";

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
  IonFooter,
  IonIcon,
  IonText,
  IonItemDivider,
} from "@ionic/react";
import { build, closeCircleOutline, closeOutline } from "ionicons/icons";

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

  const triggerUpdate = (anchor_name: string, owner_id: string, id: string) => {
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
          <IonIcon size="large" slot="start"></IonIcon>
          <IonTitle style={{ textAlign: "center" }}>Anker bearbeiten</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setOpenModal(false)}>
              <IonIcon icon={closeOutline} size="large"></IonIcon>
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div>
          <IonInput
            label="Titel"
            labelPlacement="stacked"
            clearInput={true}
            value={newAnchorName}
            type="text"
            placeholder={anchor.anchor_name}
            onIonInput={(event) =>
              setNewAnchorName(event.target.value as string)
            }
          />
          <IonInput
            label="Ersteller"
            labelPlacement="stacked"
            clearInput={true}
            value={newOwnerId}
            placeholder={anchor.owner_id}
            type="text"
            onIonInput={(event) => {
              setNewOwnerId(event.target.value as string);
            }}
          />
        </div>
        <IonItemDivider />

        <br />
        <IonText color="medium">ID: {anchor.id}</IonText>
        <br />
        <IonText color="medium">Created: {anchor.created_at}</IonText>
        <br />
        <IonText color="medium">Update: {anchor.updated_at}</IonText>
      </IonContent>
      <IonFooter style={{ display: "flex", justifyContent: "center" }}>
        <IonButton
          fill="clear"
          strong={true}
          onClick={() => {
            triggerUpdate(newAnchorName, newOwnerId, anchor.id);
            setOpenModal(false);
          }}
        >
          Speichern
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};
