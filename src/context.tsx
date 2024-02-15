import { useState, createContext, useEffect } from "react";
import { query } from "./requests/queries";
import {
  create_mutation,
  delete_mutation,
  update_mutation,
} from "./requests/mutations";

import { Anchor } from "./types/types";
import { defaultAnchor } from "./types/defaults";

export type AnchorContextType = {
  setOneAnchor: (anchor: Anchor) => void;
  updateOneAnchor: (anchor: Anchor) => void;
  deleteOneAnchor: (anchor: Anchor) => void;
  anchors: Anchor[];
};

export const AnchorContext = createContext<AnchorContextType>({
  setOneAnchor: () => {},
  updateOneAnchor: () => {},
  deleteOneAnchor: () => {},
  anchors: [],
});

type Props = { children: React.ReactElement | React.ReactElement[] };

export const AnchorProvider = ({ children }: Props) => {
  const [anchors, setAnchors] = useState<Anchor[]>([]);

  // Don`t expose this method outside this component. It is used to populate state, share state instead.
  const fetchAnchors = () => {
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
  };

  // Populate app state
  useEffect(() => fetchAnchors(), [children]);

  const setOneAnchor = (anchor: Anchor) => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query: create_mutation,
        variables: {
          anchor: {
            ...anchor,
          },
        },
      }),
    })
      .then((res) => res.json())
      .then(() => fetchAnchors());
  };

  const updateOneAnchor = (anchor: Anchor) => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        query: update_mutation,
        variables: {
          anchor: {
            ...anchor,
          },
        },
      }),
    })
      .then((response) => response.json())
      .then(() => fetchAnchors());
  };

  const deleteOneAnchor = (anchor: Anchor) => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        query: delete_mutation,
        variables: {
          deleteAnchorId: anchor.id,
        },
      }),
    })
      .then((res) => res.json())
      .then(() => fetchAnchors());
  };

  return (
    <AnchorContext.Provider
      value={{
        setOneAnchor,
        updateOneAnchor,
        deleteOneAnchor,
        anchors,
      }}
    >
      {children}
    </AnchorContext.Provider>
  );
};
