import { useState, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonLabel,
  IonButton,
  IonItem,
  IonList,
  IonNote,
} from "@ionic/react";
import { trashOutline, build } from "ionicons/icons";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";

import { Anchor } from "../../types/types";
import { UpdateModal } from "./UpdateModal";

export const ManageAnchorComponent = () => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor>();

  return (
    <IonPage>
      <StatusHeader titleText="Verwalten" />
      <IonContent fullscreen>
        <IonList>
          {anchors &&
            anchors.length > 0 &&
            anchors.map((anchor, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <div style={{ fontWeight: 700, padding: "6px 0" }}>
                    {anchor.anchor_name}
                  </div>
                  <IonNote color="medium">
                    Von: {anchor.owner_id}
                    <br />
                    Um: {anchor.created_at || "-"}
                  </IonNote>
                </IonLabel>

                <IonButton
                  id={"open-modal-" + index}
                  expand="block"
                  color="primary"
                  fill="clear"
                  onClick={() => {
                    setModalData(anchor);
                    setOpenModal(true);
                  }}
                >
                  <IonIcon aria-hidden="true" icon={build} />
                </IonButton>
                <IonButton
                  fill="clear"
                  color="danger"
                  onClick={() => {
                    deleteOneAnchor(anchor.id);
                  }}
                >
                  <IonIcon aria-hidden="true" icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}
          {modalData && (
            <UpdateModal
              modalData={modalData}
              setModalData={setModalData}
              openModal={openModal}
              setOpenModal={setOpenModal}
            />
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
