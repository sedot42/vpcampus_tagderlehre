import { useState, useRef, useContext, useEffect } from "react";
import { IonPage, IonButton, IonIcon, IonModal, IonInput } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { create_mutation, delete_mutation } from "../../requests/mutations";
import { query } from "../../requests/queries";
import { Anchor } from "../../types/types";

type CreateAnchorProps = {
  anchors: Anchor[];
  setAnchors: (anchors: Anchor[]) => void;
};

export const CreateAnchorComponent = ({
  anchors,
  setAnchors,
}: CreateAnchorProps) => {
  const [anchorId, setAnchorId] = useState("");
  const [ownerId, setOwnerId] = useState("");

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
  return (
    <IonPage>
      <StatusHeader titleText="Anker erstellen" />

      <div>
        <IonInput
          required
          id="outlined-required"
          label="Owner ID"
          placeholder="Owner"
          value={ownerId}
          onIonInput={(event: any) => setOwnerId(event.target.value as string)}
        />
        <IonInput
          required
          id="outlined-required"
          label="Anchor Name"
          placeholder="Anchor Name"
          value={anchorId}
          onIonInput={(event: any) => {
            setAnchorId(event.target.value as string);
          }}
        />
      </div>

      <div>
        <IonButton
          onClick={() => {
            fetch("http://localhost:5000/", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },

              body: JSON.stringify({
                query: create_mutation,
                variables: {
                  anchor: {
                    anchor_name: anchorId,
                    owner_id: ownerId,
                  },
                },
              }),
            })
              .then((res) => res.json())
              .then(() => getAnchors());
          }}
        >
          Create Anchor
        </IonButton>
      </div>
    </IonPage>
  );
};
