import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
import { isLikeContentKind } from "../constants/likes.js";

const LikesContext = createContext(null);

export function LikesProvider({ children }) {
  const [items, setItems] = useState(/** @type {import('../constants/likes.js').LikedContentItem[]} */ ([]));

  const isLiked = useCallback((kind, id) => {
    if (!id || !isLikeContentKind(kind)) return false;
    return items.some((x) => x.kind === kind && x.id === id);
  }, [items]);

  const toggleLike = useCallback((item) => {
    if (!item?.id || !isLikeContentKind(item.kind)) return;
    setItems((prev) => {
      const exists = prev.some(
        (x) => x.kind === item.kind && x.id === item.id,
      );
      if (exists) {
        return prev.filter(
          (x) => !(x.kind === item.kind && x.id === item.id),
        );
      }
      return [item, ...prev];
    });
  }, []);

  const value = useMemo(
    () => ({
      items,
      isLiked,
      toggleLike,
    }),
    [items, isLiked, toggleLike],
  );

  return (
    <LikesContext.Provider value={value}>{children}</LikesContext.Provider>
  );
}

export function useLikes() {
  const ctx = useContext(LikesContext);
  if (!ctx) {
    throw new Error("useLikes must be used within LikesProvider");
  }
  return ctx;
}
