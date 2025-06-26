import { IonHeader, useIonToast, useIonRouter } from "@ionic/react";

import { HeaderTitle } from "./Titles";
import { TextButton } from "./Buttons";
import { BOXSHADOW, COLOR, HEIGHT } from "../../theme/settings";

import FHNW_HABG_LOGO from "./FHNW_HABG.svg";

type StatusHeaderProps = {
  titleText: string;
  buttonText?: string;
  buttonOnClick?: Parameters<typeof TextButton>[0]["onClick"];
  routerLink?: string;
  children?: React.ReactElement;
};

export const StatusHeader = ({ titleText }: StatusHeaderProps) => {
  return (
    <IonHeader
      style={{
        boxShadow: BOXSHADOW,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: HEIGHT.statusHeader,
          backgroundColor: COLOR.fhnw_yellow0,
          color: COLOR.black,
        }}
      >
        <img
          alt="fhnw_log"
          height="24"
          src={FHNW_HABG_LOGO}
          style={{ marginLeft: "8px" }}
        />
        <HeaderTitle text={titleText} />
      </div>
    </IonHeader>
  );
};

export const DefaultHeader = () => {
  const [present, dismiss] = useIonToast();
  const router = useIonRouter();

  return (
    <StatusHeader titleText="Test">
      <TextButton
        color="protored"
        onClick={() =>
          present({
            buttons: [
              {
                text: "Ja",
                handler: () => {
                  router.push("/landing", "none", "replace");
                  dismiss();
                },
              },
              {
                text: "Nein",
                handler: () => dismiss(),
              },
            ],
            position: "middle",
            message: "Vorgang abbrechen?",
            color: "light",
            cssClass: "toastSkipStation",
          })
        }
        text="Abbrechen"
      />
    </StatusHeader>
  );
};
