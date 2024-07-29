import { useEffect, useRef, BaseSyntheticEvent } from "react";
import { addCircleOutline, trashOutline } from "ionicons/icons";
import "leaflet/dist/leaflet.css";
import "../../theme/styles.css";
import { IonButton, IonIcon, IonLabel } from "@ionic/react";

export const CreateDocumentComponent = ({
  localAnchor,
  setLocalAnchor,
  selectedFileList,
  setSelectedFileList,
}) => {
  // functional components for the selection of documents for an anchor

  const fileInput = useRef<null>(null); // ref object for input
  // function for updating the selected documents (adding documents)
  function updateSelectedFileList(event: BaseSyntheticEvent) {
    if (typeof event.target.files[0] !== "undefined") {
      // iterate through list to get a new reference, otherwise useEffect is not triggered
      const selectedFileListValue = [];
      let i = 0;
      while (i < selectedFileList.length) {
        selectedFileListValue.push(selectedFileList[i]);
        i++;
      }
      selectedFileListValue.push(event.target.files[0].name);
      setSelectedFileList(selectedFileListValue);
    }
  }

  // updating the display of the selected elements
  useEffect(() => {
    // clearing the current display
    const documentContainerDiv = document.getElementById("documentContainer")!;
    documentContainerDiv.innerHTML = "";
    // iteration through all appended documents
    let i = 0;
    while (i < selectedFileList.length) {
      // create all elements
      const documentButton = document.createElement("ion-button");
      documentButton.setAttribute("id", selectedFileList[i]);
      documentButton.setAttribute("class", "documentContainerButton");
      documentButton.setAttribute("color", "medium");
      // add a function to delete documents
      documentButton.addEventListener("click", (event: any) => {
        const targetButton = event.currentTarget as HTMLElement;
        const targetDocument = targetButton.getAttribute("id");
        // iterate through list and remove deleted elements
        const selectedFileListValue = [];
        let j = 0;
        while (j < selectedFileList.length) {
          if (selectedFileList[j] != targetDocument) {
            selectedFileListValue.push(selectedFileList[j]);
          }
          j++;
        }
        setSelectedFileList(selectedFileListValue);
      });
      const documentButtonLabel = document.createElement("ion-label");
      documentButtonLabel.classList.add("documentContainerButtonLabels", "ion-text-wrap");
      documentButtonLabel.innerHTML = selectedFileList[i];
      const documentButtonIcon = document.createElement("ion-icon");
      documentButtonIcon.setAttribute("icon", trashOutline);
      documentButton.appendChild(documentButtonLabel);
      documentButton.appendChild(documentButtonIcon);
      documentContainerDiv.appendChild(documentButton);
      i++;
    }
    // save changes in the temporary anchor for forwarding to the database
    setLocalAnchor({
      ...localAnchor,
      attachments: selectedFileList.length > 0 ? selectedFileList : undefined,
    });
  }, [selectedFileList]);

  return (
    <>
      {/* part for the selection of documents */}
      <input
        ref={fileInput}
        accept="*/*"
        hidden
        type="file"
        onChange={(e) => updateSelectedFileList(e)} // onSelectFile
        onClick={(e: BaseSyntheticEvent) => {
          // value reset to enable successive selection of the same element
          e.target!.value = null;
        }}
      />
      <IonButton
        id="openDialogSelectDocument"
        expand="block"
        color="light"
        fill="solid"
        size="default"
        onClick={() => {
          // @ts-ignore
          fileInput?.current?.click();
        }}
      >
        <div>
          <IonLabel id="openDialogSelectDocumentLabel" class="ion-text-wrap">
            Dokumente
          </IonLabel>
          <IonIcon icon={addCircleOutline} size="large" aria-hidden="true"></IonIcon>
        </div>
      </IonButton>
      <div id="documentContainer">{/* container for showing the selection */}</div>
    </>
  );
};
