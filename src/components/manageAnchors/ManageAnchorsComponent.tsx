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
import {
  trashOutline,
  build,
  ellipse,
  searchOutline,
  settingsOutline,
  square,
  triangle,
} from "ionicons/icons";
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
                  <IonIcon aria-hidden="true" icon={trashOutline} />
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
