import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

const CastPrototypeContext = createContext(null);

export function CastPrototypeProvider({ children }) {
  const [isCasting, setIsCasting] = useState(false);
  const [castDeviceName, setCastDeviceName] = useState(
    /** @type {string | null} */ (null),
  );
  const [castToOpen, setCastToOpen] = useState(false);
  const [networkAccessOpen, setNetworkAccessOpen] = useState(false);
  const [localNetworkOpen, setLocalNetworkOpen] = useState(false);
  const [castingOnDialogOpen, setCastingOnDialogOpen] = useState(false);

  const abortWizard = useCallback(() => {
    setCastToOpen(false);
    setNetworkAccessOpen(false);
    setLocalNetworkOpen(false);
  }, []);

  const openCastTo = useCallback(() => {
    if (isCasting) {
      setCastingOnDialogOpen(true);
      return;
    }
    /** Wizard order: Network Access -> Local Network -> Cast to device list */
    setNetworkAccessOpen(true);
  }, [isCasting]);

  const closeCastTo = useCallback(() => {
    setCastToOpen(false);
  }, []);

  const selectCastDevice = useCallback(
    /** @param {string} name */
    (name) => {
      setCastToOpen(false);
      setIsCasting(true);
      setCastDeviceName(name);
    },
    [],
  );

  const networkAccessOk = useCallback(() => {
    setNetworkAccessOpen(false);
    setLocalNetworkOpen(true);
  }, []);

  const networkAccessCancel = useCallback(() => {
    abortWizard();
  }, [abortWizard]);

  const localNetworkOk = useCallback(() => {
    setLocalNetworkOpen(false);
    setCastToOpen(true);
  }, []);

  const localNetworkBlock = useCallback(() => {
    abortWizard();
  }, [abortWizard]);

  const castingOnOk = useCallback(() => {
    setCastingOnDialogOpen(false);
  }, []);

  const stopCasting = useCallback(() => {
    setCastingOnDialogOpen(false);
    setIsCasting(false);
    setCastDeviceName(null);
  }, []);

  const value = useMemo(
    () => ({
      isCasting,
      castDeviceName,
      castToOpen,
      networkAccessOpen,
      localNetworkOpen,
      castingOnDialogOpen,
      openCastTo,
      closeCastTo,
      selectCastDevice,
      networkAccessOk,
      networkAccessCancel,
      localNetworkOk,
      localNetworkBlock,
      castingOnOk,
      stopCasting,
    }),
    [
      isCasting,
      castDeviceName,
      castToOpen,
      networkAccessOpen,
      localNetworkOpen,
      castingOnDialogOpen,
      openCastTo,
      closeCastTo,
      selectCastDevice,
      networkAccessOk,
      networkAccessCancel,
      localNetworkOk,
      localNetworkBlock,
      castingOnOk,
      stopCasting,
    ],
  );

  return (
    <CastPrototypeContext.Provider value={value}>
      {children}
    </CastPrototypeContext.Provider>
  );
}

export function useCastPrototype() {
  const ctx = useContext(CastPrototypeContext);
  if (!ctx) {
    throw new Error("useCastPrototype must be used within CastPrototypeProvider");
  }
  return ctx;
}
