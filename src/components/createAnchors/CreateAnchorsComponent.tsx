import { useState, useContext } from "react";
import {
  IonPage,
  IonButton,
  IonFooter,
  IonContent,
  IonItemDivider,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { Anchor } from "../../types/types";
import { defaultAnchor } from "../../types/defaults";
import { AnchorContext } from "../../context";
import { Config, createInputs } from "../globalUI/GenericFields";
import {
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonAccordion,
  IonAccordionGroup,
  IonItem,
} from "@ionic/react";

export const CreateAnchorComponent = () => {
  const [localAnchor, setLocalAnchor] = useState<Anchor>(defaultAnchor);
  const { setOneAnchor } = useContext(AnchorContext);
  console.log(localAnchor);

  const config: Config[] = [
    // {
    //   required: true,
    //   property: "owner_id",
    //   placeholder: "Owner",
    //   label: "Owner",
    // },
    {
      required: true,
      property: "anchor_name",
      placeholder: "Anchor",
      label: "Name",
      fill: "outline",
    },
  ];

  return (
    <IonPage>
      <StatusHeader titleText="Anker erstellen" />

      <IonContent className="ion-padding" fullscreen>
        {createInputs(localAnchor, setLocalAnchor, config)}

        <IonAccordionGroup>
          <IonAccordion value="first">
            <IonItem slot="header" color="light">
              <IonLabel>Wann</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
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
              <IonLabel>Wo</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Second Content
            </div>
          </IonAccordion>
          <IonAccordion value="third">
            <IonItem slot="header" color="light">
              <IonLabel>Was</IonLabel>
            </IonItem>
            <div className="ion-padding" slot="content">
              Third Content
            </div>
          </IonAccordion>
        </IonAccordionGroup>
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
