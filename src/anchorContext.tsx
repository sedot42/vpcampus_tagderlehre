import { useState, createContext } from "react";
import { DBAnchor } from "./types/types";
import { mockState } from "./mockState";

// RESTORE THIS FILE AFTER THE HACKATHON

export type AnchorContextType = {
  createOneAnchor: (anchor: DBAnchor) => void;
  updateOneAnchor: (anchor: DBAnchor) => void;
  deleteOneAnchor: (anchor: DBAnchor["id"]) => void;
  anchors: DBAnchor[];
};

export const AnchorContext = createContext<AnchorContextType>({
  createOneAnchor: () => {},
  updateOneAnchor: () => {},
  deleteOneAnchor: () => {},
  anchors: [],
});

type Props = { children: React.ReactElement | React.ReactElement[] };

export const AnchorProvider = ({ children }: Props) => {
  const [anchors, setAnchors] = useState<DBAnchor[]>(mockState);

  const createOneAnchor: AnchorContextType["createOneAnchor"] = (anchor) => {
    setAnchors([...anchors, anchor]);
    return [...anchors, anchor];
  };

  const updateOneAnchor: AnchorContextType["updateOneAnchor"] = (anchor) => {
    const newState = anchors.map((a) => (a.id === anchor.id ? anchor : a));
    setAnchors(newState);
    return newState;
  };

  const deleteOneAnchor: AnchorContextType["deleteOneAnchor"] = (id) => {
    const newState = anchors.filter((a) => a.id !== id);
    setAnchors(newState);
    return newState;
  };

  return (
    <AnchorContext.Provider
      value={{
        createOneAnchor,
        updateOneAnchor,
        deleteOneAnchor,
        anchors,
      }}
    >
      {children}
    </AnchorContext.Provider>
  );
};
