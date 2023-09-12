import React, {
  FormEvent,
  ReactEventHandler,
  useEffect,
  useState,
} from "react";

import {
  IonButton,
  IonContent,
  IonHeader,
  IonInput,
  IonItem,
  IonLabel,
  IonList,
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

  // useEffect(() => {
  //   console.log(anchors.length);
  //   getAnchors();
  // }, [anchors.length]);

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
          onIonInput={(event: any) => setOwnerId(event.target.value as string)}
        />
        <IonInput
          required
          id="outlined-required"
          label="Anchor Name"
          defaultValue=""
          value={anchorId}
          onIonInput={(event: any) => {
            console.log(event.target);
            setAnchorId(event.target.value as string);
          }}
          // onChange={(event: React.ChangeEvent<HTMLIonInputElement>) => {
          //   console.log(event.target);
          //   setOwnerId(event.target.value as string);
          // }}
        />
      </div>

      <div>
        <IonButton onClick={getAnchors}>Read Anchor</IonButton>
        <IonButton
          onClick={() => {
            console.log("aaaaa");
            console.log(anchorId, ownerId);
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
              .then((res) => getAnchors());
          }}
        >
          Create Anchor
        </IonButton>
      </div>
      <IonList>
        {anchors &&
          anchors.length > 0 &&
          anchors.map((anchor, index) => (
            <IonItem key={index}>
              <IonLabel>
                {anchor.anchor_name} from {anchor.owner_id}
              </IonLabel>
              <IonButton
                onClick={() => {
                  console.log(anchor.id);
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
                    .then((res) => getAnchors());
                }}
              >
                Delete me
              </IonButton>
            </IonItem>
          ))}
      </IonList>
    </>
  );
};

export default Tab1;
