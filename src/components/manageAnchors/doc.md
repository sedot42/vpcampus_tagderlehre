
Context (useContext):
AnchorContext provides anchors and deleteOneAnchor.

State (useState):

openModal: Manages the state of the modal (open/close).
modalData: Stores data for the modal.
searchQuery: Stores the current search query.
suggestions: Stores search suggestions.
searchHistory: Stores search history.
showHistory: Manages the visibility of search history.
Effect (useEffect):

Loads search history from IndexedDB using get when the component mounts and sets the searchHistory state.
Memoized Values (useMemo):

Configures Fuse.js for fuzzy search with anchors as the input.
Filters anchors based on the searchQuery using Fuse.js.
Event Handlers:

handleSearch: Handles changes to the search input.
handleSearchFocus: Shows the search history when the search bar is focused.
handleSearchSubmit: Adds the search query to the history and hides the search history.
clearSearchHistory: Clears the search history.
Conditional Rendering:

Renders components conditionally based on the state values, such as the search bar, search history list, suggestions list, filtered anchors list, and the update modal.
JSX Elements:

The main structure of the component, including IonPage, IonContent, IonSearchbar, IonList, IonItem, IonLabel, IonButton, IonIcon, IonNote, StatusHeader, and UpdateModal

                                 +---------------------------------+
                                 |       ManageAnchorComponent     |
                                 +---------------------------------+
                                                |
         +--------------------------------------+--------------------------------------+
         |                                      |                                      |
         v                                      v                                      v
+----------------------+      +---------------------------+      +-----------------------------+
|      useContext      |      |       useState            |      |          useEffect          |
|  (AnchorContext)     |      |---------------------------|      |-----------------------------|
|----------------------|      | - openModal               |      | - Load search history from  |
| - anchors            |      | - modalData               |      |   IndexedDB using `get`     |
| - deleteOneAnchor    |      | - searchQuery             |      | - Set searchHistory state   |
+----------------------+      | - suggestions             |      +-----------------------------+
                              | - searchHistory           |                       |
                              | - showHistory             |                       v
                              +---------------------------+       +---------------------------------+
                                                                  |           useMemo               |
                                                                  |---------------------------------|
                                                                  | - Configure Fuse.js for fuzzy   |
                                                                  |   search with anchors as input  |
                                                                  +---------------------------------+
                                                                                     |
                                                                                     v
                                                                 +---------------------------------+
                                                                 |           useMemo               |
                                                                 |---------------------------------|
                                                                 | - filteredAnchors: Filter anchors|
                                                                 |   based on search query using    |
                                                                 |   Fuse.js                        |
                                                                 +---------------------------------+
                                                                                     |
                                                                                     v
                                                                  +---------------------------------+
                                                                  |     Event Handlers (useCallback)|
                                                                  |---------------------------------|
                                                                  | - handleSearch                  |
                                                                  | - handleSearchFocus             |
                                                                  | - handleSearchSubmit            |
                                                                  | - clearSearchHistory            |
                                                                  +---------------------------------+
                                                                                     |
                                                                                     v
                                                                      +--------------------------+
                                                                      |   Conditional Rendering   |
                                                                      |--------------------------|
                                                                      | - Search bar             |
                                                                      | - Search history list    |
                                                                      | - Suggestions list       |
                                                                      | - Filtered anchors list  |
                                                                      | - Update modal           |
                                                                      +--------------------------+
                                                                                     |
                                                                                     v
                                                                     +---------------------------+
                                                                     |     JSX Elements          |
                                                                     |---------------------------|
                                                                     | - IonPage                 |
                                                                     | - IonContent              |
                                                                     | - IonSearchbar            |
                                                                     | - IonList                 |
                                                                     | - IonItem                 |
                                                                     | - IonLabel                |
                                                                     | - IonButton               |
                                                                     | - IonIcon                 |
                                                                     | - IonNote                 |
                                                                     | - StatusHeader            |
                                                                     | - UpdateModal             |
                                                                     +---------------------------+

