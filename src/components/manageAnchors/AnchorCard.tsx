import { useState } from "react";
import {
  IonIcon,
  IonLabel,
  IonItem,
  IonNote,
  IonCard,
  IonItemSliding,
  IonButton,
  IonAlert,
  useIonToast,
  IonPopover,
  IonContent,
} from "@ionic/react";
import {
  createOutline,
  mapOutline,
  qrCodeOutline,
  shareSocialOutline,
  trashOutline,
} from "ionicons/icons";
import QRCode from "react-qr-code";
import { Anchor, convertDBAnchorToFlatAnchor, DBAnchor } from "../../types/types";

export const AnchorCard = ({
  anchor,
  index,
  deleteOneAnchor,
  setShowView,
  onOpenUpdateModal,
}: {
  anchor: DBAnchor;
  index: number;
  deleteOneAnchor: (anchor: DBAnchor["id"]) => void;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenUpdateModal: (anchorData: Anchor) => void;
}) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<boolean>(false);
  const [anchorToDelete, setAnchorToDelete] = useState<DBAnchor>();

  const [showToast] = useIonToast();

  const handleUpdateClick = () => {
    onOpenUpdateModal(convertDBAnchorToFlatAnchor(anchor));
  };

  return (
    <IonCard key={index} onClick={handleUpdateClick} style={{ cursor: "pointer" }}>
      <IonItemSliding>
        <IonItem lines="none" id={"open-modal-" + index}>
          <IonLabel>
            <h2 style={{ fontWeight: 700 }}>{anchor.anchor_name}</h2>
            <IonNote style={{ color: "#555555" }} class="ion-text-wrap">
              <p>
                {anchor.anchor_description
                  ? `${anchor.anchor_description}`
                  : "Keine Beschreibung vorhanden"}
              </p>
              {anchor.start_at && anchor.end_at && (
                <>
                  <p>Start: {new Date(anchor.start_at).toLocaleString()}</p>
                  <p>Ende: {new Date(anchor.end_at).toLocaleString()}</p>
                </>
              )}
              {(anchor.room_id || anchor.campus_id || anchor.faculty_name) && (
                <p>
                  Ort: {anchor.room_id || ""}
                  {anchor.room_id && (anchor.faculty_name || anchor.campus_id)
                    ? ", "
                    : ""}
                  {anchor.faculty_name || ""}
                  {anchor.faculty_name && anchor.campus_id ? ", " : ""}
                  {anchor.campus_id || ""}
                </p>
              )}
            </IonNote>
          </IonLabel>
        </IonItem>
        <>
          <IonButton onClick={handleUpdateClick}>
            <IonIcon icon={createOutline} size="small" />
          </IonButton>
          {anchor.lat && anchor.lon && (
            <IonButton
              onClick={(e) => e.stopPropagation()}
              routerLink={`mapAnchors?id=${anchor.id}`}
            >
              <IonIcon icon={mapOutline} size="small" />
            </IonButton>
          )}
          <IonButton
            id={anchor.id + "delete"}
            onClick={(e) => {
              setShowDeleteConfirm(true);
              setAnchorToDelete(anchor);
              e.stopPropagation();
            }}
          >
            <IonIcon icon={trashOutline} size="small" />
          </IonButton>
          <IonButton
            onClick={(e) => {
              e.stopPropagation();
              console.log(window.location);
              navigator.clipboard.writeText(
                new URL(
                  `${window.location.origin}${window.location.pathname}#/${
                    anchor.lat ? "mapAnchors" : "manageAnchors"
                  }?id=${anchor.id}`
                ).toString()
              );
              showToast({
                message: "Anchor-URL wurde kopiert",
                duration: 3000,
                position: "middle",
                color: "success",
              });
            }}
          >
            <IonIcon icon={shareSocialOutline} size="small" />
          </IonButton>
          <IonButton
            id={`qr-trigger-${anchor.id}`}
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <IonIcon icon={qrCodeOutline} size="small" />
          </IonButton>

          <IonPopover
            trigger={`qr-trigger-${anchor.id}`}
            keepContentsMounted
            style={{ "--height": "auto" }}
          >
            <IonContent className="ion-padding">
              <QRCode
                size={200}
                style={{ height: "auto", maxWidth: "100%", width: "100%" }}
                value={new URL(
                  `${window.location.origin}${window.location.pathname}#/${
                    anchor.lat ? "mapAnchors" : "manageAnchors"
                  }?id=${anchor.id}`
                ).toString()}
                viewBox={`0 0 200 200`}
              />
            </IonContent>
          </IonPopover>
          <IonAlert
            isOpen={showDeleteConfirm}
            header="Anker Löschen"
            subHeader={anchor.anchor_name}
            message="Willst du den Anker endgültig Löschen?"
            buttons={[
              {
                text: "Abbrechen",
                role: "cancel",
                handler: () => {
                  setShowDeleteConfirm(false);
                  setShowView(false);
                },
              },
              {
                text: "Löschen",
                role: "confirm",
                handler: () => {
                  setShowDeleteConfirm(false);
                  if (anchorToDelete) deleteOneAnchor(anchorToDelete.id);
                  setShowView(false);
                  console.log("Delete", anchor.anchor_name);
                },
              },
            ]}
          ></IonAlert>
        </>
      </IonItemSliding>
    </IonCard>
  );
};
