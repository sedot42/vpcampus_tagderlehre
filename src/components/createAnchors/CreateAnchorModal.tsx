import { useState, useContext } from "react";
import { StatusHeader } from "../globalUI/StatusHeader";
import {
  Anchor,
  convertFlatAnchorToDBAnchor,
  DBAnchor,
  DraftAnchor,
} from "../../types/types";
import { draftAnchor } from "../../types/defaults";
import { AnchorContext } from "../../anchorContext";
import { ConfigInput, createInputs, createTextarea } from "../globalUI/GenericFields";
import {
  IonPage,
  IonButton,
  IonFooter,
  IonContent,
  IonItem,
  IonToggle,
  useIonToast,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { DateComponent } from "./DateComponent";
import { ModalButton } from "../globalUI/Buttons";
import { TagComponent } from "./TagComponent";
import { GroupComponent } from "./GroupComponent";
import { LocationGroup } from "./LocationComponent";
// import "../../theme/styles.css";

export type AnchorCreateProps = {
  localAnchor: DraftAnchor<Anchor>;
  setLocalAnchor: (anchor: DraftAnchor<Anchor>) => void;
};

export const CreateAnchorModal = ({ closeModal }: { closeModal: () => void }) => {
  const { createOneAnchor } = useContext(AnchorContext);
  const [localAnchor, setLocalAnchor] = useState(draftAnchor);
  const [showDate, setShowDate] = useState<boolean>(false);

  const [present] = useIonToast();

  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Anker wurde erstellt!",
      duration: 2000,
      position: position,
      color: "success",
    });
  };

  const handleSubmission = () => {
    const dbAnchor = convertFlatAnchorToDBAnchor(localAnchor);
    console.log(dbAnchor);
    createOneAnchor(dbAnchor as DBAnchor);
    setLocalAnchor(draftAnchor);
    closeModal();
    presentToast("middle");
  };

  const configTitle: ConfigInput[] = [
    {
      required: true,
      property: "anchor_name",
      placeholder: "Name",
      label: "Name",
      fill: "outline",
    },
  ];

  // configuration of the input for the anchor Description
  const configDescription: ConfigInput[] = [
    {
      required: false,
      property: "anchor_description",
      placeholder: "Beschreibung",
      label: "Beschreibung",
      fill: "outline",
    },
  ];
  return (
    <IonPage>
      <StatusHeader titleText="Erstellen" />
      <IonContent className="ion-padding" fullscreen>
        {/* part for entering the name */}
        {createInputs(localAnchor, setLocalAnchor, configTitle)}

        {/* part for entering the description */}
        {createTextarea(localAnchor, setLocalAnchor, configDescription)}
        <IonItem lines="none" id="privateToggle" style={{ margin: "16px 0 0 0" }}>
          <IonToggle
            labelPlacement="start"
            onIonChange={() =>
              setLocalAnchor({
                ...localAnchor,
                private_anchor: localAnchor.private_anchor ? false : true,
              })
            }
          >
            Privater Anker?
          </IonToggle>
        </IonItem>
        <IonItem lines="none" style={{ margin: "16px 0 0 0" }}>
          <IonToggle onIonChange={() => setShowDate(!showDate)} labelPlacement="start">
            Zeit
          </IonToggle>
        </IonItem>
        {showDate && (
          <DateComponent localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} />
        )}
        <LocationGroup localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} />
        <TagComponent localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} />
        <GroupComponent localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} />

        <ModalButton
          id="openDialogSelectDocument"
          text="Dokumente"
          icon={addCircleOutline}
          onClick={() => console.log("not implemented")}
        />
      </IonContent>
      <IonFooter
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <IonButton
          id="abort"
          fill="clear"
          color="dark"
          onClick={closeModal}
          expand="block"
          style={{ padding: "4px" }}
        >
          Abbrechen
        </IonButton>
        <IonButton
          id="create-anchor"
          fill="solid"
          disabled={!localAnchor.anchor_name}
          onClick={handleSubmission}
          expand="block"
          style={{ padding: "4px" }}
        >
          Erstellen
        </IonButton>
      </IonFooter>
    </IonPage>
  );
};
