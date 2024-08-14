/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-nested-ternary */
import React, { useState, useMemo, useEffect } from "react";
import {
  IonIcon,
  IonLabel,
  IonButton,
  IonItem,
  IonList,
  IonListHeader,
  IonItemDivider,
  IonSearchbar,
} from "@ionic/react";
import { closeCircleOutline, timeOutline } from "ionicons/icons";
import { Anchor, convertDBAnchorToFlatAnchor, DBAnchor } from "../../types/types";
import { get, update, del } from "idb-keyval";
import Fuse from "fuse.js";
import { mockState } from "../../mockState";

type UniversalSearchBarProps = {
  entitiesToBeSearched: DBAnchor[];
  historyKeyName: string;
  renderItem: (entityToBeSearched: DBAnchor, index: number) => React.ReactElement;
};

export const UniversalSearchBar = ({
  entitiesToBeSearched,
  historyKeyName,
  renderItem,
}: UniversalSearchBarProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<Anchor[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Extract keys dynamically from the first item in mockState
  const keys = mockState.length > 0 ? Object.keys(mockState[0]) : [];

  // Load search history from IndexedDB on component mount
  useEffect(() => {
    get(historyKeyName).then((history) => {
      if (history) setSearchHistory(history);
    });
  }, []);

  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(
    () =>
      new Fuse(entitiesToBeSearched, {
        keys: keys, // Use dynamically extracted keys
        threshold: 0.9,
        includeScore: true,
      }),
    [entitiesToBeSearched, keys]
  );

  // Filter anchors based on search query
  const filteredEntities = useMemo(() => {
    if (searchQuery.trim() === "") return entitiesToBeSearched;

    const searchTerms = searchQuery
      .toLowerCase()
      .split(/\s+/)
      .filter((term) => term.length > 0);
    const searchPattern = searchTerms.map((term) => `'${term}`).join(" ");

    const results = fuse.search(searchPattern);
    return results.map((result) => result.item);
  }, [entitiesToBeSearched, searchQuery, fuse]);

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
      update(historyKeyName, (history: string[] = []) => {
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
    del(historyKeyName);
  };

  return (
    <>
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
        {filteredEntities.length > 0 ? (
          filteredEntities.map((entity, index) => {
            return renderItem(entity, index);
          })
        ) : searchQuery.trim() !== "" ? (
          <IonItem>No matching anchors found</IonItem>
        ) : null}
      </IonList>
    </>
  );
};
