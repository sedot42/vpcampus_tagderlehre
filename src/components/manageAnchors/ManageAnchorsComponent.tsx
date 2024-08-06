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
import Fuse from "fuse.js"; // Import Fuse.js for fuzzy search

export const ManageAnchorComponent: React.FC = () => {
  // Context and state declarations
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);

  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor | undefined>();
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Anchor[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load search history when component mounts
  useEffect(() => {
    get("searchHistory").then((history) => {
      if (history) setSearchHistory(history);
    });
  }, []);

  // Configure Fuse.js options for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(anchors, {
        keys: ["anchor_name"], // Fields to search in
        threshold: 0.6, // Adjust the threshold for fuzziness (0.0 = perfect match, 1.0 = match anything)
      }),
    [anchors]
  );

  // Filter anchors based on search query using Fuse.js
  const filteredAnchors = useMemo(() => {
    const terms = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);
    if (terms.length === 0) return anchors;

    // Collect results for each term and merge
    const results = terms.flatMap((term) => fuse.search(term).map(({ item }) => item));

    // Remove duplicates
    const uniqueResults = Array.from(new Set(results));

    return uniqueResults;
  }, [anchors, searchQuery, fuse]);

  // Handle search input change
  const handleSearch = (event: CustomEvent) => {
    const target = event.target as HTMLIonSearchbarElement;
    const query = target.value || "";
    setSearchQuery(query);
    setShowHistory(false);

    if (query.trim() === "") {
      setSuggestions([]);
    } else {
      const terms = query
        .toLowerCase()
        .split(/\s+/)
        .filter((term) => term.length > 0);
      const results = terms.flatMap((term) => fuse.search(term).map(({ item }) => item));
      const uniqueSuggestions = Array.from(new Set(results))
        .slice(0, 5)
        .map(convertDBAnchorToFlatAnchor);
      setSuggestions(uniqueSuggestions);
    }
  };

  // Show search history when the search bar is focused
  const handleSearchFocus = () => {
    setShowHistory(true);
  };

  // Add a search query to search history
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

  // Handle search form submission
  const handleSearchSubmit = (event: CustomEvent) => {
    event.preventDefault();
    addToSearchHistory(searchQuery);
    setShowHistory(false);
  };

  // Clear search history
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
