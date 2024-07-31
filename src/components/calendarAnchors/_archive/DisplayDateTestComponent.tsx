import { IonContent } from "@ionic/react";

export const DisplayDateTestComponent = ({ dateTime }: { dateTime: string }) => {
  return (
    <IonContent className="ion-padding">
      <div>The date is: {dateTime} (SecondTime)</div>
    </IonContent>
  );
};
