import { useState, useContext } from "react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { convertFlatAnchorToDBAnchor } from "../../types/types";
import { draftAnchor } from "../../types/defaults";
import { AnchorContext } from "../../anchorContext";
import { ConfigInput, createInputs, createTextarea } from "../globalUI/GenericFields";
import {
  IonPage,
  IonButton,
  IonFooter,
  IonContent,
  IonItem,
  IonToast,
  IonToggle,
} from "@ionic/react";
import { checkmarkCircleOutline, alertCircleOutline } from "ionicons/icons";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";
import { CreateValidityComponent } from "./CreateValidityComponent";
import { CreateDocumentComponent } from "./CreateDocumentComponent";
import { CreateGroupComponent } from "./CreateGroupComponent";
import { CreateLocationComponent } from "./CreateLocationComponent";
import { CreateDateComponent } from "./CreateDateComponent";
import { CreateTagComponent } from "./CreateTagComponent";

export const CreateFunctionalAnchorComponent = () => {
  // anchors from the server (database)
  const { anchors } = useContext(AnchorContext);
  const [localAnchor, setLocalAnchor] = useState(draftAnchor);
  const { createOneAnchor } = useContext(AnchorContext);
  const [error, setError] = useState(false);

  const [newTagError, setNewTagError] = useState<boolean>(false); // status for permissibility of the created tag
  const [showToastCreateTag, setShowToastCreateTag] = useState<boolean>(false); // status for triggering the user information

  const [newBuildingError, setNewBuildingError] = useState<boolean>(false); // status for permissibility of the created building
  const [showToastCreateBuilding, setShowToastCreateBuilding] = useState<boolean>(false); // status for triggering the user information

  const [newGroupError, setNewGroupError] = useState<boolean>(false); // status for permissibility of the created group
  const [showToastCreateGroup, setShowToastCreateGroup] = useState<boolean>(false); // status for triggering the user information

  const [newLocationError, setNewLocationError] = useState<boolean>(false); // status for permissibility of the created location
  const [showToastCreateLocation, setShowToastCreateLocation] = useState<boolean>(false); // status for triggering the user information

  const [newPositionLatitude, setNewPositionLatitude] = useState<number>(NaN); // temporary number to save new coordinate - lat
  const [newPositionLongitude, setNewPositionLongitude] = useState<number>(NaN); // temporary number to save new coordinate - lon

  const [selectedTagList, setSelectedTagList] = useState<string[]>([]); // list of all selected tags
  const [temporaryTagList, setTemporaryTagList] = useState<string[]>([]); // list with all tags created by user

  const [anchorStartDate, setAnchorStartDate] = useState<string>(""); // string for the start point
  const [anchorEndDate, setAnchorEndDate] = useState<string>(""); // string for the end point

  const [anchorStartValid, setAnchorStartValid] = useState<string>(""); // string for the start point
  const [anchorEndValid, setAnchorEndValid] = useState<string>(""); // string for the end point
  const [temporaryLocationList, setTemporaryLocationList] = useState<any[]>([]); // list with all locations created by user

  const [selectedLocationDictionary, setSelectedLocationDictionary] = useState<{
    [key: string]: any;
  }>({}); // list of the selected location
  const [selectedBuildingDictionary, setSelectedBuildingDictionary] = useState<{
    [key: string]: any;
  }>({}); // list of the selected building

  const [temporaryGroupList, setTemporaryGroupList] = useState<string[]>([]); // list with all groups created by user
  const [temporaryBuildingList, setTemporaryBuildingList] = useState<any[]>([]); // list with all buildings created by user

  const [selectedGroupString, setSelectedGroupString] = useState<string>(""); // string of the selected group

  const [selectedFileList, setSelectedFileList] = useState<string[]>([]); // list of all selected documents

  // send anchor to server
  const handleSubmission = () => {
    console.log(localAnchor);
    if (localAnchor.anchor_name) {
      setError(false);
      const dbAnchor = convertFlatAnchorToDBAnchor(localAnchor);
      createOneAnchor(dbAnchor);
      setLocalAnchor(draftAnchor);
      // reset all
      setSelectedTagList([]); // tags
      setAnchorStartDate(""); // date-start
      setAnchorEndDate(""); // date-end
      setAnchorStartValid(""); // validity-start
      setAnchorEndValid(""); // validity-end
      setSelectedLocationDictionary({}); // location
      setNewPositionLatitude(NaN); // latitude
      setNewPositionLongitude(NaN); // longitude
      setSelectedBuildingDictionary({}); // building
      // reset temporary user creations
      setTemporaryTagList([]); // tag
      setTemporaryGroupList([]); // group
      setTemporaryLocationList([]); // location
      setTemporaryBuildingList([]); // building
      const locationContainerDiv = document.getElementById("locationContainer")!;
      locationContainerDiv.innerHTML = "";
      setSelectedGroupString(""); // group
      const groupContainerDiv = document.getElementById("groupContainer")!;
      groupContainerDiv.innerHTML = "";
      setSelectedFileList([]); // documents
    } else {
      setError(true);
    }
  };

  // configuration of the input for the anchor name
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

        <CreateTagComponent
          anchors={anchors}
          localAnchor={localAnchor}
          setLocalAnchor={setLocalAnchor}
          setShowToastCreateTag={setShowToastCreateTag}
          setNewTagError={setNewTagError}
          selectedTagList={selectedTagList}
          setSelectedTagList={setSelectedTagList}
          temporaryTagList={temporaryTagList}
          setTemporaryTagList={setTemporaryTagList}
        />

        <CreateDateComponent
          localAnchor={localAnchor}
          setLocalAnchor={setLocalAnchor}
          anchorStartDate={anchorStartDate}
          setAnchorStartDate={setAnchorStartDate}
          anchorEndDate={anchorEndDate}
          setAnchorEndDate={setAnchorEndDate}
        />
        <CreateValidityComponent
          localAnchor={localAnchor}
          setLocalAnchor={setLocalAnchor}
          anchorStartValid={anchorStartValid}
          setAnchorStartValid={setAnchorStartValid}
          anchorEndValid={anchorEndValid}
          setAnchorEndValid={setAnchorEndValid}
        />
        <CreateLocationComponent
          anchors={anchors}
          localAnchor={localAnchor}
          setLocalAnchor={setLocalAnchor}
          setShowToastCreateLocation={setShowToastCreateLocation}
          setShowToastCreateBuilding={setShowToastCreateBuilding}
          setNewLocationError={setNewLocationError}
          setNewBuildingError={setNewBuildingError}
          setNewPositionLatitude={setNewPositionLatitude}
          newPositionLatitude={newPositionLatitude}
          setNewPositionLongitude={setNewPositionLongitude}
          newPositionLongitude={newPositionLongitude}
          selectedLocationDictionary={selectedLocationDictionary}
          setSelectedLocationDictionary={setSelectedLocationDictionary}
          selectedBuildingDictionary={selectedBuildingDictionary}
          setSelectedBuildingDictionary={setSelectedBuildingDictionary}
          temporaryLocationList={temporaryLocationList}
          setTemporaryLocationList={setTemporaryLocationList}
          temporaryBuildingList={temporaryBuildingList}
          setTemporaryBuildingList={setTemporaryBuildingList}
        />
        <CreateGroupComponent
          anchors={anchors}
          localAnchor={localAnchor}
          setLocalAnchor={setLocalAnchor}
          setNewGroupError={setNewGroupError}
          setShowToastCreateGroup={setShowToastCreateGroup}
          temporaryGroupList={temporaryGroupList}
          setTemporaryGroupList={setTemporaryGroupList}
          selectedGroupString={selectedGroupString}
          setSelectedGroupString={setSelectedGroupString}
        />
        <CreateDocumentComponent
          localAnchor={localAnchor}
          setLocalAnchor={setLocalAnchor}
          selectedFileList={selectedFileList}
          setSelectedFileList={setSelectedFileList}
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
        <IonToast
          style={{ height: 60 }}
          color={error ? "danger" : "success"}
          position="top"
          trigger="create-anchor"
          message={error ? "Überprüfe deine Eingabe" : "Anker wurde erstellt!"}
          duration={1200}
          icon={error ? alertCircleOutline : checkmarkCircleOutline}
        ></IonToast>

        {/* toast to report the success or failure for the creation of a new temporary tag */}
        <IonToast
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
        ></IonToast>

        {/* toast to report the success or failure for the creation of a new temporary building */}
        <IonToast
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
        ></IonToast>

        {/* toast to report the success or failure for the creation of a new temporary group */}
        <IonToast
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
        ></IonToast>
      </IonFooter>
    </IonPage>
  );
};
