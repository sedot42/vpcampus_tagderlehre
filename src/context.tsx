import { useState, createContext } from "react";
import { query } from "./requests/queries";

import { Anchor } from "./types/types";
import { defaultAnchor } from "./types/defaults";

export type AnchorContextType = {
  getAnchors: () => Anchor[];
  setAnchor: (anchor: Anchor) => void;
};

export const AnchorContext = createContext<AnchorContextType>({
  getAnchors: () => [],
  setAnchor: () => {},
});

type Props = { children: React.ReactElement | React.ReactElement[] };

export const AnchorProvider = ({ children }: Props) => {
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  const getAnchors = () => {
    fetch("http://localhost:5000/", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query,
      }),
    })
      .then((res) => res.json())
      .then((res) => setAnchors(res.data.anchors))
      .catch((e) => {
        console.log(e);
        setAnchors([defaultAnchor]);
      });
    return anchors;
  };

  const setAnchor = () => []; // todos

  return (
    <AnchorContext.Provider
      value={{
        getAnchors,
        setAnchor,
      }}
    >
      {children}
    </AnchorContext.Provider>
  );
};
