import { useContext, useState } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonButton,
  IonIcon,
} from "@ionic/react";
import { star, starOutline } from "ionicons/icons";
import { StatusHeader } from "../globalUI/StatusHeader";
import { FilterBar } from "./FilterBarComponent";
import { AnchorContext } from "../../anchorContext";
import { UserContext } from "../../userContext";
import {
  Anchor,
  convertDBAnchorToFlatAnchor,
  convertFlatAnchorToDBAnchor,
} from "../../types/types";

export enum SORT {
  ASC = "ASC",
  DSC = "DSC",
  NONE = "NONE",
}
export type SortState = { anchor_name: SORT; created_at: SORT; owner_id: SORT };
const defaultSortState: SortState = {
  anchor_name: SORT.NONE,
  created_at: SORT.NONE,
  owner_id: SORT.NONE,
};
const sortCycleOrder: { [key in SORT]: SORT } = {
  ASC: SORT.DSC,
  DSC: SORT.NONE,
  NONE: SORT.ASC,
};

export const FindAnchorsComponent = () => {
  const { anchors } = useContext(AnchorContext);
  const { bookmarks, createBookmark, deleteBookmark } = useContext(UserContext);
  const [sortState, setSortState] = useState(defaultSortState);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterByBookmarked, setFilterByBookmarked] = useState(false);

  const setSort = (param: keyof typeof sortState) => {
    const newParam = sortCycleOrder[sortState[param]];
    setSortState(() => ({ ...defaultSortState, [param]: newParam }));
  };

  const sortedAnchors = () => {
    const flatAnchors = anchors.map(convertDBAnchorToFlatAnchor);
    let sortedAnchors: Anchor[];
    const param: keyof SortState = Object.keys(sortState).find(
      (key) => sortState[key as keyof typeof sortState] !== SORT.NONE
    ) as keyof SortState;

    if (!param) {
      sortedAnchors = flatAnchors;
    } else if (param === "created_at") {
      sortedAnchors =
        sortState[param] === SORT.DSC
          ? flatAnchors.sort(
              (a, b) => Date.parse(a[param] as string) - Date.parse(b[param] as string)
            )
          : flatAnchors.sort(
              (a, b) => Date.parse(b[param] as string) - Date.parse(a[param] as string)
            );
    } else {
      sortedAnchors =
        sortState[param] === SORT.DSC
          ? flatAnchors.sort((a, b) => a[param].localeCompare(b[param]))
          : flatAnchors.sort((a, b) => b[param].localeCompare(a[param]));
    }
    return sortedAnchors.map((a) => convertFlatAnchorToDBAnchor(a));
  };

  return (
    <IonPage>
      <StatusHeader titleText="Anker finden" />
      <FilterBar
        setFilterByBookmarked={setFilterByBookmarked}
        filterByBookmarked={filterByBookmarked}
        setSort={setSort}
        sortState={sortState}
        setSearchTerm={setSearchTerm}
      />
      <IonContent fullscreen>
        <IonList>
          {anchors &&
            anchors.length > 0 &&
            sortedAnchors()
              .filter(
                (anchor) =>
                  (anchor.anchor_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    anchor.owner.id.toLowerCase().includes(searchTerm.toLowerCase())) &&
                  (!filterByBookmarked || bookmarks.includes(anchor.id))
              )
              .map((anchor, index) => (
                <IonCard key={index}>
                  <IonCardHeader>
                    <IonCardTitle>
                      {anchor.anchor_name || "-"}
                      <IonButton
                        size="small"
                        shape="round"
                        fill="clear"
                        onClick={() =>
                          bookmarks.includes(anchor.id)
                            ? deleteBookmark(anchor.id)
                            : createBookmark(anchor.id)
                        }
                      >
                        <IonIcon
                          slot="icon-only"
                          size="default"
                          icon={bookmarks.includes(anchor.id) ? star : starOutline}
                        ></IonIcon>
                      </IonButton>
                    </IonCardTitle>
                    <IonCardSubtitle> {anchor.owner.id || "-"}</IonCardSubtitle>
                    <IonCardSubtitle>{anchor.created_at || "-"}</IonCardSubtitle>
                  </IonCardHeader>

                  <IonCardContent>
                    Here&apos;s a small text description for the card content. Nothing
                    more, nothing less.
                  </IonCardContent>
                </IonCard>
              ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
