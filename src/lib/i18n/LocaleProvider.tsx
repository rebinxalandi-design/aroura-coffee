"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionary, type Dictionary, type Locale } from "./dictionary";

const STORAGE_KEY = "aroura_locale";

interface LocaleContextValue {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
  ready: boolean;
  showLangModal: boolean;
  chooseLocale: (locale: Locale) => void;
}

const LocaleContext = createContext<LocaleContextValue | null>(null);

function readStoredLocale(): Locale | null {
  if (typeof window === "undefined") return null;
  try {
    const fromStorage = window.localStorage.getItem(STORAGE_KEY);
    if (fromStorage === "en" || fromStorage === "fa") return fromStorage;
  } catch {
    // localStorage may be unavailable (private mode, etc.)
  }
  return null;
}

export default function LocaleProvider({ children }: { children: ReactNode }) {
  // The server can never see localStorage, so it always renders as if no
  // locale were stored yet (English, modal hidden) to guarantee the first
  // paint matches on both sides. Once mounted, an effect reconciles both
  // values against localStorage — this intentionally trades "the modal
  // might pop in a frame late" for "no hydration mismatch," rather than
  // guessing at a value the server can't actually know.
  const [locale, setLocaleState] = useState<Locale>("en");
  const [showLangModal, setShowLangModal] = useState(false);
  const [ready] = useState(true);

  useEffect(() => {
    const stored = readStoredLocale();
    if (stored) {
      // eslint-disable-next-line react-hooks/set-state-in-effect -- syncing with localStorage, not derivable during render/SSR
      setLocaleState(stored);
    } else {
      setShowLangModal(true);
    }
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = locale === "fa" ? "rtl" : "ltr";
  }, [locale]);

  const persist = useCallback((next: Locale) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      // ignore
    }
  }, []);

  const setLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      persist(next);
    },
    [persist]
  );

  const chooseLocale = useCallback(
    (next: Locale) => {
      setLocaleState(next);
      persist(next);
      setShowLangModal(false);
    },
    [persist]
  );

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      setLocale,
      t: dictionary[locale],
      ready,
      showLangModal,
      chooseLocale,
    }),
    [locale, setLocale, ready, showLangModal, chooseLocale]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

export function useLocale() {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
