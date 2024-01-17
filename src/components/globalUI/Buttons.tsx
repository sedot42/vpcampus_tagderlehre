import { IonButton } from "@ionic/react";
import React from "react";

type ButtonProps = {
  className?: string;
  icon?: React.ReactElement;
  color?: string;
  onClick?: (e?: any) => void;
  style?: { [key: string]: string | number };
  text: string;
  size?: "small" | "default" | "large" | undefined;
  slot?: "start" | "end" | "iconOnly";
  routerLink?: string;
  routerDirection?: "back" | "forward" | "root" | "none";
  iconPosition?: "start" | "end";
};

export const TextButton = ({
  color,
  icon,
  style,
  text,
  onClick,
  size,
  slot,
  className,
  routerLink,
  routerDirection,
  iconPosition,
}: ButtonProps) => (
  <IonButton
    className={className}
    color={color ? color : "darkfont"}
    fill="clear"
    onClick={onClick}
    routerLink={routerLink}
    routerDirection={routerDirection ? routerDirection : "forward"}
    slot={slot}
    size={size ? size : "small"}
    style={{
      letterSpacing: "normal",
      textTransform: "none",
      ...style,
    }}
  >
    {iconPosition === "start" ? (
      <>
        <span style={{ marginRight: 4 }}>{icon}</span>
        <span>{text ? text : null}</span>
      </>
    ) : (
      <>
        <span style={{ marginRight: 4 }}>{text ? text : null}</span>
        <span>{icon}</span>
      </>
    )}
  </IonButton>
);

export const OutlinedButton = ({
  icon,
  style,
  text,
  onClick,
  size,
  className,
  routerLink,
  routerDirection,
}: ButtonProps) => (
  <IonButton
    className={className}
    color="protodark"
    fill="outline"
    onClick={onClick}
    routerLink={routerLink}
    routerDirection={routerDirection ? routerDirection : "forward"}
    shape="round"
    size={size ? size : "default"}
    style={{
      letterSpacing: "normal",
      textTransform: "none",
      ...style,
    }}
  >
    {text ? text : ""}
    {icon}
  </IonButton>
);

export const FilledButton = ({
  icon,
  text,
  onClick,
  style,
  size,
  className,
  routerLink,
  routerDirection,
}: ButtonProps) => (
  <IonButton
    className={className}
    color="protodark"
    fill="solid"
    onClick={onClick}
    routerLink={routerLink}
    routerDirection={routerDirection ? routerDirection : "forward"}
    shape="round"
    size={size ? size : "default"}
    style={{
      letterSpacing: "normal",
      textTransform: "none",
      ...style,
    }}
  >
    {text ? text : ""}
    {icon}
  </IonButton>
);
export const IconButton = ({ icon, onClick, style }: ButtonProps) => (
  <a style={style} onClick={onClick}>
    {icon}
  </a>
);
