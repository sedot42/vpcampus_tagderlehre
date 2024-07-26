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
  IonCard,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonItemOptions,
  IonItemOption,
  IonItemSliding,
  IonItemDivider,
  IonSearchbar,
} from "@ionic/react";
import {
  trashOutline,
  build,
  closeOutline,
  addCircleOutline,
  informationCircleOutline,
  pin,
  trash,
  share,
} from "ionicons/icons";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";

import { Anchor, convertDBAnchorToFlatAnchor } from "../../types/types";
import { UpdateModal } from "./UpdateModal";

export const ManageAnchorComponent = () => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor>();
  console.log(openModal, modalData);

  return (
    <IonPage>
      <StatusHeader titleText="Übersicht" />
      <IonContent fullscreen>
        <IonToolbar>
          <IonTitle slot="start">Filteroptionen</IonTitle>
          <IonButtons slot="end">
            <IonButton>
              <IonIcon icon={closeOutline} size="large"></IonIcon>
              {/* CONTENT TO BE DEFINED BY OTHER HACKATHON GROUP */}
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonSearchbar></IonSearchbar>
        <IonList>
          {anchors &&
            anchors.length > 0 &&
            anchors.map((anchor, index) => (
              <IonCard key={index}>
                <IonItemSliding>
                  <IonItem
                    lines="none"
                    id={"open-modal-" + index}
                    onClick={() => {
                      setModalData(convertDBAnchorToFlatAnchor(anchor));
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
                          `Start: ${new Date(
                            anchor.start_at
                          ).toLocaleString()}  Ende: ${new Date(
                            anchor.end_at
                          ).toLocaleString()}`}
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
                  <IonItemOptions slot="end">
                    <IonItemOption color="warning">
                      <IonIcon slot="icon-only" icon={pin}></IonIcon>
                    </IonItemOption>
                    <IonItemOption color="tertiary">
                      <IonIcon slot="icon-only" icon={share}></IonIcon>
                    </IonItemOption>
                    <IonItemOption color="danger">
                      <IonIcon
                        slot="icon-only"
                        icon={trash}
                        onClick={() => {
                          deleteOneAnchor(anchor.id);
                        }}
                      ></IonIcon>
                    </IonItemOption>
                  </IonItemOptions>
                </IonItemSliding>
              </IonCard>
            ))}
          {modalData && (
            <>
              <UpdateModal
                modalData={modalData}
                setModalData={setModalData}
                openModal={openModal}
                setOpenModal={setOpenModal}
              />
            </>
          )}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
