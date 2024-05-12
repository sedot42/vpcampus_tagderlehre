import { useContext, useState, useEffect, useRef } from "react";
import {
  IonPage,
  IonContent,
  IonList,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  useIonViewDidEnter,
  IonModal,
  IonHeader,
  IonToolbar,
  IonButton,
  IonTitle,
  IonButtons,
  IonFooter,
  IonIcon,
  IonGrid,
  IonCol,
  IonRow,
  IonRange,
  IonItem,
  IonLabel,
} from "@ionic/react";
import { StatusHeader } from "../globalUI/StatusHeader";
import { AnchorContext } from "../../context";
import { MapContainer, WMSTileLayer, useMapEvents, useMap } from 'react-leaflet'
import { Marker, divIcon } from 'leaflet'
import 'leaflet/dist/leaflet.css';
import { closeOutline, constructOutline, earSharp, homeOutline, layersOutline, mapOutline, volumeMediumSharp } from "ionicons/icons";


export const MapAnchorComponent = () => {
  
  const { anchors } = useContext(AnchorContext);

  const [showModal, setShowModal] = useState(false);
  const mapConatinerRef = useRef(null);

  const [layerSettingsVisible, setLayerSettingVisible] = useState<boolean>(false)

  useIonViewDidEnter(() => {
    window.dispatchEvent(new Event('resize'));
  });

  // get the anchors from the database
  const getAnchorFromServer = () => {
    const serverAnchorData = [
      {
        "id": "6dd2f189-f9a5-419a-9ad4-4f7f0d4c29cd",
        "anchor_name": "test_01",
        "address_string": null,
        "attachments": [],
        "building_id": null,
        "campus_id": null,
        "end_at": null,
        "floor_nr": null,
        "group_id": 'g2025',
        "lat": 47.535128055830526, 
        "lon": 7.641832703943549,
        "room_id": null,
        "start_at": null,
        "tags": ['gis'],
        "valid_from": null,
        "valid_until": null,
        "access_token": null,
        "alt": null,
        "anchor_description": "",
        "ar_anchor_id": null,
        "created_at": "2024-05-03T10:46:50.214Z",
        "faculty_name": null,
        "loc_description": null,
        "loc_description_imgs": [],
        "next_anchor_id": null,
        "owner_group_id": null,
        "owner_id": "Testuser",
        "prev_anchor_id": null,
        "private_anchor": null,
        "updated_at": "2024-05-03T15:51:46.836Z"
      },
      {
        "id": "64e63ac3-fdc1-41ec-8a24-62f1006fbc14",
        "anchor_name": "Veranstaltung 2",
        "address_string": null,
        "attachments": [],
        "building_id": null,
        "campus_id": null,
        "end_at": null,
        "floor_nr": null,
        "group_id": 'g2025',
        "lat": 47.53468660418165, 
        "lon": 7.642048673945129,
        "room_id": null,
        "start_at": null,
        "tags": ['gis'],
        "valid_from": null,
        "valid_until": null,
        "access_token": null,
        "alt": null,
        "anchor_description": "",
        "ar_anchor_id": null,
        "created_at": "2024-05-05T13:27:01.055Z",
        "faculty_name": null,
        "loc_description": null,
        "loc_description_imgs": [],
        "next_anchor_id": null,
        "owner_group_id": null,
        "owner_id": "Testuser",
        "prev_anchor_id": null,
        "private_anchor": null,
        "updated_at": "2024-05-05T13:27:01.055Z"
      },
      {
        "id": "069dbdcf-3046-4618-a90b-5177e4e5b320",
        "anchor_name": "Veranstaltung 1",
        "address_string": null,
        "attachments": [],
        "building_id": null,
        "campus_id": null,
        "end_at": null,
        "floor_nr": null,
        "group_id": 'g2025',
        "lat": 47.53468660418165, 
        "lon": 7.642048673945129,
        "room_id": "10.M.04",
        "start_at": null,
        "tags": ['ar'],
        "valid_from": null,
        "valid_until": null,
        "access_token": null,
        "alt": null,
        "anchor_description": "Cih ",
        "ar_anchor_id": null,
        "created_at": "2024-05-05T13:27:19.200Z",
        "faculty_name": null,
        "loc_description": null,
        "loc_description_imgs": [],
        "next_anchor_id": null,
        "owner_group_id": null,
        "owner_id": "Testuser",
        "prev_anchor_id": null,
        "private_anchor": null,
        "updated_at": "2024-05-05T13:27:19.200Z"
      },
    ];
    return serverAnchorData;
  };

  // filter the anchors from the server with the settings
  const filterAnchorFromServer = (serverAnchorData: any) => {
    // list of anchors that match the filters
    var filteredAnchorListHasDate: any = [];
    var filteredAnchorListIsValid: any = [];
    for (const anchor of serverAnchorData) {
      // filter for selected tags
      const tagFilter: any = localStorage.getItem('campus_v_p_selTags') || [];
      if (anchor.tags.some((element: string) => tagFilter.includes(element)) || tagFilter.length == 0) {
        // filter for selected groups
        const groupFilter: any = localStorage.getItem('campus_v_p_selGroups') || [];
        if (groupFilter.includes(anchor.group_id) || groupFilter.length == 0) {
          // filter for selected floor
          if (true) {
            // filter for anchors that have an appointment in the time range
            if (true) {
              filteredAnchorListHasDate.push(anchor);
            }
            // filter for anchors which are valid in the time period
            else if (true) {
              filteredAnchorListIsValid.push(anchor);
            };
          };
        };
      };
    };
    return [filteredAnchorListHasDate, filteredAnchorListIsValid]
  };

  // create the style of the marker
  const createMarkerStyle = (color:string = '#44a2fa', rotation:string = '45deg', uidAnchor:string = "") => {
    const customMarkerStyle = `
      background-color: ${color};
      width: 3rem;
      height: 3rem;
      display: block;
      left: -1.5rem;
      top: -1.5rem;
      position: relative;
      border-radius: 3rem 3rem 0;
      transform: rotate(${rotation});
      border: 1px solid #FFFFFF`
    const customIcon = divIcon({
      className: "my-custom-pin",
      iconAnchor: [0, 24],
      popupAnchor: [0, -36],
      attribution: uidAnchor,
      html: `<span style="${customMarkerStyle}" />`
    });
    return customIcon; 
  };

  // receive display information of the map (calculation of the anchor position outside the map)
  function GetInformationDisplayedMap() {
    // get filtered Anchors
    const filteredAnchorData = filterAnchorFromServer(getAnchorFromServer());
    const map = useMapEvents({
      move: (e) => {
        // remove all marker from the map
        map.eachLayer((layer) => {if (layer.options.pane === 'markerPane') {map.removeLayer(layer)}});
        // get information from the display
        const mapCenter = e.target.getCenter();
        const mapBounds = e.target.getBounds();
        const mapBoundLeft = mapBounds._southWest.lng - ((mapBounds._southWest.lng - mapBounds._northEast.lng) / 12.5)
        const mapBoundRight = mapBounds._northEast.lng + ((mapBounds._southWest.lng - mapBounds._northEast.lng) / 12.5)
        const mapBoundTop = mapBounds._northEast.lat + ((mapBounds._southWest.lat - mapBounds._northEast.lat) / 14)
        const mapBountBottom = mapBounds._southWest.lat - ((mapBounds._southWest.lat - mapBounds._northEast.lat) / 90)
        // show anchor which have an appointment in the time
        for (const anchor of filteredAnchorData[0]) {
          if (anchor.lat != null && anchor.lon != null) {
            // if anchor in display
            if (anchor.lat >= mapBountBottom && anchor.lat <= mapBoundTop && anchor.lon >= mapBoundLeft && anchor.lon <= mapBoundRight) {
              const mapPositionMarker = new Marker([anchor.lat, anchor.lon], {icon: createMarkerStyle('#44a2fa', '45deg', anchor.id)});
              mapPositionMarker.addEventListener('click', (e)=>{setShowModal(true); openAnchorInformation(e, anchor.id)})
              mapPositionMarker.addTo(map); // add to map;
            }
            // calculate position and rotation of anchor icon (anchor not in display)
            else {
              const rotation = Math.atan2((mapCenter.lng - anchor.lon), (mapCenter.lat - anchor.lat)) / Math.PI * 180 + 45
              const positionLon = () => {
                if ((mapCenter.lng - anchor.lon) >= (mapCenter.lng - mapBoundLeft)) {return mapBoundLeft}
                else if ((mapCenter.lng - anchor.lon) <= (mapCenter.lng - mapBoundRight)){return mapBoundRight}
                else {return anchor.lon};
              };
              const positionLat = () => {
                if ((mapCenter.lat - anchor.lat) >= (mapCenter.lat - mapBountBottom)) {return mapBountBottom}
                else if ((mapCenter.lat - anchor.lat) <= (mapCenter.lat - mapBoundTop)){return mapBoundTop}
                else {return anchor.lat};
              };
              var mapPositionMarker = new Marker([positionLat(), positionLon()], {icon: createMarkerStyle('#44a2fa', rotation+'deg', anchor.id)});
              mapPositionMarker.addEventListener('click', (e)=>{map.panTo([anchor.lat, anchor.lon])})
              mapPositionMarker.addTo(map);
            };
          };
        };
        // show anchor which are valid
      }
    });

    // open modal with all anchor information
    function openAnchorInformation (clickEvent:any, anchorID:any) {
      //show the information overlay
      //setShowModal(true);
      const informationContentModal = document.getElementById('dialogAnchorInfo')!;
      informationContentModal.innerHTML = '';
      // add header to the modal
      const header = document.createElement('ion-header');
      const toolbar = document.createElement('ion-toolbar');
      const title = document.createElement('ion-title');
      title.innerText = 'Informationen Anker';
      toolbar.appendChild(title);
      const buttons = document.createElement('ion-buttons');
      buttons.slot = 'end';
      const closeButton = document.createElement('ion-button');
      closeButton.addEventListener('click', () => {
        const modal = document.getElementById('dialogAnchorInfo');
        if (modal) {
          (modal as HTMLIonModalElement).dismiss();
        }
      });
      const closeIcon = document.createElement('ion-icon');
      closeIcon.icon = closeOutline;
      closeIcon.size = 'large';
      closeButton.appendChild(closeIcon);
      buttons.appendChild(closeButton);
      toolbar.appendChild(buttons);
      header.appendChild(toolbar);
      informationContentModal.appendChild(header);
      const informationContent = document.createElement('ion-content');
      informationContent.setAttribute("class", "ion-padding");
      // get all anchors on this position
      const markerposition = clickEvent.target._latlng;
      // list anchor which have an appointment in the time
      for (const anchor of filteredAnchorData[0]) {
        if (anchor.lat == markerposition.lat && anchor.lon == markerposition.lng) {
          // create a item for display all information
          const anchorInfo = document.createElement('ion-grid')
          anchorInfo.style.marginBottom = "16px";
          anchorInfo.style.paddingLeft = "16px";
          anchorInfo.style.paddingRight = "16px";
          anchorInfo.style.backgroundColor = "#f6f8fc";
          // name
          const anchorInfoName = document.createElement('ion-title');
          anchorInfoName.style.paddingLeft = "0px";
          anchorInfoName.innerHTML = anchor.anchor_name;
          anchorInfo.appendChild(anchorInfoName);
          // id
          const anchorInfoId = document.createElement('ion-note');
          anchorInfoId.innerHTML = anchor.id;
          anchorInfo.appendChild(anchorInfoId);
          // place
          const anchorInfoPlace = document.createElement('ion-row');
          anchorInfoPlace.style.paddingTop = "8px";
          anchorInfoPlace.innerHTML = anchor.room_id;
          anchorInfo.appendChild(anchorInfoPlace);



          // add all informations to the display
          informationContent.appendChild(anchorInfo)
        };
      }
      informationContentModal.appendChild(informationContent);
      const footer = document.createElement('ion-footer');
      footer.setAttribute("class", "ion-padding");
      const closeButtonF = document.createElement('ion-button');
      closeButtonF.setAttribute("expand", "full");
      closeButtonF.innerHTML = "OK";
      closeButtonF.addEventListener('click', () => {
        const modal = document.getElementById('dialogAnchorInfo');
        if (modal) {
          (modal as HTMLIonModalElement).dismiss();
        }
      });
      footer.appendChild(closeButtonF);
      informationContentModal.appendChild(footer);
    };
    return null;
  }
  

  // add - remove buttons for layer selection
  const switchLayerSelection = () => {
    if (layerSettingsVisible) {
      setLayerSettingVisible(false);
      document.getElementById('layerMenuButtonST')!.style.zIndex = "-400";
      document.getElementById('layerMenuButtonFP')!.style.zIndex = "-400";
      document.getElementById('layerMenuFloorSlider')!.style.zIndex = "-400";
    }
    else {
      setLayerSettingVisible(true);
      document.getElementById('layerMenuButtonST')!.style.zIndex = "400";
      document.getElementById('layerMenuButtonFP')!.style.zIndex = "400";
      document.getElementById('layerMenuFloorSlider')!.style.zIndex = "400";
    }
  }


  return (
    <IonPage>
      <StatusHeader titleText="Karte" />
      <IonContent fullscreen>

        

        <MapContainer 
          ref={mapConatinerRef}
          center={[47.5349015179286, 7.6419409280402535]} 
          zoom={18} 
          maxBounds={[[45.8148308954386, 5.740290246442871], [47.967830538595194, 10.594475942663449]]}>
          <WMSTileLayer
            url="https://wms.geo.admin.ch/?"
            layers="ch.swisstopo.pixelkarte-farbe"
            format="image/jpeg"
            detectRetina={true}
            minZoom={7.5}
            maxZoom={20}
            attribution="Map by <a href = 'https://www.swisstopo.admin.ch/en/home.html'>swisstopo</a>"
            />
        <GetInformationDisplayedMap />

        <IonButton id="layerMenuButton" color="primary" size="large" expand="block" fill="solid" onClick={switchLayerSelection}>
          <IonIcon icon={layersOutline} size="large"></IonIcon>
        </IonButton>

        <IonButton id="layerMenuButtonST" color="primary" size="large" expand="block" fill="solid">
          <IonIcon icon={mapOutline} size="large"></IonIcon>
        </IonButton>

        <IonButton id="layerMenuButtonFP" color="primary" size="large" expand="block" fill="solid">
          <IonIcon icon={homeOutline} size="large"></IonIcon>
        </IonButton>


        <IonRange id="layerMenuFloorSlider" aria-label="Custom range" min={-2} max={12} value={0} pin={true} ticks={true} snaps={true} color="dark"></IonRange>

        

        

        </MapContainer>

        <IonModal id="dialogAnchorInfo" isOpen={showModal} onDidDismiss={() => setShowModal(false)}>
            {/* Modal content goes here */}
        </IonModal>

      </IonContent>
    </IonPage>
  );
};
