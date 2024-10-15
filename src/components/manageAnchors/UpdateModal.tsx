import { Anchor, convertFlatAnchorToDBAnchor } from "../../types/types";
import { useContext } from "react";
import {
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
  IonButton,
  IonModal,
  IonFooter,
  IonIcon,
  IonText,
  IonItem,
  IonInput,
  IonItemDivider,
  IonTextarea,
} from "@ionic/react";
import { closeOutline, trashOutline } from "ionicons/icons";
import { AnchorContext } from "../../anchorContext";

export const UpdateModal = ({
  modalData,
  setModalData,
  openUpdateModal,
  setOpenUpdateModal,
}: {
  modalData: Anchor;
  setModalData: (anchor: Anchor) => void;
  openUpdateModal: boolean;
  setOpenUpdateModal: (openUpdateModal: boolean) => void;
}) => {
  const { updateOneAnchor } = useContext(AnchorContext);
  const { deleteOneAnchor } = useContext(AnchorContext);

  // List of all possible fields
  const fieldKeys: (keyof Anchor)[] = [
    "id",
    "anchor_name",
    "anchor_description",
    "tags",
    "attachments",
    "created_at",
    "updated_at",
    "start_at",
    "end_at",
    "valid_from",
    "valid_until",
    "lat",
    "lon",
    "alt",
    "campus_id",
    "address_string",
    "building_id",
    "faculty_name",
    "floor_nr",
    "room_id",
    "loc_description",
    "loc_description_imgs",
    "ar_anchor_id",
    "group_id",
    "prev_anchor_id",
    "next_anchor_id",
    "private_anchor",
  ];

  // Function to handle changes
  const handleChange = (key: keyof Anchor, value: Anchor[keyof Anchor]) => {
    setModalData({ ...modalData, [key]: value });
  };

  // Function to render fields
  const renderField = (key: keyof Anchor, value: Anchor[keyof Anchor]) => {
    let inputElement: JSX.Element | JSX.Element[];
    if (typeof value === "number") {
      inputElement = (
        <IonInput
          label={key}
          labelPlacement="floating"
          type={"number"}
          value={value}
          onIonInput={(e) => {
            if (e.detail.value) handleChange(key, parseFloat(e.detail.value));
          }}
        />
      );
    } else if (key === "attachments" && Array.isArray(value)) {
      inputElement = value?.map((a) => {
        return (
          <a
            style={{ color: "blue" }}
            key={String(a)}
            href={String(a)}
            target="_blank"
            rel="noreferrer"
          >
            {a}
          </a>
        );
      });
    } else {
      inputElement = (
        <IonTextarea
          autoGrow={true}
          rows={1}
          label={key}
          labelPlacement="floating"
          value={value !== undefined && value !== null ? value.toString() : ""}
          onIonInput={(e) => {
            if (e.detail.value) handleChange(key, e.detail.value);
          }}
        />
      );
    }
    return <IonItem key={key}>{inputElement}</IonItem>;
  };

  return (
    <IonModal isOpen={openUpdateModal} onWillDismiss={() => setOpenUpdateModal(false)}>
      <IonHeader>
        <IonToolbar>
          <IonTitle style={{ textAlign: "center" }}>Anker bearbeiten</IonTitle>
          <IonButton
            slot="end"
            fill="clear"
            onClick={(e) => {
              setOpenUpdateModal(false);
              e.stopPropagation();
            }}
          >
            <IonIcon color="black" icon={closeOutline} size="large"></IonIcon>
          </IonButton>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding ion-text-wrap">
        {/* Render all fields */}
        {fieldKeys.map((key) => renderField(key, modalData[key]))}

        <IonButton
          fill="clear"
          color="danger"
          onClick={() => {
            deleteOneAnchor(modalData.id);
            setOpenUpdateModal(false);
          }}
        >
          <IonIcon aria-hidden="true" icon={trashOutline} /> Delete Anchor
        </IonButton>
        <IonItemDivider />
        <br />
        <IonText color="medium">ID: {modalData.id}</IonText>
        <br />
        <IonText color="medium">Owner ID: {modalData.owner_id}</IonText>
        <br />
        <IonText color="medium">Created: {modalData.created_at}</IonText>
        <br />
        <IonText color="medium">Updated: {modalData.updated_at}</IonText>
      </IonContent>
      <IonFooter style={{ display: "flex", justifyContent: "center" }}>
        <IonButton
          strong={true}
          onClick={(e) => {
            // Convert from flat to nested for DB update
            updateOneAnchor(convertFlatAnchorToDBAnchor(modalData));
            setOpenUpdateModal(false);
            e.stopPropagation();
          }}
        >
          Speichern
        </IonButton>
      </IonFooter>
    </IonModal>
  );
};
