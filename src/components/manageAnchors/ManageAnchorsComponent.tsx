import { useState, useContext, useMemo } from "react"; // importing hooks from React
import {
  IonPage,
  IonContent,
  IonIcon,
  IonLabel,
  IonButton,
  IonItem,
  IonList,
  IonNote,
  IonSearchbar, // import the search bar component
} from "@ionic/react"; // Importing various Ionic React components that will be used in this component
import { trashOutline, build } from "ionicons/icons"; //imports specific wrench and trash bin icons from ionicons library
import { StatusHeader } from "../globalUI/StatusHeader"; // imports a custom "StatusHeader" component
import { AnchorContext } from "../../anchorContext"; // imports "AnchorContext" which likely provides anchor-related data and functions

import { Anchor, convertDBAnchorToFlatAnchor } from "../../types/types"; // imports the "Anchor" type and a conversion function
import { UpdateModal } from "./UpdateModal"; // imports the "updateModal" component

export const ManageAnchorComponent = () => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext); // uses the "usecontext" hook to extract anchors and deleteOneAnchor from AnchorContext

  const [openModal, setOpenModal] = useState(false); // a state variable "openModal" for controlling the modal visibility
  const [modalData, setModalData] = useState<Anchor>(); // a state variable "modalData" for storing the anchor data to be updated
  const [searchQuery, setSearchQuery] = useState(""); // added a new state variable "searchQuery"

  // Filter anchors based on a search query
  const filteredAnchors = useMemo(() => {
    return anchors.filter((anchor) =>
      Object.values(anchor).some((value) =>
        String(value).toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [anchors, searchQuery]);

  const handleSearch = (event: CustomEvent) => {
    const target = event.target as HTMLIonSearchbarElement;
    setSearchQuery(target.value || "");
  };

  return (
    <IonPage>
      <StatusHeader titleText="Verwalten" />
      <IonContent fullscreen>
        <IonSearchbar>
          value={searchQuery}
          onIonChange={handleSearch}
          placeholder= Search anchors...
        </IonSearchbar>

        <IonList>
          {anchors &&
            anchors.length > 0 &&
            anchors.map((anchor, index) => (
              <IonItem key={index}>
                {/* <IonLabel>
                  <div style={{ fontWeight: 700, padding: "6px 0" }}>
                    {anchor.anchor_name}
                  </div>
                  <IonNote color="medium">
                    Von: TEST {anchor.owner.id}
                    <br />
                    Um: {anchor.created_at || "-"}
                  </IonNote>
                </IonLabel>
                */}
                <IonButton
                  id={"open-modal-" + index}
                  expand="block"
                  color="primary"
                  fill="clear"
                  onClick={() => {
                    setModalData(convertDBAnchorToFlatAnchor(anchor)); //An update button; when clicked sets the ModalData and opens the modal
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
