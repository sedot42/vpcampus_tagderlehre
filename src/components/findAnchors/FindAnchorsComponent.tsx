import { useState, useRef, useContext, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { query } from "../../requests/queries";
import { Anchor } from "../../types/types";

type FindAnchorProps = {
  anchors: Anchor[];
  setAnchors: (anchors: Anchor[]) => void;
};

export const FindAnchorComponent = ({
  anchors,
  setAnchors,
}: FindAnchorProps) => {
  const defaultAnchor = { id: "", anchor_name: "", owner_id: "" };

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
      .then((res) => setAnchors(res.data.anchors))
      .catch((e) => {
        console.log(e);
        setAnchors([defaultAnchor]);
      });
  };

  useEffect(() => {
    getAnchors();
  }, []);

  return (
    <IonPage>
      <StatusHeader titleText="Anker finden" />
      <IonContent fullscreen>
        <IonList>
          {anchors &&
            anchors.length > 0 &&
            anchors.map((anchor, index) => (
              <IonCard key={index}>
                <IonCardHeader>
                  <IonCardTitle>{anchor.anchor_name || "-"}</IonCardTitle>
                  <IonCardSubtitle> {anchor.owner_id || "-"}</IonCardSubtitle>
                  <IonCardSubtitle> {anchor.created_at || "-"}</IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent>
                  Here's a small text description for the card content. Nothing
                  more, nothing less.
                </IonCardContent>
              </IonCard>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
