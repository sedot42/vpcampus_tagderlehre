/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useState, useContext, useMemo, useEffect } from "react";
import {
  IonPage,
  IonContent,
  IonIcon,
  IonLabel,
  IonButton,
  IonItem,
  IonList,
  IonNote,
  IonSearchbar,
  IonListHeader,
  IonItemDivider,
} from "@ionic/react";
import { trashOutline, build, timeOutline, closeCircleOutline } from "ionicons/icons";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { Anchor, convertDBAnchorToFlatAnchor } from "../../types/types";
import { UpdateModal } from "./UpdateModal";
import { get, update, del } from "idb-keyval";
import Fuse from "fuse.js";
import { mockState } from "../../mockState"; // Import mockState

export const ManageAnchorComponent: React.FC = () => {
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Anchor[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Extract keys dynamically from the first item in mockState
  const keys = mockState.length > 0 ? Object.keys(mockState[0]) : [];

  useEffect(() => {
    get("searchHistory").then((history) => {
      if (history) setSearchHistory(history);
    });
  }, []);

  const fuse = useMemo(
    () =>
      new Fuse(anchors, {
        keys: keys, // Use dynamically extracted keys
        threshold: 0.8,
        includeScore: true,
      }),
    [anchors, keys]
  );

  const filteredAnchors = useMemo(() => {
    if (searchQuery.trim() === "") return anchors;

    const searchTerms = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);
    const searchPattern = searchTerms.map((term) => `'${term}`).join(" ");

    const results = fuse.search(searchPattern);
    return results.map((result) => result.item);
  }, [anchors, searchQuery, fuse]);

  const handleSearch = (event: CustomEvent) => {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value || "";
    setSearchQuery(query);
    setShowHistory(false);

    if (query.trim() === "") {
      setSuggestions([]);
    } else {
      const searchTerms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 0);
      const searchPattern = searchTerms.map((term) => `'${term}`).join(" ");

      const results = fuse.search(searchPattern);
      const uniqueSuggestions = Array.from(new Set(results.map((result) => result.item)))
        .slice(0, 5)
        .map(convertDBAnchorToFlatAnchor);
      setSuggestions(uniqueSuggestions);
    }
  };

  const handleSearchFocus = () => {
    setShowHistory(true);
  };

  const addToSearchHistory = (query: string) => {
    if (query.trim() !== "") {
      update("searchHistory", (history: string[] = []) => {
        const newHistory = [query, ...history.filter((item) => item !== query)].slice(
          0,
          5
        );
        setSearchHistory(newHistory);
        return newHistory;
      });
    }
  };

  const handleSearchSubmit = (event: CustomEvent) => {
    event.preventDefault();
    addToSearchHistory(searchQuery);
    setShowHistory(false);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    del("searchHistory");
  };

  return (
    <IonPage>
      <StatusHeader titleText="Verwalten" />
      <IonContent fullscreen>
        <IonSearchbar
          value={searchQuery}
          onIonInput={handleSearch}
          onIonFocus={handleSearchFocus}
          onIonChange={handleSearchSubmit}
          placeholder="Search anchors..."
        />
        {showHistory && searchHistory.length > 0 && (
          <IonList>
            <IonListHeader>
              <IonLabel>Search History</IonLabel>
              <IonButton fill="clear" color="danger" onClick={clearSearchHistory}>
                <IonIcon aria-hidden="true" icon={closeCircleOutline} />
                Clear History
              </IonButton>
            </IonListHeader>
            {searchHistory.map((item, index) => (
              <IonItem
                key={index}
                button
                onClick={() => {
                  setSearchQuery(item);
                  setShowHistory(false);
                }}
              >
                <IonIcon icon={timeOutline} slot="start" />
                <IonLabel>{item}</IonLabel>
              </IonItem>
            ))}
            <IonItemDivider />
          </IonList>
        )}
        {suggestions.length > 0 && (
          <IonList>
            <IonListHeader>
              <IonLabel>Suggestions</IonLabel>
            </IonListHeader>
            {suggestions.map((suggestion, index) => (
              <IonItem
                key={index}
                button
                onClick={() => {
                  setSearchQuery(suggestion.anchor_name);
                  setSuggestions([]);
                  addToSearchHistory(suggestion.anchor_name);
                }}
              >
                <IonLabel>{suggestion.anchor_name}</IonLabel>
              </IonItem>
            ))}
            <IonItemDivider />
          </IonList>
        )}
        <IonList>
          {filteredAnchors.length > 0 ? (
            filteredAnchors.map((anchor, index) => (
              <IonItem key={index}>
                <IonLabel>
                  <div style={{ fontWeight: 700, padding: "6px 0" }}>
                    {anchor.anchor_name}
                  </div>
                  <IonNote color="medium">
                    Von: TEST {anchor.owner.id}
                    <br />
                    Um: {anchor.created_at || "-"}
                  </IonNote>
                </IonLabel>
                <IonButton
                  id={"open-modal-" + index}
                  expand="block"
                  color="primary"
                  fill="clear"
                  onClick={() => {
                    setModalData(convertDBAnchorToFlatAnchor(anchor));
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
            ))
          ) : searchQuery.trim() !== "" ? (
            <IonItem>No matching anchors found</IonItem>
          ) : null}
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
