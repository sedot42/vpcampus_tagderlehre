/* eslint-disable no-nested-ternary */
import { useState, useContext } from "react";
import {
  IonIcon,
  IonLabel,
  IonItem,
  IonList,
  IonNote,
  IonCard,
  IonItemOptions,
  IonItemOption,
  IonItemSliding,
} from "@ionic/react";

import { pin, trash, share } from "ionicons/icons";

import { Anchor, convertDBAnchorToFlatAnchor, DBAnchor } from "../../types/types";
import { UpdateModal } from "./UpdateModal";
import { AnchorContext } from "../../anchorContext";

type AnchorListProps = {
  filteredAnchors: DBAnchor[];
  searchQuery: string;
};

export const AnchorList = ({ filteredAnchors, searchQuery }: AnchorListProps) => {
  const { deleteOneAnchor } = useContext(AnchorContext);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor | undefined>();

  return (
    <IonList>
      {filteredAnchors.length > 0 ? (
        filteredAnchors.map((anchor, index) => (
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
        ))
      ) : searchQuery.trim() !== "" ? (
        <IonItem>No matching anchors found</IonItem>
      ) : null}
      {/* Update modal */}
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
  );
};
