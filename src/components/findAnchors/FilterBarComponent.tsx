import { IonRow } from "@ionic/react";
import {
  IonButton,
  IonIcon,
  IonContent,
  IonPopover,
  IonSearchbar,
} from "@ionic/react";
import {
  arrowUpOutline,
  arrowDownOutline,
  swapVerticalOutline,
  search,
} from "ionicons/icons";
import { SortState, SORT } from "./FindAnchorsComponent";

type FilterBarProp = {
  setSort: (param: keyof SortState) => void;
  setSearchTerm: (searchTerm: string) => void;
  sortState: SortState;
};

export const FilterBar = ({
  setSort,
  sortState,
  setSearchTerm,
}: FilterBarProp) => {
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
        padding: "4px",
        width: "100%",
        textAlign: "center",
        backgroundColor: "white",
        borderBottom: `1px solid #D0D0D0`,
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div>
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
      <div style={{ marginRight: 4 }}>
        <IonButton
          id="search-trigger"
          size="small"
          fill="clear"
          onClick={() => setSort("owner_id")}
        >
          Suche
          <IonIcon slot="end" icon={search}></IonIcon>
        </IonButton>
        <IonPopover trigger="search-trigger" triggerAction="hover">
          <IonContent class="ion-padding">
            <IonSearchbar
              debounce={100}
              onIonInput={(e) => setSearchTerm(e.target.value || "")}
              placeholder="Suche"
              style={{ padding: 0 }}
            ></IonSearchbar>
          </IonContent>
        </IonPopover>
      </div>
    </IonRow>
  );
};
