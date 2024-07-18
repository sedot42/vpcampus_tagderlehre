const placeholder = () => <div />;

// ---------- RESTORE THIS FILE AFTER THE HACKATHON -----------

// --------------------------------------------------------------
// --------------------------------------------------------------

// import { useState, createContext, useEffect } from "react";
// import { query } from "./requests/queries";
// import {
//   create_mutation,
//   delete_mutation,
//   update_mutation,
// } from "./requests/mutations";

// import {
//   Anchor,
//   DBAnchor,
//   DraftAnchor,
//   convertDBAnchorToFlatAnchor,
// } from "./types/types";
// import { draftAnchor } from "./types/defaults";

// export type AnchorContextType = {
//   createOneAnchor: (anchor: DraftAnchor<DBAnchor>) => void;
//   updateOneAnchor: (anchor: DBAnchor) => void;
//   deleteOneAnchor: (anchor: DBAnchor["id"]) => void;
//   anchors: DBAnchor[];
// };

// export const AnchorContext = createContext<AnchorContextType>({
//   createOneAnchor: () => {},
//   updateOneAnchor: () => {},
//   deleteOneAnchor: () => {},
//   anchors: [],
// });

// type Props = { children: React.ReactElement | React.ReactElement[] };

// export const AnchorProvider = ({ children }: Props) => {
//   const [anchors, setAnchors] = useState<Anchor[]>([]);

//   // Don`t expose this method outside this component. It is used to populate state, share state instead.
//   const fetchAnchors = () => {
//     fetch("http://localhost:5000/", {
//       method: "POST",

//       headers: {
//         "Content-Type": "application/json",
//       },

//       body: JSON.stringify({
//         query,
//       }),
//     })
//       .then((res) => res.json())
//       // restore the original coordinates after saving as an integer
//       .then((res) => {
//         res.data.anchors.forEach((anchor: any) => {
//           anchor.lat =
//             anchor.lat != undefined ? (anchor.lat /= 1_000_000) : null;
//           anchor.lon =
//             anchor.lon != undefined ? (anchor.lon /= 1_000_000) : null;
//         });
//         return res.data.anchors;
//       })
//       .then((resAnchors) => setAnchors(resAnchors))
//       .catch((e) => {
//         console.log(e);
//         setAnchors([]);
//       });
//   };

//   // Populate app state
//   useEffect(() => fetchAnchors(), [children]);

//   const createOneAnchor: AnchorContextType["createOneAnchor"] = (anchor) => {
//     fetch("http://localhost:5000/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },

//       body: JSON.stringify({
//         query: create_mutation,
//         variables: {
//           anchor: {
//             ...anchor,
//           },
//         },
//       }),
//     })
//       .then((res) => res.json())
//       .then(() => fetchAnchors())
//       .catch((e) => {
//         console.log(e);
//         setAnchors([draftAnchor]);
//       });
//   };

//   const updateOneAnchor: AnchorContextType["updateOneAnchor"] = (anchor) => {
//     fetch("http://localhost:5000/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({
//         query: update_mutation,
//         variables: {
//           anchor: {
//             ...anchor,
//           },
//         },
//       }),
//     })
//       .then((response) => response.json())
//       .then(() => fetchAnchors());
//   };

//   const deleteOneAnchor: AnchorContextType["deleteOneAnchor"] = (id) => {
//     fetch("http://localhost:5000/", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },

//       body: JSON.stringify({
//         query: delete_mutation,
//         variables: {
//           deleteAnchorId: id,
//         },
//       }),
//     })
//       .then((res) => res.json())
//       .then(() => fetchAnchors());
//   };

//   return (
//     <AnchorContext.Provider
//       value={{
//         createOneAnchor,
//         updateOneAnchor,
//         deleteOneAnchor,
//         anchors,
//       }}
//     >
//       {children}
//     </AnchorContext.Provider>
//   );
// };
