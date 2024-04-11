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
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { FilterBar } from "./FilterBarComponent";
import { AnchorContext } from "../../context";

export enum SORT {
  ASC = "ASC",
  DSC = "DSC",
  NONE = "NONE",
}

// created_at muss später in Startzeitpunkt geändert werden
export type SortState = {
  anchor_name: SORT;
  owner_id: SORT;
  created_at: SORT;
};

const defaultSortState = {
  anchor_name: SORT.NONE,
  owner_id: SORT.NONE,
  created_at: SORT.NONE,
};

export const FindAnchorComponent = () => {
  const { anchors } = useContext(AnchorContext);
  const [sortState, setSortState] = useState<SortState>(defaultSortState);

  const setSort = (param: keyof typeof sortState) => {
    const newParam =
      sortState[param] === SORT.NONE
        ? SORT.DSC
        : sortState[param] === SORT.DSC
        ? SORT.ASC
        : SORT.NONE;
    setSortState(() => ({ ...defaultSortState, [param]: newParam }));
  };

  const sortedAnchors = () => {
    const param: keyof SortState = Object.keys(sortState).find(
      (key) => sortState[key as keyof typeof sortState] !== SORT.NONE
    ) as keyof SortState;

    if (!param) {
      return anchors;
    }
    if (param === "created_at") {
      return sortState[param] === SORT.DSC
        ? anchors.sort(
            (a, b) =>
              Date.parse(a[param] as string) - Date.parse(b[param] as string)
          )
        : anchors.sort(
            (a, b) =>
              Date.parse(b[param] as string) - Date.parse(a[param] as string)
          );
    } else {
      return sortState[param] === SORT.DSC
        ? anchors.sort((a, b) => a[param].localeCompare(b[param]))
        : anchors.sort((a, b) => b[param].localeCompare(a[param]));
    }
  };

  return (
    <IonPage>
      <StatusHeader titleText="Anker finden" />
      <FilterBar setSort={setSort} sortState={sortState} />
      <IonContent fullscreen>
        <IonList>
          {anchors &&
            anchors.length > 0 &&
            sortedAnchors().map((anchor, index) => (
              <IonCard key={index}>
                <IonCardHeader>
                  <IonCardTitle>{anchor.anchor_name || "-"}</IonCardTitle>
                  <IonCardSubtitle> {anchor.owner_id || "-"}</IonCardSubtitle>
                  <IonCardSubtitle> {anchor.created_at || "-"}</IonCardSubtitle>
                </IonCardHeader>

                <IonCardContent>
                  Here's a small text description for the card content. Nothing
                  more, nothing less.
                </IonCardContent>
              </IonCard>
            ))}
        </IonList>
      </IonContent>
    </IonPage>
  );
};
