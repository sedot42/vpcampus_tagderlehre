import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonLabel, IonButton, IonItem, IonList, IonModal, IonButtons, IonInput } from "@ionic/react";
import { Anchor } from "../types/types";
import React, { useState, useRef } from 'react';
import { delete_mutation, update_mutation } from "../requests/mutations";
import { query } from "../requests/queries";
import UpdateAnchor from "./UpdateAnchor";
import { OverlayEventDetail } from '@ionic/core/components';

console.log("Hello")


const Tab2 = ({
  anchors,
  setAnchors,
}: {
  anchors: Anchor[];
  setAnchors: (anchors: Anchor[]) => void;
}) => {

  const modal = useRef<HTMLIonModalElement>(null);
  const input_anchor_name = useRef<HTMLIonInputElement>(null);
  const input_owner_id = useRef<HTMLIonInputElement>(null);

  const [message, setMessage] = useState(
    'This modal example uses triggers to automatically open a modal when the button is clicked.'
  );

  function confirm() {
    console.log('confirm clicked')
    //update_mutation
    ;

    fetch("http://localhost:5000/", {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        query: update_mutation,
        variables: {
          anchor: {
            //id: 7,
            anchor_name:  input_anchor_name.current?.value, //"e976e882-50aa-428e-a831-00749d7db311",
            owner_id: input_owner_id.current?.value,
          },
        },
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Anchor updated:', data.data.updateAnchor);
        console.log(modal);
        modal.current?.dismiss().then(function(e){
          console.log(e)
        });
        // Handle success, update local state or show a success message
      })
      .catch((error) => {
        console.error('Error updating anchor:', error);
        // Handle error, show an error message
      });
    
  }

  function onWillDismiss(ev: CustomEvent<OverlayEventDetail>) {
    if (ev.detail.role === 'confirm') {
      setMessage(`Hello, ${ev.detail.data}!`);
    }
  }

  //const [anchorId, setAnchorId] = useState("");
  //const [ownerId, setOwnerId] = useState("");
  //const [editingAnchor, setEditingAnchor] = useState(null);

  const getAnchors = () => {
    fetch("http://localhost:5000/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((res) => setAnchors(res.data.anchors));
  };
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Tab 2</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Tab 2</IonTitle>
          </IonToolbar>
        </IonHeader>

        
      <div>
        <IonButton onClick={getAnchors}>Read Anchor</IonButton>

      </div>

      <IonList>

        {anchors &&
          anchors.length > 0 &&
          anchors.map((anchor, index) => (
            <IonItem key={index}>
              <IonLabel>
                {anchor.anchor_name} from {anchor.owner_id} and id {anchor.id}
              </IonLabel>
              <IonButton
                onClick={() => {
                  fetch("http://localhost:5000/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                      query: delete_mutation,
                      variables: {
                        deleteAnchorId: anchor.id,
                      },
                    }),
                  })
                    .then((res) => res.json())
                    .then(() => getAnchors());
                }}
              >
                Delete me
              </IonButton>
              {/* <IonButton
                onClick={() => {
                  console.log('inside the event');
                  fetch("http://localhost:5000/", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },

                    body: JSON.stringify({
                      query: update_mutation,
                      variables: {
                        updateAnchorId: anchor.id,
                        anchor: {
                          anchor_name: anchorId,
                          owner_id: ownerId,
                        },
                      },
                    }),
                  })
                    .then((res) => res.json())
                    .then(responseData => {console.log(responseData); return responseData;})
                    .then(() => getAnchors()
                    );
                    
                }}
              >
                Update me
              </IonButton> */}

            <IonButton id={"open-modal-" + index} expand="block">
              Update me
            </IonButton>
            
            <IonModal ref={modal} trigger={"open-modal-" + index} onWillDismiss={(ev) => onWillDismiss(ev)}>
              <IonHeader>
                <IonToolbar>
                  <IonButtons slot="start">
                    <IonButton onClick={() => modal.current?.dismiss()}>Cancel</IonButton>
                  </IonButtons>
                  <IonTitle>Item Number {index}</IonTitle>
                  <IonButtons slot="end">
                    <IonButton strong={true} onClick={() => confirm()}>
                      Confirm
                    </IonButton>
                  </IonButtons>
                </IonToolbar>
              </IonHeader>
              <IonContent className="ion-padding">
                <IonItem>
                  <div>
                    <p>{anchor.id}</p>
                  <IonInput ref={input_anchor_name} type="text" placeholder="anchor_name" />
                  <IonInput ref={input_owner_id} type="text" placeholder="owner_id" />
                  </div>
                </IonItem>
              </IonContent>
          </IonModal>

            </IonItem>
          ))}

              
      </IonList>
      
      </IonContent>
    </IonPage>
    
  );
};

export default Tab2;
