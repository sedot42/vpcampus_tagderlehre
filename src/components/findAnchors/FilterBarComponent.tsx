import { IonRow } from "@ionic/react";
import { IonButton, IonIcon } from "@ionic/react";
import {
  arrowUpOutline,
  arrowDownOutline,
  swapVerticalOutline,
} from "ionicons/icons";
import { SortState, SORT } from "./FindAnchorsComponent";

type FilterBarProp = {
  setSort(param: keyof SortState): void;
  sortState: SortState;
};

export const FilterBar = ({ setSort, sortState }: FilterBarProp) => {
  const renderArrow = (param: SORT) =>
    param === SORT.ASC
      ? arrowUpOutline
      : param === SORT.DSC
      ? arrowDownOutline
      : swapVerticalOutline;

  return (
    <IonRow
      style={{
        zIndex: 2,
        padding: 12,
        width: "100%",
        textAlign: "center",
        backgroundColor: "white",
        borderBottom: `1px solid grey`,
      }}
    >
      <div style={{ width: "100%", padding: "0px 2px" }}>
        <IonButton
          size="small"
          fill={sortState["created_at"] === SORT.NONE ? "clear" : "solid"}
          onClick={() => setSort("created_at")}
        >
          <IonIcon
            slot="end"
            icon={renderArrow(sortState["created_at"])}
          ></IonIcon>
          Wann
        </IonButton>
        <IonButton
          size="small"
          fill={sortState["anchor_name"] === SORT.NONE ? "clear" : "solid"}
          onClick={() => setSort("anchor_name")}
        >
          <IonIcon
            slot="end"
            icon={renderArrow(sortState["anchor_name"])}
          ></IonIcon>
          Was
        </IonButton>
        <IonButton
          size="small"
          fill={sortState["owner_id"] === SORT.NONE ? "clear" : "solid"}
          onClick={() => setSort("owner_id")}
        >
          <IonIcon
            slot="end"
            icon={renderArrow(sortState["owner_id"])}
          ></IonIcon>
          Wer
        </IonButton>
      </div>
    </IonRow>
  );
};
