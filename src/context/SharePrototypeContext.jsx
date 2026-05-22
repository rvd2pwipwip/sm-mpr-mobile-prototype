import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

/** @typedef {'idle' | 'web-share-mock' | 'facebook-mock'} SharePrototypeStep */

const SharePrototypeContext = createContext(null);

export function SharePrototypeProvider({ children }) {
  const [step, setStep] = useState(
    /** @type {SharePrototypeStep} */ ("idle"),
  );

  const openSharePrototype = useCallback(() => {
    setStep("web-share-mock");
  }, []);

  const advanceToFacebookMock = useCallback(() => {
    setStep("facebook-mock");
  }, []);

  const closeSharePrototype = useCallback(() => {
    setStep("idle");
  }, []);

  const value = useMemo(
    () => ({
      step,
      openSharePrototype,
      advanceToFacebookMock,
      closeSharePrototype,
    }),
    [step, openSharePrototype, advanceToFacebookMock, closeSharePrototype],
  );

  return (
    <SharePrototypeContext.Provider value={value}>
      {children}
    </SharePrototypeContext.Provider>
  );
}

export function useSharePrototype() {
  const ctx = useContext(SharePrototypeContext);
  if (!ctx) {
    throw new Error(
      "useSharePrototype must be used within SharePrototypeProvider",
    );
  }
  return ctx;
}
