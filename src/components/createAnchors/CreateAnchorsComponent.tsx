import { useState, useContext } from "react";
import { IonPage, IonButton, IonFooter, IonContent } from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { Anchor } from "../../types/types";
import { defaultAnchor } from "../../types/defaults";
import { AnchorContext } from "../../context";
import { Config, createInputs } from "../globalUI/GenericFields";

export const CreateAnchorComponent = () => {
  const [localAnchor, setLocalAnchor] = useState<Anchor>(defaultAnchor);
  const { setOneAnchor } = useContext(AnchorContext);

  const config: Config[] = [
    {
      required: true,
      property: "owner_id",
      placeholder: "Owner",
      label: "Owner",
    },
    {
      required: true,
      property: "anchor_name",
      placeholder: "Anchor",
      label: "Anchor",
    },
  ];

  return (
    <IonPage>
      <StatusHeader titleText="Anker erstellen" />

      <IonContent className="ion-padding" fullscreen>
        {createInputs(localAnchor, setLocalAnchor, config)}
      </IonContent>

      <IonFooter style={{ display: "flex", justifyContent: "center" }}>
        <IonButton
          fill="clear"
          strong={true}
          onClick={() => setOneAnchor(localAnchor)}
        >
          Erstellen
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};
