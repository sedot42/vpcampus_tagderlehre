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
  addOutline,
  calendarOutline,
  createOutline,
  mapOutline,
  settingsOutline,
  telescopeOutline,
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

import { CalendarAnchorComponent } from "./components/calendarAnchors/CalendarAnchorsComponent";
import { ManageAnchorComponent } from "./components/manageAnchors/ManageAnchorsComponent";
import { CalendarHeatMapComponent } from "./components/timeAnchors/CalendarHeatMapComponent";

import { SettingsComponent } from "./components/settings/SettingsComponent";
import { AnchorProvider } from "./anchorContext";

import { MapComponent } from "./components/mapAnchors/ref/MapComponent";
import { TempWrapper } from "./components/createAnchors/TempWrapper";

setupIonicReact();

const App: React.FC = () => {
  return (
    <AnchorProvider>
      <IonApp>
        <IonReactRouter>
          <IonTabs>
            <IonRouterOutlet>
              <Route exact path="/test">
                <TempWrapper />
              </Route>
              <Route exact path="/calendarAnchors">
                <CalendarAnchorComponent />
              </Route>
              <Route exact path="/calendarHeatmap">
                <CalendarHeatMapComponent />
              </Route>
              <Route exact path="/mapAnchors">
                <MapComponent />
              </Route>
              <Route exact path="/createAnchors"></Route>
              <Route path="/manageAnchors">
                <ManageAnchorComponent />
              </Route>
              <Route path="/settings">
                <SettingsComponent />
              </Route>
              <Route exact path="/">
                <Redirect to="/mapAnchors" />
              </Route>
            </IonRouterOutlet>
            <IonTabBar slot="bottom">
              <IonTabButton tab="test" href="/test">
                <IonIcon aria-hidden="true" icon={telescopeOutline} size="large" />
                <IonLabel>Test</IonLabel>
              </IonTabButton>
              <IonTabButton tab="calendarAnchors" href="/calendarAnchors">
                <IonIcon aria-hidden="true" icon={calendarOutline} size="large" />
                <IonLabel>Kalender</IonLabel>
              </IonTabButton>
              <IonTabButton tab="mapAnchors" href="/mapAnchors">
                <IonIcon aria-hidden="true" icon={mapOutline} size="large" />
                <IonLabel>Karte</IonLabel>
              </IonTabButton>
              <IonTabButton tab="createAnchors" href="/createAnchors">
                <IonIcon aria-hidden="true" icon={addOutline} size="large" />
                <IonLabel>Erstellen</IonLabel>
              </IonTabButton>
              <IonTabButton tab="manageAnchors" href="/manageAnchors">
                <IonIcon aria-hidden="true" icon={createOutline} size="large" />
                <IonLabel>Verwalten</IonLabel>
              </IonTabButton>
              <IonTabButton tab="settings" href="/settings">
                <IonIcon aria-hidden="true" icon={settingsOutline} size="large" />
                <IonLabel>Optionen</IonLabel>
              </IonTabButton>
            </IonTabBar>
          </IonTabs>
        </IonReactRouter>
      </IonApp>
    </AnchorProvider>
  );
};

export default App;
