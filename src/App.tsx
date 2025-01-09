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
import { ManageAnchorsComponent } from "./components/manageAnchors/ManageAnchorsComponent";
import { CalendarHeatMapComponent } from "./components/timeAnchors/CalendarHeatMapComponent";

import { SettingsComponent } from "./components/settings/SettingsComponent";
import { AnchorProvider } from "./anchorContext";

import { MapComponent } from "./components/mapAnchors/MapComponent";
import { ShowAnchorGraph } from "./components/graphAnchors/ShowAnchorGraph";
import { ForceDirectedGraph } from "./components/graphAnchors/ForceDirectedGraph";

import { draftAnchor } from "./types/defaults";
import { useState } from "react";
import { CreateAnchorModal } from "./components/createAnchors/CreateAnchorModal";
import { ViewAnchorModal } from "./components/manageAnchors/ViewAnchorModal";
import { ScanQRAnchorsComponent } from "./components/scanQRAnchors/ScanQRAnchorsComponent";

setupIonicReact();

const App: React.FC = () => {
  // States for create modal
  const [localAnchor, setLocalAnchor] = useState(draftAnchor);
  const [showDate, setShowDate] = useState(false);
  const [showCreate, setShowCreate] = useState(false);
  const [showMapLocation, setShowMapLocation] = useState(false);

  // States for view modal
  const [showView, setShowView] = useState(false);
  const [showViewAnchorIDs, setShowViewAnchorIDs] = useState([""]);

  return (
    <AnchorProvider>
      <IonApp>
        {/* set base path dynamically.
            only works for the first folder -> gitlab pages deployment */}
        <IonReactRouter basename={window.location.pathname.split("/")[1]}>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/">
                <Redirect to="/mapAnchors" />
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
                <MapComponent
                  setShowCreate={setShowCreate}
                  setLocalAnchor={setLocalAnchor}
                  setShowMapLocation={setShowMapLocation}
                  setShowView={setShowView}
                  setShowViewAnchorIDs={setShowViewAnchorIDs}
                />
              </Route>
              <Route path="/manageAnchors">
                <ManageAnchorsComponent
                  setShowCreate={setShowCreate}
                  setShowView={setShowView}
                  //anchors={anchors}
                  //deleteOneAnchor={deleteOneAnchor}
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
              <IonTabButton tab="mapAnchors" href="/mapAnchors">
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
        </IonReactRouter>
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
          />
        )}
      </IonApp>
    </AnchorProvider>
  );
};

export default App;
