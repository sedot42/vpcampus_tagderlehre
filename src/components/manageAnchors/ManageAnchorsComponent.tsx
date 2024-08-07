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
  IonCard,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonListHeader,
  IonItemOptions,
  IonItemOption,
  IonItemSliding,
  IonItemDivider,
  IonSearchbar,
} from "@ionic/react";
import {
  trashOutline,
  build,
  closeOutline,
  closeCircleOutline,
  addCircleOutline,
  informationCircleOutline,
  timeOutline,
  pin,
  trash,
  share,
} from "ionicons/icons";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../anchorContext";
import { Anchor, convertDBAnchorToFlatAnchor } from "../../types/types";
import { UpdateModal } from "./UpdateModal";
import { get, update, del } from "idb-keyval";
import Fuse from "fuse.js";
import { mockState } from "../../mockState"; // Import mockState

export const ManageAnchorComponent: React.FC = () => {
  // Context and state initialization
  const { anchors, deleteOneAnchor } = useContext(AnchorContext);
  const [openModal, setOpenModal] = useState(false);
  const [modalData, setModalData] = useState<Anchor | undefined>();
  console.log(openModal, modalData);
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Anchor[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Extract keys dynamically from the first item in mockState
  const keys = mockState.length > 0 ? Object.keys(mockState[0]) : [];

  // Load search history from IndexedDB on component mount
  useEffect(() => {
    get("searchHistory").then((history) => {
      if (history) setSearchHistory(history);
    });
  }, []);

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(anchors, {
        keys: keys, // Use dynamically extracted keys
        threshold: 0.9,
        includeScore: true,
      }),
    [anchors, keys]
  );

  // Filter anchors based on search query
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

  // Handle search input
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

  // Show search history when search bar is focused
  const handleSearchFocus = () => {
    setShowHistory(true);
  };

  // Add search query to history
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

  // Handle search submission
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
      <StatusHeader titleText="Übersicht" />
      <IonContent fullscreen>
        {/* Search bar */}
        <IonSearchbar
          value={searchQuery}
          onIonInput={handleSearch}
          onIonFocus={handleSearchFocus}
          onIonChange={handleSearchSubmit}
          placeholder="Search anchors..."
        />

        {/* Search history */}
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

        {/* Search suggestions */}
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
      </IonContent>
    </IonPage>
  );
};
