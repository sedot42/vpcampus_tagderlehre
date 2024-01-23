import { IonInput } from "@ionic/react";
import { Anchor } from "../../types/types";

export type Config = {
  required: boolean;
  property: keyof Anchor; // Enforce state matching properties of anchor type.
  placeholder: string;
  label: string;
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
      key={index}
      label={entry.label}
      clearInput={true}
      value={state[entry.property] || ""}
      placeholder={entry.property || ""}
      onIonInput={(event: any) => {
        setState({
          ...state,
          [entry.property]: event.target.value as string,
        });
      }}
    />
  ));
};
