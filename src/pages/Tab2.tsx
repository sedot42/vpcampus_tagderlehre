import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonItem,
  IonList,
  IonModal,
  IonButtons,
  IonInput,
} from "@ionic/react";
import { Anchor } from "../types/types";
import React, { useState, useRef } from "react";
import { delete_mutation, update_mutation } from "../requests/mutations";
import { query } from "../requests/queries";
import UpdateAnchor from "./UpdateAnchor";
import { OverlayEventDetail } from "@ionic/core/components";
import { UpdateModal } from "../components/UpdateModal";

const Tab2 = ({
  anchors,
  setAnchors,
}: {
  anchors: Anchor[];
  setAnchors: (anchors: Anchor[]) => void;
}) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const defaultAnchor = { id: "", anchor_name: "", owner_id: "" };
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor>(defaultAnchor);

  const [message, setMessage] = useState(
    "This modal example uses triggers to automatically open a modal when the button is clicked."
  );

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === "confirm") {
      setMessage(`Hello, ${ev.detail.data}!`);
    }
  }

  //const [anchorId, setAnchorId] = useState("");
  //const [ownerId, setOwnerId] = useState("");
  //const [editingAnchor, setEditingAnchor] = useState(null)

  const getAnchors = () => {
    fetch("http://localhost:5000/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((res) => setAnchors(res.data.anchors));
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div>
          <IonButton onClick={getAnchors}>Read Anchor</IonButton>
        </div>

        <IonList>
          {anchors &&
            anchors.length > 0 &&
            anchors.map((anchor, index) => (
              <IonItem key={index}>
                <IonLabel>
                  {anchor.anchor_name} from {anchor.owner_id} and id {anchor.id}
                </IonLabel>
                <IonButton
                  onClick={() => {
                    fetch("http://localhost:5000/", {
                      method: "POST",
                      headers: {
                        "Content-Type": "application/json",
                      },

                      body: JSON.stringify({
                        query: delete_mutation,
                        variables: {
                          deleteAnchorId: anchor.id,
                        },
                      }),
                    })
                      .then((res) => res.json())
                      .then(() => getAnchors());
                  }}
                >
                  Delete me
                </IonButton>

                <IonButton
                  id={"open-modal-" + index}
                  expand="block"
                  onClick={() => {
                    setModalData(anchor);
                    setOpenModal(true);
                  }}
                >
                  Update me
                </IonButton>

              </IonItem>
            ))}

          {/* Needs to be outside of mapping function and gets populated with the data from the row where the update button has been clicked (via setModalData): */}
          <UpdateModal
            anchor={modalData}
            openModal={openModal}
            setOpenModal={setOpenModal}
          />
        </IonList>
      </IonContent>
    </IonPage>
  );
};

export default Tab2;
