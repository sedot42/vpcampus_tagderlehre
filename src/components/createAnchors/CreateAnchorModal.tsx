import { useState, useContext, useEffect } from "react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { convertFlatAnchorToDBAnchor, DBAnchor } from "../../types/types";
import { draftAnchor } from "../../types/defaults";
import { AnchorContext } from "../../anchorContext";
import { ConfigInput, createInputs, createTextarea } from "../globalUI/GenericFields";
import {
  IonPage,
  IonButton,
  IonFooter,
  IonContent,
  IonItem,
  IonLabel,
  IonToggle,
  IonDatetimeButton,
} from "@ionic/react";
import {
  addCircleOutline,
  trashOutline,
  closeOutline,
  qrCodeOutline,
} from "ionicons/icons";

import { checkmarkCircleOutline, alertCircleOutline } from "ionicons/icons";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";
import { CreateValidityComponent } from "./CreateValidityComponent";
import { CreateDocumentComponent } from "./CreateDocumentComponent";
import { CreateGroupComponent } from "./CreateGroupComponent";
import { CreateLocationComponent } from "./CreateLocationComponent";
import { CreateDateComponent } from "./CreateDateComponent";
import { SelectionModal } from "../settings/SelectionModal";
import { ModalButton } from "../globalUI/Buttons";
import { SettingsGroup } from "../settings/SettingsComponent";

export const CreateAnchorModal = () => {
  const { anchors, createOneAnchor } = useContext(AnchorContext);
  const [localAnchor, setLocalAnchor] = useState(draftAnchor);
  const [tagsModalOpen, setTagsModalOpen] = useState(false);
  const [groupsModalOpen, setGroupsModalOpen] = useState(false);
  const [locationModalOpen, setLocationModalOpen] = useState(false);
  const [useDate, setUseDate] = useState<boolean>(false); // status whether date should be set or not
  const [anchorStartDate, setAnchorStartDate] = useState<string>(""); // string for the start point
  const [anchorEndDate, setAnchorEndDate] = useState<string>(""); // string for the end point
  const handleSubmission = () => {
    const dbAnchor = convertFlatAnchorToDBAnchor(localAnchor);
    createOneAnchor(dbAnchor as DBAnchor);
    setLocalAnchor(draftAnchor);
  };

  useEffect(() => {
    if (useDate) {
      setLocalAnchor({
        ...localAnchor,
        start_at:
          anchorStartDate != "" ? (anchorStartDate as string) + ".000Z" : undefined,
        end_at: anchorEndDate != "" ? (anchorEndDate as string) + ".000Z" : undefined,
      });
    } else {
      setLocalAnchor({
        ...localAnchor,
        start_at: undefined,
        end_at: undefined,
      });
    }
  }, [useDate, anchorStartDate, anchorEndDate]);

  const tagList =
    anchors &&
    [...new Set(anchors.flatMap((anchor) => anchor.tags))]
      .sort()
      .filter((tag) => tag !== undefined);

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
        <CreateDateComponent
          localAnchor={localAnchor}
          setLocalAnchor={setLocalAnchor}
          anchorStartDate={anchorStartDate}
          setAnchorStartDate={setAnchorStartDate}
          anchorEndDate={anchorEndDate}
          setAnchorEndDate={setAnchorEndDate}
        />
        <ModalButton
          id="openGroupModal"
          text="Tags"
          icon={addCircleOutline}
          onClick={() => setTagsModalOpen(true)}
        />
        <ModalButton
          id="openTagModal"
          text="Gruppen"
          icon={addCircleOutline}
          onClick={() => setGroupsModalOpen(true)}
        />
        <ModalButton
          id="openDialogSelectDocument"
          text="Dokumente"
          icon={addCircleOutline}
          onClick={() => console.log("not implemented")}
        />

        <SelectionModal
          headerText="Tags auswählen"
          closeModal={() => setTagsModalOpen(false)}
          isOpen={tagsModalOpen}
          searchFunction={() => console.log("Nicht implementiert")}
          selectionList={tagList}
          settingsGroup={SettingsGroup.TAGS}
        />

        <SelectionModal
          headerText="Gruppen auswählen"
          closeModal={() => setGroupsModalOpen(false)}
          isOpen={groupsModalOpen}
          searchFunction={() => console.log("Nicht implementiert")}
          selectionList={[]}
          settingsGroup={SettingsGroup.GROUPS}
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
          onClick={handleSubmission}
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
