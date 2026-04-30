import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  GUEST_MUSIC_MAX_ACTIVE_SKIPS,
  GUEST_MUSIC_SKIP_PRUNE_INTERVAL_MS,
  GUEST_MUSIC_SKIP_RECOVERY_MS,
} from "../constants/guestMusicSkips";
import { useUserType } from "./UserTypeContext";

const GuestMusicSkipContext = createContext(null);

function pruneExpiries(expiries, now = Date.now()) {
  return expiries.filter((t) => t > now);
}

function minutesUntilOldestExpiry(expiries, now = Date.now()) {
  if (expiries.length === 0) return 1;
  const oldest = Math.min(...expiries);
  const sec = Math.max(0, (oldest - now) / 1000);
  return Math.max(1, Math.ceil(sec / 60));
}

/**
 * Wrapper remounts inner state whenever `userType` changes — clears hourly tallies without a reset effect.
 */
export function GuestMusicSkipProvider({ children }) {
  const { userType } = useUserType();
  return (
    <GuestMusicSkipInnerProvider key={userType}>{children}</GuestMusicSkipInnerProvider>
  );
}

function GuestMusicSkipInnerProvider({ children }) {
  const { userType } = useUserType();
  const [expiries, setExpiries] = useState([]);
  const expiriesRef = useRef([]);
  const [skipLimitDialogOpen, setSkipLimitDialogOpen] = useState(false);
  const [skipLimitDialogMinutes, setSkipLimitDialogMinutes] = useState(1);

  const dismissSkipLimitDialog = useCallback(() => {
    setSkipLimitDialogOpen(false);
  }, []);

  /**
   * Guest music skip: records a recovery timestamp or opens the limit dialog.
   * `expiriesRef` updates synchronously so rapid taps never read stale state.
   * @returns {boolean} true if skip allowed (guest under cap, or non-guest).
   */
  const consumeGuestMusicSkip = useCallback(() => {
    if (userType !== "guest") return true;
    const now = Date.now();
    const pruned = pruneExpiries(expiriesRef.current, now);
    if (pruned.length >= GUEST_MUSIC_MAX_ACTIVE_SKIPS) {
      expiriesRef.current = pruned;
      setExpiries(pruned);
      setSkipLimitDialogMinutes(minutesUntilOldestExpiry(pruned, now));
      setSkipLimitDialogOpen(true);
      return false;
    }
    const next = [...pruned, now + GUEST_MUSIC_SKIP_RECOVERY_MS].sort((a, b) => a - b);
    expiriesRef.current = next;
    setExpiries(next);
    return true;
  }, [userType]);

  useEffect(() => {
    const id = window.setInterval(() => {
      setExpiries((prev) => {
        const next = pruneExpiries(prev);
        if (
          next.length === prev.length &&
          next.every((t, i) => t === prev[i])
        ) {
          return prev;
        }
        expiriesRef.current = next;
        return next;
      });
    }, GUEST_MUSIC_SKIP_PRUNE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, []);

  const guestActiveSkipCount = userType === "guest" ? expiries.length : 0;

  const value = useMemo(
    () => ({
      guestActiveSkipCount,
      consumeGuestMusicSkip,
      skipLimitDialogOpen,
      skipLimitDialogMinutes,
      dismissSkipLimitDialog,
      guestMusicMaxActiveSkips: GUEST_MUSIC_MAX_ACTIVE_SKIPS,
    }),
    [
      guestActiveSkipCount,
      consumeGuestMusicSkip,
      skipLimitDialogOpen,
      skipLimitDialogMinutes,
      dismissSkipLimitDialog,
    ],
  );

  return (
    <GuestMusicSkipContext.Provider value={value}>{children}</GuestMusicSkipContext.Provider>
  );
}

export function useGuestMusicSkips() {
  const ctx = useContext(GuestMusicSkipContext);
  if (!ctx) {
    throw new Error("useGuestMusicSkips must be used within GuestMusicSkipProvider");
  }
  return ctx;
}
