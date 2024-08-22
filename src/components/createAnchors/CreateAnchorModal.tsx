import { useContext, useEffect } from "react";
import {
  IonButton,
  IonFooter,
  IonContent,
  IonItem,
  IonToggle,
  useIonToast,
  IonModal,
} from "@ionic/react";
import { addCircleOutline } from "ionicons/icons";
import {
  Anchor,
  convertFlatAnchorToDBAnchor,
  DBAnchor,
  DraftAnchor,
} from "../../types/types";
//import { draftAnchor } from "../../types/defaults";
import { AnchorContext } from "../../anchorContext";
import { ConfigInput, createInputs, createTextarea } from "../globalUI/GenericFields";
import { DateComponent } from "./DateComponent";
import { ModalButton } from "../globalUI/Buttons";
import { TagComponent } from "./TagComponent";
import { GroupComponent } from "./GroupComponent";
import { LocationGroup } from "./LocationComponent";
import { draftAnchor } from "../../types/defaults";
import { v4 as uuidv4 } from "uuid";

export const CreateAnchorModal = ({
  showCreate,
  setShowCreate,
  //closeModal,
  localAnchor,
  setLocalAnchor,
  showDate,
  setShowDate,
  setShowMapLocation,
  showMapLocation,
}: {
  showCreate: boolean;
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  //closeModal: () => void;
  localAnchor: DraftAnchor<Anchor>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
  showDate: boolean;
  setShowDate: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMapLocation: React.Dispatch<React.SetStateAction<boolean>>;
  showMapLocation: boolean;
}) => {
  const { createOneAnchor } = useContext(AnchorContext);

  const [present] = useIonToast();

  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Anker wurde erstellt!",
      duration: 2000,
      position: position,
      color: "success",
    });
  };

  useEffect(() => setLocalAnchor({ ...localAnchor, id: uuidv4() }), []);

  const handleSubmission = () => {
    console.log(localAnchor);
    const dbAnchor = convertFlatAnchorToDBAnchor(localAnchor);

    createOneAnchor(dbAnchor as DBAnchor);
    setLocalAnchor(draftAnchor); // Why?
    //closeModal();
    presentToast("middle");
    setShowMapLocation(false);
    setShowCreate(false);
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
    <IonModal
      isOpen={showCreate}
      initialBreakpoint={1}
      breakpoints={[0, 0.3, 1]}
      onIonModalDidDismiss={() => setShowCreate(false)}
    >
      <IonContent className="ion-padding" fullscreen>
        {/* part for entering the name */}
        {createInputs(localAnchor, setLocalAnchor, configTitle)}

        {/* part for entering the description */}
        {createTextarea(localAnchor, setLocalAnchor, configDescription)}
        <IonItem lines="none" id="privateToggle">
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
        <IonItem lines="none">
          <IonToggle
            checked={showDate}
            onIonChange={() => setShowDate(!showDate)}
            labelPlacement="start"
          >
            Zeit
          </IonToggle>
        </IonItem>
        {showDate && (
          <DateComponent localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} />
        )}
        <LocationGroup
          localAnchor={localAnchor}
          setLocalAnchor={setLocalAnchor}
          setShowMapLocation={setShowMapLocation}
          showMapLocation={showMapLocation}
        />
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
          onClick={() => setShowCreate(false)}
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
    </IonModal>
  );
};
