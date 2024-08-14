import { IonActionSheet } from "@ionic/react";

export const CalendarAnchorCreate = ({
  showCreate,
  setShowCreate,
}: {
  showCreate: boolean;
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <IonActionSheet
      className="ion-padding"
      isOpen={showCreate}
      onDidDismiss={() => setShowCreate(false)}
      header="Anker erstellen"
      buttons={[
        {
          text: "Test",
        },
        {
          text: "Anker erstellen",
        },
        {
          text: "Abbrechen",
        },
      ]}
    ></IonActionSheet>
  );
};
