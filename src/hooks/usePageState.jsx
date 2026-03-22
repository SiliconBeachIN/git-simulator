import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

const STORAGE_PREFIX = "git-simulator:page-state:v1";
const DEBOUNCE_MS = 300;
const APP_STORAGE_KEYS = {
  activePage: "git-simulator:active-page:v1",
};

const PageSessionContext = createContext({ pageId: "home" });

const isBrowser = () => typeof window !== "undefined";

const getPageStorageKey = (pageId) => `${STORAGE_PREFIX}:${pageId}`;

const readPageState = (pageId) => {
  if (!isBrowser()) return {};
  try {
    const raw = window.localStorage.getItem(getPageStorageKey(pageId));
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === "object" ? parsed : {};
  } catch {
    return {};
  }
};

const writePageState = (pageId, pageState) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(getPageStorageKey(pageId), JSON.stringify(pageState));
  } catch {
    // Ignore storage write failures (private mode/quota/security constraints).
  }
};

export const clearPersistedPageState = (pageId) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.removeItem(getPageStorageKey(pageId));
  } catch {
    // Ignore storage removal failures.
  }
};

export const getPersistedActivePage = () => {
  if (!isBrowser()) return null;
  try {
    return window.localStorage.getItem(APP_STORAGE_KEYS.activePage);
  } catch {
    return null;
  }
};

export const setPersistedActivePage = (pageId) => {
  if (!isBrowser()) return;
  try {
    window.localStorage.setItem(APP_STORAGE_KEYS.activePage, pageId);
  } catch {
    // Ignore storage write failures.
  }
};

export function PageSessionProvider({ pageId, children }) {
  const value = useMemo(() => ({ pageId }), [pageId]);
  return <PageSessionContext.Provider value={value}>{children}</PageSessionContext.Provider>;
}

export function usePageState(stateKey, initialValue) {
  const { pageId } = useContext(PageSessionContext);

  const [value, setValue] = useState(() => {
    const pageState = readPageState(pageId);
    if (Object.prototype.hasOwnProperty.call(pageState, stateKey)) {
      return pageState[stateKey];
    }
    return typeof initialValue === "function" ? initialValue() : initialValue;
  });

  const timerRef = useRef(null);

  useEffect(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      const pageState = readPageState(pageId);
      writePageState(pageId, { ...pageState, [stateKey]: value });
    }, DEBOUNCE_MS);
    return () => clearTimeout(timerRef.current);
  }, [pageId, stateKey, value]);

  const setValueStable = useCallback((v) => setValue(v), []);

  return [value, setValueStable];
}
