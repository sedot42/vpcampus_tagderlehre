import { IonContent } from "@ionic/react";

export const DisplayDateTestComponent = ({ dateTime }) => {
  return (
    <IonContent className="ion-padding">
      <div>The date is: {dateTime} (SecondTime)</div>
    </IonContent>
  );
};
