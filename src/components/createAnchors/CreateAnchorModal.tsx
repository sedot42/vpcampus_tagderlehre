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
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import { CreateDateComponent } from "./CreateDateComponent";
import { ModalButton } from "../globalUI/Buttons";
import { TagGroup } from "./UIgroups/TagGroup";
import { GroupGroup } from "./UIgroups/GroupGroup";
import "../../theme/styles.css";

export type AnchorCreateProps = {
  localAnchor: DraftAnchor<Anchor>;
  setLocalAnchor: (anchor: DraftAnchor<Anchor>) => void;
};

export const CreateAnchorModal = () => {
  const { anchors, createOneAnchor } = useContext(AnchorContext);
  const [localAnchor, setLocalAnchor] = useState(draftAnchor);
  const [locationModalOpen, setLocationModalOpen] = useState(false);

  const handleSubmission = () => {
    const dbAnchor = convertFlatAnchorToDBAnchor(localAnchor);
    createOneAnchor(dbAnchor as DBAnchor);
    setLocalAnchor(draftAnchor);
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

        <ModalButton
          id="openDialogSelectLocation"
          text="Ort"
          icon={addCircleOutline}
          onClick={() => setLocationModalOpen(true)}
        />
        <CreateDateComponent localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} />
        <TagGroup localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} />
        <GroupGroup localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} />

        <ModalButton
          id="openDialogSelectDocument"
          text="Dokumente"
          icon={addCircleOutline}
          onClick={() => console.log("not implemented")}
        />

        <IonItem lines="none" id="privateToggle" style={{ margin: "16px 0 0 0" }}>
          <IonToggle labelPlacement="start">Privater Eintrag?</IonToggle>
          {/*onIonChange={addPrivacy} DEFINED LATER */}
        </IonItem>
      </IonContent>
      <IonFooter
        style={{
          display: "flex",
          justifyContent: "center",
          backgroundColor: "#fff",
        }}
      >
        <IonButton
          id="create-anchor"
          fill="solid"
          strong={true}
          onClick={() => console.log(localAnchor)}
          // onClick={handleSubmission}
          expand="block"
          style={{ padding: "4px" }}
        >
          Erstellen
        </IonButton>

        {/* <IonToast
          style={{ height: 60 }}
          color={error ? "danger" : "success"}
          position="top"
          trigger="create-anchor"
          message={error ? "Überprüfe deine Eingabe" : "Anker wurde erstellt!"}
          duration={1200}
          icon={error ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast> */}

        {/* toast to report the success or failure for the creation of a new temporary tag */}
        {/* <IonToast
          isOpen={showToastCreateTag}
          onDidDismiss={() => setShowToastCreateTag(false)}
          style={{ height: 80 }}
          color={newTagError ? "danger" : "success"}
          position="top"
          message={
            newTagError
              ? "Erstellung fehlgeschlagen! \nEingabe ungültig oder Tag bereits vorhanden."
              : "Tag erfolgreich erstellt"
          }
          duration={1200}
          icon={newTagError ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast> */}

        {/* toast to report the success or failure for the creation of a new temporary building */}
        {/* <IonToast
          isOpen={showToastCreateBuilding}
          onDidDismiss={() => setShowToastCreateBuilding(false)}
          style={{ height: 80 }}
          color={newBuildingError ? "danger" : "success"}
          position="top"
          message={
            newBuildingError
              ? "Erstellung fehlgeschlagen! \nKeine Werte eingegeben."
              : "Gebäude erfolgreich erstellt"
          }
          duration={1200}
          icon={newBuildingError ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast> */}

        {/* toast to report the success or failure for the creation of a new temporary group */}
        {/* <IonToast
          isOpen={showToastCreateGroup}
          onDidDismiss={() => setShowToastCreateGroup(false)}
          style={{ height: 80 }}
          color={newGroupError ? "danger" : "success"}
          position="top"
          message={
            newGroupError
              ? "Erstellung fehlgeschlagen! \nEingabe ungültig oder Gruppe bereits vorhanden."
              : "Gruppe erfolgreich erstellt"
          }
          duration={1200}
          icon={newGroupError ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast> */}
      </IonFooter>
    </IonPage>
  );
};
