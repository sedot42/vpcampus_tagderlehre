import { useState, useRef, useContext, useEffect } from "react";
import {
  IonPage,
  IonButton,
  IonIcon,
  IonContent,
  IonInput,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { query } from "../../requests/queries";
import { Anchor } from "../../types/types";
import { defaultAnchor } from "../../types/defaults";
import { AnchorContext } from "../../context";

type CreateAnchorProps = {
  anchors: Anchor[];
  setAnchors: (anchors: Anchor[]) => void;
};

export const CreateAnchorComponent = () => {
  const [localAnchor, setLocalAnchor] = useState<Anchor>(defaultAnchor);
  const { setOneAnchor } = useContext(AnchorContext);

  return (
    <IonPage>
      <StatusHeader titleText="Anker erstellen" />

      <IonContent fullscreen>
        <IonInput
          required
          label="Owner ID"
          placeholder="Owner"
          value={localAnchor.owner_id}
          onIonInput={(event: any) => {
            setLocalAnchor({
              ...localAnchor,
              owner_id: event.target.value as string,
            });
          }}
        />
        <IonInput
          required
          id="outlined-required"
          label="Anchor Name"
          placeholder="Anchor Name"
          value={localAnchor.anchor_name}
          onIonInput={(event: any) => {
            setLocalAnchor({
              ...localAnchor,
              anchor_name: event.target.value as string,
            });
          }}
        />
      </IonContent>

      <div>
        <IonButton onClick={() => setOneAnchor(localAnchor)}>
          Create Anchor
        </IonButton>
      </div>
    </IonPage>
  );
};
