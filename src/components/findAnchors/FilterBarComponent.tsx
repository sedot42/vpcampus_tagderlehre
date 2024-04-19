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
  star,
  starOutline
} from "ionicons/icons";
import { SortState, SORT } from "./FindAnchorsComponent";

type FilterBarProp = {
  filterByBookmarked: boolean;
  setFilterByBookmarked: (filterByBookmarked: boolean) => void;
  setSort: (param: keyof SortState) => void;
  setSearchTerm: (searchTerm: string) => void;
  sortState: SortState;
};
const sortStateToIconMap: { [key in SORT]: string } = {
  ASC: arrowUpOutline,
  DSC: arrowDownOutline,
  NONE: swapVerticalOutline,
};

export const FilterBar = ({
  setFilterByBookmarked,
  filterByBookmarked,
  setSort,
  sortState,
  setSearchTerm,
}: FilterBarProp) => {
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
          shape="round"
          fill="clear"
          onClick={() => setFilterByBookmarked(!filterByBookmarked)}
        >
          <IonIcon
            slot="icon-only"
            size="small"
            icon={filterByBookmarked ? star : starOutline}
          ></IonIcon>
        </IonButton>
        <IonButton
          size="small"
          fill={sortState["created_at"] === SORT.NONE ? "clear" : "solid"}
          onClick={() => setSort("created_at")}
        >
          <IonIcon
            slot="end"
            icon={sortStateToIconMap[sortState["created_at"]]}
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
            icon={sortStateToIconMap[sortState["anchor_name"]]}
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
            icon={sortStateToIconMap[sortState["owner_id"]]}
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
