import { useState, useContext } from "react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { Anchor } from "../../types/types";
import { defaultAnchor } from "../../types/defaults";
import { AnchorContext } from "../../context";
import { Config, createInputs } from "../globalUI/GenericFields";
import {
  IonPage,
  IonButton,
  IonFooter,
  IonContent,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonLabel,
  IonTextarea,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
  IonToast,
} from "@ionic/react";
import { checkmarkCircleOutline } from "ionicons/icons";
import { alertCircleOutline } from "ionicons/icons";
import "../../theme/styles.css";

export const CreateAnchorComponent = () => {
  const [localAnchor, setLocalAnchor] = useState<Anchor>(defaultAnchor);
  const { setOneAnchor } = useContext(AnchorContext);
  const [error, setError] = useState<boolean>(false);

  const handleSubmission = () => {
    if (localAnchor.anchor_name) {
      setError(false);
      setOneAnchor(localAnchor);
      setLocalAnchor(defaultAnchor);
    } else {
      setError(true);
    }
  };

  const configTitle: Config[] = [
    {
      required: true,
      property: "anchor_name",
      placeholder: "Anchor",
      label: "Anker Name",
      fill: "outline",
    },
  ];
  const configLocation: Config[] = [
    {
      required: false,
      property: "faculty_name",
      placeholder: "Hochschule",
      label: "Hochschule",
      fill: "outline",
    },
    {
      required: false,
      property: "floor_nr",
      placeholder: "Stockwerk",
      label: "Stockwerk",
      fill: "outline",
    },
    {
      required: false,
      property: "room_id",
      placeholder: "Raum",
      label: "Raum",
      fill: "outline",
    },
  ];

  return (
    <IonPage>
      <StatusHeader titleText="Anker erstellen" />

      <IonContent className="ion-padding" fullscreen>
        {createInputs(localAnchor, setLocalAnchor, configTitle)}

        <IonAccordionGroup>
          <IonAccordion value="first">
            <IonItem color="contrast" slot="header">
              <IonLabel color="primary">Wann?</IonLabel>
            </IonItem>
            <div className="accordionField" slot="content">
              <IonLabel>Start</IonLabel>
              <IonDatetimeButton datetime="starttime"></IonDatetimeButton>
              <IonLabel>Ende</IonLabel>
              <IonDatetimeButton datetime="endtime"></IonDatetimeButton>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  id="starttime"
                  onIonChange={(e) =>
                    setLocalAnchor({
                      ...localAnchor,
                      start_at: (e.target.value as string) || undefined,
                    })
                  }
                ></IonDatetime>
              </IonModal>
              <IonModal keepContentsMounted={true}>
                <IonDatetime
                  id="endtime"
                  onIonChange={(e) =>
                    setLocalAnchor({
                      ...localAnchor,
                      end_at: (e.target.value as string) || undefined,
                    })
                  }
                ></IonDatetime>
              </IonModal>
            </div>
          </IonAccordion>
          <IonAccordion value="second">
            <IonItem slot="header" color="light">
              <IonLabel>Wo?</IonLabel>
            </IonItem>
            <div className="accordionField" slot="content">
              {createInputs(localAnchor, setLocalAnchor, configLocation)}
            </div>
          </IonAccordion>
          <IonAccordion value="third">
            <IonItem slot="header" color="light">
              <IonLabel>Was?</IonLabel>
            </IonItem>
            <div className="accordionField" slot="content">
              <IonTextarea
                label="Beschreibung"
                labelPlacement="stacked"
                placeholder="...dein Text"
                fill="outline"
                onIonInput={(e) => {
                  setLocalAnchor({
                    ...localAnchor,
                    anchor_description: e.target.value as string,
                  });
                }}
              ></IonTextarea>
            </div>
          </IonAccordion>
        </IonAccordionGroup>
      </IonContent>

      <IonFooter style={{ display: "flex", justifyContent: "center" }}>
        <IonButton
          id="create-anchor"
          fill="clear"
          strong={true}
          onClick={handleSubmission}
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
      </IonFooter>
    </IonPage>
  );
};
