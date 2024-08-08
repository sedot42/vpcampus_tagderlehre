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

interface AnchorInfoModalProps {
  filteredAnchor: any[];
  setModalData: (data: any) => void;
  setShowModal: (show: boolean) => void;
}

export const AnchorInfoModal: React.FC<AnchorInfoModalProps> = ({
  filteredAnchor,
  setModalData,
  setShowModal,
}) => {
  console.log(filteredAnchor);

  const tabdata: { [key: string]: any }[] = [];
  for (const element of filteredAnchor) {
    console.log(element);
    if (element.length !== 0) {
      for (const item of element) {
        console.log(item);
        tabdata.push(item);
      }
    }
  }

  return (
    <IonContent className="ion-padding ion-text-wrap">
      <IonList>
        {tabdata.length > 0 ? (
          tabdata.map((item, index) => (
            <IonCard key={index}>
              <IonList>
                {Object.entries(item).map(([key, value]) => (
                  <IonItem key={key}>
                    <IonLabel>{key}</IonLabel>
                    <IonText>{value.toString()}</IonText>
                  </IonItem>
                ))}
              </IonList>
            </IonCard>
          ))
        ) : (
          <IonItem>
            <IonText>No data available</IonText>
          </IonItem>
        )}
      </IonList>
      <IonFooter className="ion-padding">
        <IonButton onClick={() => setShowModal(false)} expand="full" color="primary">
          Schliessen
        </IonButton>
      </IonFooter>
    </IonContent>
  );
};
