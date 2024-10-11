import { IonInput, IonText, IonTextarea } from "@ionic/react";
import { Anchor, DraftAnchor } from "../../types/types";

export type ConfigInput = {
  required: boolean;
  property: keyof Anchor; // Enforce state matching properties of anchor type.
  placeholder: string;
  label: string;
  fill?: "outline" | "solid" | undefined;
};

// Creates a set of input fields.
export function createInputs<T extends DraftAnchor<Anchor>>(
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  config: ConfigInput[]
) {
  return config.map((entry, index) => (
    <IonInput
      color="dark"
      labelPlacement="stacked"
      type="text"
      style={{ margin: "16px 0 16px 0" }}
      required={entry.required}
      fill={entry.fill || undefined}
      key={index}
      clearInput={true}
      value={state[entry.property] ? String(state[entry.property]) : ""}
      placeholder={entry.label || ""}
      onIonInput={(event) => {
        setState({
          ...state,
          [entry.property]: event.target.value as string,
        });
      }}
    >
      {entry.required ? (
        <div slot="label">
          {entry.label}
          <IonText color="danger"> (Pflichtfeld) </IonText>
        </div>
      ) : (
        <div slot="label">{entry.label}</div>
      )}
    </IonInput>
  ));
}

export function createTextarea<T extends DraftAnchor<Anchor>>(
  state: T,
  setState: React.Dispatch<React.SetStateAction<T>>,
  config: ConfigInput[]
) {
  return config.map((entry, index) => (
    <IonTextarea
      autoGrow={true}
      color="dark"
      inputmode="text"
      labelPlacement="stacked"
      style={{ margin: "16px 0 16px 0" }}
      required={entry.required}
      fill={entry.fill || undefined}
      key={index}
      value={state[entry.property] ? String(state[entry.property]) : ""}
      placeholder={entry.label || ""}
      onIonInput={(event) => {
        setState({
          ...state,
          [entry.property]: event.target.value as string,
        });
      }}
    >
      {entry.required ? (
        <div slot="label">
          {entry.label}
          <IonText color="danger"> (Pflichtfeld) </IonText>
        </div>
      ) : (
        <div slot="label">{entry.label}</div>
      )}
    </IonTextarea>
  ));
}
