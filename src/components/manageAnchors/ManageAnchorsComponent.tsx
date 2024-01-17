import { useState, useRef, useContext, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonLabel,
  IonButton,
  IonItem,
  IonList,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { create_mutation, delete_mutation } from "../../requests/mutations";
import { query } from "../../requests/queries";
import { Anchor } from "../../types/types";
import { UpdateModal } from "../../components/UpdateModal";

type ManageAnchorProps = {
  anchors: Anchor[];
  setAnchors: (anchors: Anchor[]) => void;
};

export const ManageAnchorComponent = ({
  anchors,
  setAnchors,
}: ManageAnchorProps) => {
  const modal = useRef<HTMLIonModalElement>(null);

  const defaultAnchor = { id: "", anchor_name: "", owner_id: "" };
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor>(defaultAnchor);

  const [message, setMessage] = useState(
    "This modal example uses triggers to automatically open a modal when the button is clicked."
  );

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
      .then((res) => setAnchors(res.data.anchors))
      .catch((e) => {
        console.log(e);
        setAnchors([defaultAnchor]);
      });
  };

  useEffect(() => {
    getAnchors();
  }, []);

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
