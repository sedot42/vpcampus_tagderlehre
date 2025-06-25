import { Redirect, Route } from "react-router-dom";
import {
  IonApp,
  IonIcon,
  IonLabel,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonTabs,
  setupIonicReact,
} from "@ionic/react";
import { IonReactRouter } from "@ionic/react-router";
import {
  calendarOutline,
  createOutline,
  mapOutline,
  settingsOutline,
  gitNetworkOutline,
} from "ionicons/icons";

/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";

/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/typography.css";

/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/float-elements.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/display.css";

/* Theme variables */
import "./theme/variables.css";

import { CalendarAnchorComponent } from "./components/calendarAnchors/CalendarAnchorComponent";
import { ManageAnchorsPage } from "./components/manageAnchors/ManageAnchorsPage";
import { CalendarHeatMapComponent } from "./components/timeAnchors/CalendarHeatMapComponent";

import { SettingsComponent } from "./components/settings/SettingsComponent";
import { AnchorProvider } from "./anchorContext";

import { MapPage } from "./components/mapAnchors/MapPage";
import { ShowAnchorGraph } from "./components/graphAnchors/ShowAnchorGraph";
import { ForceDirectedGraph } from "./components/graphAnchors/ForceDirectedGraph";

import { draftAnchor } from "./types/defaults";
import { useState } from "react";
import { CreateAnchorModal } from "./components/createAnchors/CreateAnchorModal";
import { ViewAnchorModal } from "./components/manageAnchors/ViewAnchorModal";
import { UpdateModal } from "./components/manageAnchors/UpdateModal";
import { ScanQRAnchorsComponent } from "./components/scanQRAnchors/ScanQRAnchorsComponent";
import { Anchor } from "./types/types";

setupIonicReact();

const App: React.FC = () => {
  // States for create modal
  const [localAnchor, setLocalAnchor] = useState(draftAnchor);
  const [showDate, setShowDate] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showMapLocation, setShowMapLocation] = useState(false);

  // States for view modal
  const [showView, setShowView] = useState(false);
  const [showViewAnchorIDs, setShowViewAnchorIDs] = useState<string[]>([]);

  // States for update modal
  const [updateModalData, setUpdateModalData] = useState<Anchor | undefined>();
  const [openUpdateModal, setOpenUpdateModal] = useState(false);

  const handleOpenUpdateModal = (anchorData: Anchor) => {
    setUpdateModalData(anchorData);
    setOpenUpdateModal(true);
  };

  // calculate basename dynamically
  const routes = [
    "calendarAnchors",
    "calendarHeatmap",
    "graphAnchor",
    "semantics",
    "mapAnchors",
    "manageAnchors",
    "settings",
    "qrscanner",
  ];
  const pathSegments = window.location.pathname
    .split("/")
    .filter((segment) => segment !== "");
  // check if pathname includes known routes
  const basename = routes.reduce((_res, route) => {
    const routeIdx = pathSegments.indexOf(route);
    if (routeIdx >= 0) return "/" + pathSegments.slice(0, routeIdx).join("/");
    else return _res;
  }, window.location.pathname);

  return (
    <AnchorProvider>
      <IonApp>
        <IonReactRouter basename={basename}>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/">
                <Redirect to="/manageAnchors" />
              </Route>
              <Route path="/calendarAnchors">
                <CalendarAnchorComponent
                  setShowCreate={setShowCreate}
                  setLocalAnchor={setLocalAnchor}
                  setShowDate={setShowDate}
                  setShowView={setShowView}
                  setShowViewAnchorID={setShowViewAnchorIDs}
                />
              </Route>
              <Route exact path="/calendarHeatmap">
                <CalendarHeatMapComponent />
              </Route>
              <Route exact path="/graphAnchor">
                <ShowAnchorGraph />
              </Route>
              <Route exact path="/semantics">
                <ForceDirectedGraph />
              </Route>
              <Route path="/mapAnchors">
                <MapPage
                  setShowCreate={setShowCreate}
                  setLocalAnchor={setLocalAnchor}
                  setShowMapLocation={setShowMapLocation}
                  setShowView={setShowView}
                  setShowViewAnchorIDs={setShowViewAnchorIDs}
                />
              </Route>
              <Route path="/mapAnchors/:id">
                <MapPage
                  setShowCreate={setShowCreate}
                  setLocalAnchor={setLocalAnchor}
                  setShowMapLocation={setShowMapLocation}
                  setShowView={setShowView}
                  setShowViewAnchorIDs={setShowViewAnchorIDs}
                />
              </Route>
              <Route path="/manageAnchors">
                <ManageAnchorsPage
                  setShowCreate={setShowCreate}
                  setShowView={setShowView}
                  onOpenUpdateModal={handleOpenUpdateModal}
                  basename={basename}
                />
              </Route>
              <Route path="/manageAnchors/:id">
                <ManageAnchorsPage
                  setShowCreate={setShowCreate}
                  setShowView={setShowView}
                  onOpenUpdateModal={handleOpenUpdateModal}
                  basename={basename}
                />
              </Route>
              <Route path="/settings">
                <SettingsComponent />
              </Route>
              <Route exact path="/qrscanner">
                <ScanQRAnchorsComponent />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="mapAnchors" href="/mapAnchors/all">
                <IonIcon aria-hidden="true" icon={mapOutline} size="large" />
                <IonLabel>Karte</IonLabel>
              </IonTabButton>

              <IonTabButton tab="calendarAnchors" href="/calendarAnchors">
                <IonIcon aria-hidden="true" icon={calendarOutline} size="large" />
                <IonLabel>Kalender</IonLabel>
              </IonTabButton>

              <IonTabButton tab="manageAnchors" href="/manageAnchors">
                <IonIcon aria-hidden="true" icon={createOutline} size="large" />
                <IonLabel>Ankerliste</IonLabel>
              </IonTabButton>

              <IonTabButton tab="graphAnchor" href="/graphAnchor">
                <IonIcon aria-hidden="true" icon={gitNetworkOutline} size="large" />
                <IonLabel>Graph</IonLabel>
              </IonTabButton>

              <IonTabButton tab="settings" href="/settings">
                <IonIcon aria-hidden="true" icon={settingsOutline} size="large" />
                <IonLabel>Optionen</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
          {showCreate && (
            <CreateAnchorModal
              showCreate={showCreate}
              setShowCreate={setShowCreate}
              localAnchor={localAnchor}
              setLocalAnchor={setLocalAnchor}
              showDate={showDate}
              setShowDate={setShowDate}
              setShowMapLocation={setShowMapLocation}
              showMapLocation={showMapLocation}
            />
          )}
          {showView && (
            <ViewAnchorModal
              showView={showView}
              setShowView={setShowView}
              showViewAnchorIDs={showViewAnchorIDs}
              onOpenUpdateModal={handleOpenUpdateModal}
              basename={basename}
            />
          )}
          {openUpdateModal && updateModalData && (
            <UpdateModal
              modalData={updateModalData}
              setModalData={setUpdateModalData}
              openUpdateModal={openUpdateModal}
              setOpenUpdateModal={setOpenUpdateModal}
            />
          )}
        </IonReactRouter>
      </IonApp>
    </AnchorProvider>
  );
};

export default App;
