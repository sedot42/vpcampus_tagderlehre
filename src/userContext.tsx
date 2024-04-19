import { useState, createContext, useEffect } from "react";
import { getUserQuery } from "./requests/queries";
import { createBookmarkMutation, deleteBookmarkMutation } from "./requests/mutations";

import { Anchor, DBAnchor } from "./types/types";

export type UserContextType = {
  userId: Anchor["owner_id"];
  bookmarks: Anchor["id"][];
  createBookmark: (anchorId: Anchor["id"]) => void;
  deleteBookmark: (anchorId: Anchor["id"]) => void;
};

export const UserContext = createContext<UserContextType>({
  userId: "",
  bookmarks: [],
  createBookmark: () => {},
  deleteBookmark: () => {},
});

type Props = { children: React.ReactElement | React.ReactElement[] };

export const UserProvider = ({ children }: Props) => {
  const [bookmarks, setBookmarks] = useState<UserContextType["bookmarks"]>([]);
  const [userId, setUserId] = useState<UserContextType["userId"]>(
    "550e8400-e29b-41d4-a716-446655440000"
  );
  const fetchUser = (userId: Anchor["owner_id"]) => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: getUserQuery, variables: { userId } }),
    })
      .then((res) => res.json())
      .then((res) => {
        if(res.errors) throw new Error(res.errors[0].message);
        setBookmarks(res.data.user.bookmarked_anchors.map((a: DBAnchor) => a.id));
      })
      .catch((e) => {
        console.log(e);
        setBookmarks([]);
      });
  };

  // Populate bookmarks
  useEffect(() => fetchUser(userId), [children, userId]);

  const createBookmark: UserContextType["createBookmark"] = (anchorId) => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: createBookmarkMutation, variables: { anchorId, userId } }),
    })
      .then((response) => response.json())
      .then((res) => {
        // add bookmark
        setBookmarks([...bookmarks, res.data.createBookmark.anchor_id]);
      });
  };

  const deleteBookmark: UserContextType["deleteBookmark"] = (anchorId) => {
    fetch("http://localhost:5000/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query: deleteBookmarkMutation, variables: { anchorId, userId } }),
    })
      .then((response) => response.json())
      .then((res) => {
        if(res.errors) throw new Error(res.errors[0].message);
        // add bookmark
        setBookmarks(bookmarks.filter((b) => b !== res.data.deleteBookmark.anchor_id));
      });
  };

  return (
    <UserContext.Provider
      value={{
        createBookmark,
        deleteBookmark,
        bookmarks,
        userId
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
