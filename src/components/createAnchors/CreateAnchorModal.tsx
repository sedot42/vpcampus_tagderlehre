import { useContext, useRef } from "react";
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
  DraftAnchor,
  isDraftAnchor,
} from "../../types/types";
import { AnchorContext } from "../../anchorContext";
import { ConfigInput, createInputs, createTextarea } from "../globalUI/GenericFields";
import { DateComponent } from "./DateComponent";
import { ModalButton } from "../globalUI/Buttons";
import { TagComponent } from "./TagComponent";
import { LocationGroup } from "./LocationComponent";
import { v4 as uuidv4 } from "uuid";

export const CreateAnchorModal = ({
  showCreate,
  setShowCreate,
  localAnchor,
  setLocalAnchor,
  showDate,
  setShowDate,
  setShowMapLocation,
  showMapLocation,
}: {
  showCreate: boolean;
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
  localAnchor: DraftAnchor<Anchor>;
  setLocalAnchor: React.Dispatch<React.SetStateAction<DraftAnchor<Anchor>>>;
  showDate: boolean;
  setShowDate: React.Dispatch<React.SetStateAction<boolean>>;
  setShowMapLocation: React.Dispatch<React.SetStateAction<boolean>>;
  showMapLocation: boolean;
}) => {
  const { createOneAnchor } = useContext(AnchorContext);

  const [present] = useIonToast();

  const createModal = useRef<HTMLIonModalElement>(null); // reference for the createModal

  const presentToast = (position: "top" | "middle" | "bottom") => {
    present({
      message: "Anker wurde erstellt!",
      duration: 2000,
      position: position,
      color: "success",
    });
  };

  const handleSubmission = () => {
    if (!isDraftAnchor(localAnchor)) {
      const dbAnchor = convertFlatAnchorToDBAnchor(localAnchor);
      createOneAnchor(dbAnchor);
      presentToast("middle");
      setShowMapLocation(false);
      setShowCreate(false);
    }
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
      ref={createModal}
      isOpen={showCreate}
      initialBreakpoint={1}
      breakpoints={[0, 0.3, 0.7, 1]}
      onIonModalDidDismiss={() => {
        setShowCreate(false);
        setShowDate(false);
      }}
      onIonModalWillPresent={() => setLocalAnchor({ ...localAnchor, id: uuidv4() })} // Create new uuID each time the modal opens
    >
      <IonContent
        className="ion-padding"
        fullscreen
        onClick={() => createModal.current?.setCurrentBreakpoint(1)} // when clicking into modal, it should expand to full height
      >
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
        {/* <GroupComponent localAnchor={localAnchor} setLocalAnchor={setLocalAnchor} /> */}

        <ModalButton
          id="openDialogSelectDocument"
          text="Dokumente"
          icon={addCircleOutline}
          onClick={() =>
            present({
              message: "Nicht implementiert",
              duration: 2000,
              position: "bottom",
              color: "warning",
            })
          }
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
          color="light"
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
