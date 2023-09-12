import React, { FormEvent, ReactEventHandler, useState } from "react";

import {
  IonContent,
  IonHeader,
  IonInput,
  IonPage,
  IonTitle,
  IonToolbar,
} from "@ionic/react";
import "./Tab1.css";
import { create_mutation, delete_mutation } from "../requests/mutations";
import { query } from "../requests/queries";
import { Anchor } from "../types/types";

const Tab1: React.FC = () => {
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  const [anchorId, setAnchorId] = useState("");
  const [ownerId, setOwnerId] = useState("");
  console.log(anchors);
  return (
    <>
      <div>
        <IonInput
          required
          id="outlined-required"
          label="Owner ID"
          defaultValue=""
          value={ownerId}
          onChange={(event: React.ChangeEvent<HTMLIonInputElement>) =>
            setOwnerId(event.target.value as string)
          }
        />
        <IonInput
          required
          id="outlined-required"
          label="Anchor Name"
          defaultValue=""
          value={anchorId}
          onChange={(event: React.ChangeEvent<HTMLIonInputElement>) =>
            setOwnerId(event.target.value as string)
          }
        />
      </div>

      <div>
        <button
          onClick={() => {
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
          }}
        >
          Read Anchor
        </button>
        <button
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
              .then((res) => console.log(res.data));
          }}
        >
          Create Anchor
        </button>
      </div>
      {anchors &&
        anchors.length > 0 &&
        anchors.map((anchor, index) => (
          <div key={index}>
            <span>{anchor.anchor_name}</span> from {anchor.owner_id}{" "}
            <button>Delete me</button>
          </div>
        ))}
    </>
  );
};

export default Tab1;
