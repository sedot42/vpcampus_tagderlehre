import { useState, useRef, useContext, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonLabel,
  IonToolbar,
  IonButton,
  IonItem,
  IonList,
  IonNote,
  IonText,
} from "@ionic/react";
import { trashOutline, build } from "ionicons/icons";
import { StatusHeader } from "../globalUI/StatusHeader";
import { create_mutation, delete_mutation } from "../../requests/mutations";
import { AnchorContext } from "../../context";

import { Anchor } from "../../types/types";
import { UpdateModal } from "./UpdateModal";
import { defaultAnchor } from "../../types/defaults";

export const ManageAnchorComponent = () => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);
  const modal = useRef<HTMLIonModalElement>(null);

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor>(defaultAnchor);
  console.log(anchors);

  return (
    <IonPage>
      <StatusHeader titleText="Anker verwalten" />
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
                    deleteOneAnchor(anchor);
                  }}
                >
                  <IonIcon aria-hidden="true" icon={trashOutline} />
                </IonButton>
              </IonItem>
            ))}

          {/* Needs to be outside of mapping function and gets populated with the data from the row where the update button has been clicked (via setModalData): */}
          <UpdateModal
            modalData={modalData}
            setModalData={setModalData}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};
