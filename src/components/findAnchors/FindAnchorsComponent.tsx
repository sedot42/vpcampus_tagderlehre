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
import { Anchor } from "../../types/types";
import { AnchorContext } from "../../context";

export const FindAnchorComponent = () => {
  const { getAnchors } = useContext(AnchorContext);

  const anchors = getAnchors();

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
