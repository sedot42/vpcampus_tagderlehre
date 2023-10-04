import React, { useState } from "react";
import { update_mutation } from "../requests/mutations";
import { Anchor } from "../types/types";
import { IonButton, IonInput, IonItem, IonLabel, IonList } from "@ionic/react";

function UpdateAnchor({
  anchor,
  setAnchor,
}: {
  anchor: Anchor;
  setAnchor: (anchor: Anchor) => void;
}) {
  const [name, setName] = useState(anchor.anchor_name);
  const [ownerId, setOwnerId] = useState(anchor.owner_id);

  const handleUpdate = () => {
    console.log('inside the event handel')
    update_mutation
    ;

    fetch("http://localhost:5000/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: update_mutation,
        variables: {
          id: anchor.id,
          name,
          ownerId,
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Anchor updated:', data.data.updateAnchor);
        // Handle success, update local state or show a success message
      })
      .catch((error) => {
        console.error('Error updating anchor:', error);
        // Handle error, show an error message
      });
  };

  return (


    <div>
    <IonInput
      required
      id="outlined-required"
      label="Owner ID"
      defaultValue=""
      value={ownerId}
      onIonInput={(event: any) => setOwnerId(event.target.value as string)}
      onChange={(e:any) => setOwnerId(e.target.value)}
    />
    <IonInput
      required
      id="outlined-required"
      label="Anchor Name"
      defaultValue=""
      value={name}
      onIonInput={(event: any) => {
        setName(event.target.value as string);
      }}
      onChange={(e:any) => setName(e.target.value)} 
    />

      <IonButton
        onClick={() => {
          console.log('inside the event');
          handleUpdate
            
        }}
      >
        Edit
      </IonButton>
  </div>
  



  );
};

export default UpdateAnchor;