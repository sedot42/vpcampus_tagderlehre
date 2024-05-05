import { IonText, IonCardTitle } from "@ionic/react";
import { COLOR } from "../../theme/settings";

type TitleProps = {
  text: string;
  style?: { [key: string]: string | number };
};

export const CardTitle = ({ text, style }: TitleProps) => (
  <IonCardTitle
    color="darkfont"
    style={{
      fontWeight: 100,
      ...style,
    }}
  >
    {text}
  </IonCardTitle>
);

export const HeaderTitle = ({ text, style }: TitleProps) => (
  <IonText
    color="#f0f"
    style={{
      fontWeight: 600,
      marginLeft: "auto",
      marginRight: "8px",
    }}
  >
    {text}
  </IonText>
);
export const QuizQuestion = ({ text, style }: TitleProps) => (
  <p
    color="darkfont"
    style={{
      whiteSpace: "pre-line",
      fontSize: 16,
      padding: "0 20px",
      marginLeft: "auto",
      marginRight: "auto",
      fontStyle: "italic",
      color: COLOR.darkfont,
    }}
  >
    {text}
  </p>
);
export const ProgressTitle = ({ text, style }: TitleProps) => (
  <IonText
    color="intermediatefont"
    style={{
      fontSize: "smaller",
      ...style,
    }}
  >
    {text}
  </IonText>
);
export const ProgressHeader = ({ text, style }: TitleProps) => (
  <IonText
    color="darkfont"
    style={{
      fontSize: "smaller",
      ...style,
    }}
  >
    {text}
  </IonText>
);
