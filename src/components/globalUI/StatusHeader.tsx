import { IonHeader, useIonToast, useIonRouter } from "@ionic/react";

import { HeaderTitle } from "./Titles";
import { TextButton } from "./Buttons";
import { BOXSHADOW, COLOR, HEIGHT } from "../../theme/settings";

type StatusHeaderProps = {
  titleText: string;
  buttonText?: string;
  buttonOnClick?: any;
  routerLink?: string;
  children?: React.ReactElement;
};

export const StatusHeader = ({
  buttonOnClick,
  buttonText,
  titleText,
  routerLink,
  children,
}: StatusHeaderProps) => {
  return (
    <IonHeader
      style={{
        boxShadow: BOXSHADOW,
        backgroundColor: COLOR.white,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          height: HEIGHT.statusHeader,
          backgroundColor: COLOR.white,
        }}
      >
        <img
          alt="fhnw_log"
          height="20"
          src="/assets/fhnw_logo_small.PNG"
          style={{ marginLeft: "8px" }}
        />
        <HeaderTitle text={titleText} />

        {children ? (
          children
        ) : (
          <TextButton
            color="protored"
            onClick={buttonOnClick}
            routerLink={routerLink}
            text={buttonText || ""}
            style={{ minWidth: 100 }}
          />
        )}
      </div>
    </IonHeader>
  );
};

export const BlankHeader = () => {
  return (
    <StatusHeader titleText="">
      <div style={{ height: 35 }}></div>
    </StatusHeader>
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
