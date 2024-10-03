import {
  IonButton,
  IonCard,
  IonContent,
  IonFooter,
  IonItem,
  IonList,
  IonText,
  IonLabel,
} from "@ionic/react";
import React from "react";
import { DBAnchor } from "../../../types/types";

interface AnchorInfoModalProps {
  anchors: DBAnchor[];
  onClose: () => void;
}

export const AnchorInfoModal: React.FC<AnchorInfoModalProps> = ({ anchors, onClose }) => {
  if (!anchors || anchors.length === 0) return null;

  return (
    <IonContent className="ion-padding ion-text-wrap custom-modal">
      <IonList>
        {anchors.length === 1 ? (
          <IonCard>
            <IonList>
              <IonItem>
                <IonLabel>
                  <strong>Name:</strong>
                </IonLabel>
                <IonText>{anchors[0].anchor_name}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <strong>Description:</strong>
                </IonLabel>
                <IonText>{anchors[0].anchor_description}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <strong>Latitude:</strong>
                </IonLabel>
                <IonText>{anchors[0].lat}</IonText>
              </IonItem>
              <IonItem>
                <IonLabel>
                  <strong>Longitude:</strong>
                </IonLabel>
                <IonText>{anchors[0].lon}</IonText>
              </IonItem>
            </IonList>
          </IonCard>
        ) : (
          <IonCard>
            <IonList>
              {anchors.map((item) => (
                <IonCard key={item.id}>
                  <IonList>
                    <IonItem>
                      <IonLabel>
                        <strong>Name:</strong>
                      </IonLabel>
                      <IonText>{item.anchor_name}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <strong>Description:</strong>
                      </IonLabel>
                      <IonText>{item.anchor_description}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <strong>Latitude:</strong>
                      </IonLabel>
                      <IonText>{item.lat}</IonText>
                    </IonItem>
                    <IonItem>
                      <IonLabel>
                        <strong>Longitude:</strong>
                      </IonLabel>
                      <IonText>{item.lon}</IonText>
                    </IonItem>
                  </IonList>
                </IonCard>
              ))}
            </IonList>
          </IonCard>
        )}
      </IonList>
      <IonFooter className="ion-padding">
        <IonButton
          onClick={onClose}
          className="close-button"
          expand="full"
          color="primary"
        >
          Schliessen
        </IonButton>
      </IonFooter>
    </IonContent>
  );
};
