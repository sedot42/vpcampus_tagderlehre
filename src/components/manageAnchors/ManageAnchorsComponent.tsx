/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useState, useContext } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonLabel,
  IonItem,
  IonNote,
  IonCard,
  IonItemOptions,
  IonItemOption,
  IonItemSliding,
  IonFab,
  IonFabButton,
} from "@ionic/react";
import { pin, trash, share, addOutline } from "ionicons/icons";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { Anchor, convertDBAnchorToFlatAnchor, DBAnchor } from "../../types/types";
import { UpdateModal } from "./UpdateModal";
import { UniversalSearchBar } from "../globalUI/UniversalSearchBar";

export const ManageAnchorsComponent = ({
  setShowCreate,
}: {
  setShowCreate: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor | undefined>();
  return (
    <IonPage>
      <StatusHeader titleText="Übersicht" />

      <IonContent fullscreen>
        <IonFab vertical="bottom" horizontal="end" slot="fixed">
          <IonFabButton onClick={() => setShowCreate(true)}>
            <IonIcon icon={addOutline}></IonIcon>
          </IonFabButton>
        </IonFab>

        <UniversalSearchBar
          entitiesToBeSearched={anchors}
          historyKeyName={"searchHistoryAnchors"}
          titlePropertyName={"anchor_name"}
          renderItem={(anchor, index) => (
            <IonCard key={index} style={{ cursor: "pointer" }}>
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
          )}
        />

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
      </IonContent>
    </IonPage>
  );
};
