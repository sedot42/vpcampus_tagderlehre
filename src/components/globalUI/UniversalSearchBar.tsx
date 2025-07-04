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
  IonInfiniteScroll,
} from "@ionic/react";
import { closeCircleOutline, timeOutline } from "ionicons/icons";
import { get, update, del } from "idb-keyval";
import Fuse from "fuse.js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const UniversalSearchBar = <T extends Record<string, any>>({
  entitiesToBeSearched,
  historyKeyName,
  renderItem,
  titlePropertyName,
}: {
  entitiesToBeSearched: T[]; // What to be searched with the search bar
  historyKeyName: string; // An arbitrary key name that is used to store the history in chache
  titlePropertyName: string; // Property that is used to display a name or title in the results
  renderItem: (entityToBeSearched: T, index: number) => React.ReactElement;
}) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [suggestions, setSuggestions] = useState<T[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  // Load search history from IndexedDB on component mount
  useEffect(() => {
    get(historyKeyName).then((history) => {
      if (history) setSearchHistory(history);
    });
  }, [historyKeyName]);

  // Extract keys dynamically from the first item in mockState
  const keys = useMemo(
    () => (entitiesToBeSearched.length > 0 ? Object.keys(entitiesToBeSearched[0]) : []),
    [entitiesToBeSearched]
  );
  // Initialize Fuse.js for fuzzy search
  const fuse = useMemo(() => {
    return new Fuse(entitiesToBeSearched, {
      keys: keys, // Use dynamically extracted keys
      threshold: 0.3,
      includeScore: true,
    });
  }, [entitiesToBeSearched, keys]);

  // Filter anchors based on search query
  const filteredEntities = useMemo(() => {
    if (searchQuery.trim().length < 3) return entitiesToBeSearched;

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
      const uniqueSuggestions = Array.from(
        new Set(results.map((result) => result.item))
      ).slice(0, 5);
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
        style={{ paddingBottom: 5 }}
        value={searchQuery}
        onIonInput={handleSearch}
        onIonFocus={handleSearchFocus}
        onIonChange={handleSearchSubmit}
        placeholder="Search..."
      />

      {/* Search history */}
      {showHistory && searchHistory.length > 0 && (
        <IonList>
          <IonListHeader
            style={{
              marginTop: -10,
              display: "flex",
              justifyItems: "center",
              alignItems: "center",
            }}
          >
            <IonLabel style={{ fontSize: "1.3rem", fontWeight: 700 }}>
              Search History
            </IonLabel>
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
              <IonLabel style={{ color: "#a2a2a2" }}>{item}</IonLabel>
            </IonItem>
          ))}
          <IonItemDivider />
        </IonList>
      )}

      {/* Search suggestions */}
      {suggestions.length > 0 && (
        <IonList>
          <IonListHeader style={{ marginTop: -25 }}>
            <IonLabel>Suggestions</IonLabel>
          </IonListHeader>
          {suggestions.map((suggestion, index) => (
            <IonItem
              style={{ fontStyle: "italic" }}
              key={index}
              button
              onClick={() => {
                setSearchQuery(suggestion[titlePropertyName]);
                setSuggestions([]);
                addToSearchHistory(suggestion[titlePropertyName]);
              }}
            >
              <IonLabel>{suggestion[titlePropertyName]}</IonLabel>
            </IonItem>
          ))}
          <IonItemDivider />
        </IonList>
      )}
      <IonInfiniteScroll>
        <IonList>
          {filteredEntities.length === 0 && searchQuery.trim() !== "" ? (
            <IonItem>No matches found</IonItem>
          ) : (
            filteredEntities.map((entity, index) => {
              return renderItem(entity, index);
            })
          )}
        </IonList>
      </IonInfiniteScroll>
    </>
  );
};
