import { useEffect } from "react";
import { addCircleOutline, trashOutline, closeOutline } from "ionicons/icons";
import { MapContainer, WMSTileLayer, useMapEvents } from "react-leaflet";
import { divIcon, Marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";
import { LocateControl } from "../mapAnchors/ref/LocateControl";
import {
  IonButton,
  IonFooter,
  IonContent,
  IonModal,
  IonLabel,
  IonHeader,
  IonIcon,
  IonTitle,
  IonButtons,
  IonToolbar,
  IonGrid,
  IonCol,
  IonRow,
  IonInput,
  IonInfiniteScroll,
  IonList,
  IonSearchbar,
} from "@ionic/react";
import "leaflet/dist/leaflet.css";

export const CreatePlaceComponent = ({
  localAnchor,
  setLocalAnchor,
  setShowToastCreateLocation,
  setNewLocationError,
  setNewPositionLatitude,
  newPositionLatitude,
  setNewPositionLongitude,
  newPositionLongitude,
  selectedLocationDictionary,
  temporaryLocationList,
  setTemporaryLocationList,
  getLocationsFromFilter,
  filterLocationString,
  newLocationDictionary,
  setNewLocationDictionary,
  updateLocationsInput,
}) => {
  // whenever the filter (search) is changed, the listing is updated
  useEffect(() => {
    // check if list is displayed
    if (document.getElementById("listFilteredLocations") != null) {
      getLocationsFromFilter();
    }
  }, [filterLocationString]);

  // whenever the release of an individual location changes check the validity
  useEffect(() => {
    // error if location exists or no input
    if (
      newLocationDictionary.room_id == "" &&
      newLocationDictionary.lat == null &&
      newLocationDictionary.lon == null &&
      newLocationDictionary.floor_nr == null &&
      newLocationDictionary.building_id == "" &&
      newLocationDictionary.campus_id == "" &&
      newLocationDictionary.address_string == ""
    ) {
      setNewLocationError(true);
    } else {
      setNewLocationError(false);
    }
  }, [newLocationDictionary]);

  // update the location floor_nr by event (input)
  const readNewLocationInputFloor = (event: CustomEvent) => {
    const newLocationDictValue: { [key: string]: any } = Object.assign(
      {},
      newLocationDictionary
    );
    if (event.detail.value == "") {
      newLocationDictValue.floor_nr = null;
    } else {
      newLocationDictValue.floor_nr = Math.round(event.detail.value);
    }
    setNewLocationDictionary(newLocationDictValue);
  };

  // create a new temporary location (only for user, until save on database)
  const createNewTempLocation = () => {
    if (
      newLocationDictionary.room_id != "" ||
      newLocationDictionary.lat != null ||
      newLocationDictionary.lon != null ||
      newLocationDictionary.floor_nr != null ||
      newLocationDictionary.building_id != "" ||
      newLocationDictionary.campus_id != "" ||
      newLocationDictionary.address_string != ""
    ) {
      const temporaryLocationListValue = temporaryLocationList;
      console.log(temporaryLocationListValue);
      temporaryLocationListValue.push(newLocationDictionary);
      setTemporaryLocationList(temporaryLocationListValue);
      closeDialogCreateLocation();
      // reset dictionary for new user location
    }
    setShowToastCreateLocation(true);
  };

  // closing the dialog (modal) to enter a new location
  const closeDialogCreateLocation = () => {
    const dialogCreateLocation = document.getElementById(
      "dialogCreateLocation"
    ) as HTMLIonModalElement;
    dialogCreateLocation.dismiss();
    // update of the listing (locations)
    getLocationsFromFilter();
  };

  function GetPosClickDisplayedMap() {
    const customMarkerStyle = `
        background-color: #44a2fa;
        width: 3rem;
        height: 3rem;
        display: block;
        left: -1.5rem;
        top: -1.5rem;
        position: relative;
        border-radius: 3rem 3rem 0;
        transform: rotate(45deg);
        border: 1px solid #FFFFFF`;

    const customPosIcon = divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      html: `<span style="${customMarkerStyle}" />`,
    });
    const map = useMapEvents({
      click: (e) => {
        map.eachLayer((layer) => {
          if (layer.options.pane === "markerPane") {
            map.removeLayer(layer);
          }
        });
        const mapPositionMarker = new Marker(e.latlng, { icon: customPosIcon });
        mapPositionMarker.addTo(map); // add to map;
        setNewPositionLatitude(e.latlng.lat);
        setNewPositionLongitude(e.latlng.lng);
      },
    });
    return null;
  }

  // update the coordinates
  useEffect(() => {
    const newLocationDictValue: { [key: string]: any } = Object.assign(
      {},
      newLocationDictionary
    );
    newLocationDictValue.lat = Number.isNaN(newPositionLatitude)
      ? undefined
      : newPositionLatitude;
    newLocationDictValue.lon = Number.isNaN(newPositionLongitude)
      ? undefined
      : newPositionLongitude;
    setNewLocationDictionary(newLocationDictValue);
  }, [newPositionLatitude, newPositionLongitude]);

  // save changes in the temporary anchor for forwarding to the database
  useEffect(() => {
    setLocalAnchor({
      ...localAnchor,
      room_id:
        selectedLocationDictionary.room_id !== ""
          ? selectedLocationDictionary.room_id
          : undefined,
      lat:
        selectedLocationDictionary.lat === null
          ? undefined
          : selectedLocationDictionary.lat,
      lon:
        selectedLocationDictionary.lon === null
          ? undefined
          : selectedLocationDictionary.lon,
      floor_nr:
        selectedLocationDictionary.floor_nr === null
          ? undefined
          : selectedLocationDictionary.floor_nr,
      building_id:
        selectedLocationDictionary.building_id !== ""
          ? selectedLocationDictionary.building_id
          : undefined,
      address_string:
        selectedLocationDictionary.address_string !== ""
          ? selectedLocationDictionary.address_string
          : undefined,
      campus_id:
        selectedLocationDictionary.campus_id !== ""
          ? selectedLocationDictionary.campus_id
          : undefined,
    });
    updateLocationsInput;
  }, [selectedLocationDictionary]);

  return (
    <>
      {/* overlay (modal) for the creation of locations */}
      <IonModal id="dialogCreateLocation" trigger="openDialogCreateLocation">
        <IonHeader>
          <IonToolbar>
            <IonTitle slot="start">Ort erstellen</IonTitle>
            <IonButtons slot="end">
              <IonButton onClick={closeDialogCreateLocation}>
                <IonIcon icon={closeOutline} size="large"></IonIcon>
              </IonButton>
            </IonButtons>
          </IonToolbar>
        </IonHeader>
        <IonContent class="padding">
          <IonGrid>
            <IonRow>
              <IonCol>
                <div id="positionContainer" style={{ height: "600%", width: "100%" }}>
                  <MapContainer
                    id="selectPositionMap"
                    center={[47.5349015179286, 7.6419409280402535]}
                    zoom={18}
                    maxBounds={[
                      [45.8148308954386, 5.740290246442871],
                      [47.967830538595194, 10.594475942663449],
                    ]}
                  >
                    <WMSTileLayer
                      id="backgroundPixelKarte"
                      url="https://wms.geo.admin.ch/?"
                      layers="ch.swisstopo.pixelkarte-farbe"
                      format="image/jpeg"
                      detectRetina={true}
                      minZoom={7.5}
                      maxZoom={20}
                      attribution="Map by <a href = 'https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
                    />
                    <GetPosClickDisplayedMap />
                    {/* Geolocation Control*/}
                    <LocateControl />
                  </MapContainer>
                </div>
                <IonInput
                  onIonInput={readNewLocationInputFloor}
                  color="dark"
                  label="Stockwerk"
                  labelPlacement="stacked"
                  type="number"
                  fill="outline"
                  style={{ margin: "16px 0 16px 0" }}
                  placeholder="Stockwerk"
                ></IonInput>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonContent>
        <IonFooter>
          <IonGrid>
            <IonRow>
              <IonCol>
                <IonButton
                  onClick={closeDialogCreateLocation}
                  id="cancelTempLocation"
                  expand="full"
                  color="primary"
                >
                  Abbrechen
                </IonButton>
              </IonCol>
              <IonCol>
                <IonButton
                  onClick={createNewTempLocation}
                  id="saveTempLocation"
                  expand="full"
                  color="primary"
                >
                  Speichern
                </IonButton>
              </IonCol>
            </IonRow>
          </IonGrid>
        </IonFooter>
      </IonModal>
    </>
  );
};

export default CreatePlaceComponent;
