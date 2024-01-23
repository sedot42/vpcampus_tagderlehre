import { IonInput } from "@ionic/react";

type Config = {
  required: boolean;
  property: string;
  placeholder: string;
  label: string;
};

export const createInputs = (
  state: any,
  setState: (state: any) => void,
  config: Config[]
) => {
  console.log(state);
  return config.map((entry, index) => (
    <IonInput
      labelPlacement="stacked"
      type="text"
      key={index}
      label={entry.label}
      clearInput={true}
      value={state[entry.property] || ""}
      onIonInput={(event: any) => {
        setState({
          ...state,
          [entry.property]: event.target.value as string,
        });
      }}
    />
  ));
};
