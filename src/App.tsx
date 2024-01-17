import { Redirect, Route } from "react-router-dom";
import React, { useState } from "react";
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
  createOutline,
  ellipse,
  searchOutline,
  settingsOutline,
  square,
  triangle,
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

import { Anchor } from "./types/types";
import { FindAnchorComponent } from "./components/findAnchors/FindAnchorsComponent";
import { CreateAnchorComponent } from "./components/createAnchors/CreateAnchorsComponent";
import { ManageAnchorComponent } from "./components/manageAnchors/ManageAnchorsComponent";
import { SettingsComponent } from "./components/settings/SettingsComponent";

setupIonicReact();

const App: React.FC = () => {
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  return (
    <IonApp>
      <IonReactRouter>
        <IonTabs>
          <IonRouterOutlet>
            <Route exact path="/findAnchors">
              <FindAnchorComponent anchors={anchors} setAnchors={setAnchors} />
            </Route>
            <Route exact path="/createAnchors">
              <CreateAnchorComponent
                anchors={anchors}
                setAnchors={setAnchors}
              />
            </Route>
            <Route path="/manageAnchors">
              <ManageAnchorComponent
                anchors={anchors}
                setAnchors={setAnchors}
              />
            </Route>
            <Route path="/settings">
              <SettingsComponent />
            </Route>
            <Route exact path="/">
              <Redirect to="/findAnchors" />
            </Route>
          </IonRouterOutlet>
          <IonTabBar slot="bottom">
            <IonTabButton tab="findAnchors" href="/findAnchors">
              <IonIcon aria-hidden="true" icon={searchOutline} />
              <IonLabel>Finden</IonLabel>
            </IonTabButton>
            <IonTabButton tab="createAnchors" href="/createAnchors">
              <IonIcon aria-hidden="true" icon={addOutline} />
              <IonLabel>Erstellen</IonLabel>
            </IonTabButton>
            <IonTabButton tab="manageAnchors" href="/manageAnchors">
              <IonIcon aria-hidden="true" icon={createOutline} />
              <IonLabel>Verwalten</IonLabel>
            </IonTabButton>
            <IonTabButton tab="settings" href="/settings">
              <IonIcon aria-hidden="true" icon={settingsOutline} />
              <IonLabel>Einstellungen</IonLabel>
            </IonTabButton>
          </IonTabBar>
        </IonTabs>
      </IonReactRouter>
    </IonApp>
  );
};

export default App;
