import { IonInput, IonText } from "@ionic/react";
import { Anchor } from "../../types/types";

export type Config = {
  required: boolean;
  property: keyof Anchor; // Enforce state matching properties of anchor type.
  placeholder: string;
  label: string;
  fill?: "outline" | "solid" | undefined;
};

// Creates a set of input fields.
export const createInputs = (
  state: any,
  setState: (state: any) => void,
  config: Config[]
) => {
  return config.map((entry, index) => (
    <IonInput
      labelPlacement="stacked"
      type="text"
      style={{ margin: "16px 0 16px 0" }}
      required={entry.required}
      fill={entry.fill || undefined}
      key={index}
      clearInput={true}
      value={state[entry.property] || ""}
      placeholder={entry.label || ""}
      onIonInput={(event: any) => {
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
};
