import {
  IonButton,
  IonCard,
  IonIcon,
  IonItem,
  IonItemSliding,
  IonLabel,
  IonModal,
  IonNote,
  IonList,
} from "@ionic/react";
import { createOutline, mapOutline, trashOutline } from "ionicons/icons";
import { Anchor, convertDBAnchorToFlatAnchor, DBAnchor } from "../../types/types";
import { useContext, useRef, useState } from "react";
import { AnchorContext } from "../../anchorContext";

export const ViewAnchorModal = ({
  showView,
  setShowView,
  showViewAnchorID,
}: {
  showView: boolean;
  setShowView: React.Dispatch<React.SetStateAction<boolean>>;
  showViewAnchorID: string;
}) => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor | undefined>();

  const viewModal = useRef<HTMLIonModalElement>(null); // reference for the viewModal

  const filteredAnchors = anchors.filter((anchor) => anchor.id === showViewAnchorID);

  return (
    <IonModal
      ref={viewModal}
      isOpen={showView}
      initialBreakpoint={0.3}
      breakpoints={[0, 0.3, 1]}
      handleBehavior="cycle"
      onIonModalDidDismiss={() => {
        setShowView(false);
      }}
    >
      <IonList>
        {showViewAnchorID && // If there is no Event ID (e.g. on App Launch) this content should not render
          filteredAnchors.map((anchor, index) => (
            <IonCard
              key={index}
              style={{ cursor: "pointer" }}
              onClick={() => viewModal.current?.setCurrentBreakpoint(1)}
            >
              <IonItemSliding>
                <IonItem
                  lines="none"
                  id={"open-modal-" + index}
                  onClick={() => {
                    setModalData(convertDBAnchorToFlatAnchor(anchor as DBAnchor));
                    setOpenModal(true);
                  }}
                >
                  <IonLabel>
                    <div style={{ fontWeight: 700, color: "black" }}>
                      {anchor.anchor_name}
                    </div>
                    <IonNote class="ion-text-wrap">
                      {anchor.loc_description
                        ? `${anchor.loc_description}`
                        : "Keine Beschreibung vorhanden"}{" "}
                      <br />
                      {anchor.start_at &&
                        anchor.end_at &&
                        `Start: ${new Date(anchor.start_at).toLocaleString()} `}
                      <br />
                      {anchor.start_at &&
                        anchor.end_at &&
                        `Ende: ${new Date(anchor.end_at).toLocaleString()}`}
                      <br />
                      {(anchor.room_id || anchor.campus_id || anchor.faculty_name) &&
                        `Ort: ${anchor.room_id || ""} ${
                          anchor.room_id && (anchor.faculty_name || anchor.campus_id)
                            ? ", "
                            : ""
                        }${anchor.faculty_name || ""} ${
                          anchor.faculty_name && anchor.campus_id ? ", " : ""
                        }${anchor.campus_id || ""}`}
                    </IonNote>
                  </IonLabel>
                </IonItem>
                <>
                  <IonButton>
                    <IonIcon icon={createOutline} size="small" />
                  </IonButton>
                  <IonButton>
                    <IonIcon icon={mapOutline} size="small" />
                  </IonButton>
                  <IonButton>
                    <IonIcon icon={trashOutline} size="small" />
                  </IonButton>
                </>
              </IonItemSliding>
            </IonCard>
          ))}
      </IonList>
    </IonModal>
  );
};
