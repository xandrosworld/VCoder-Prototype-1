import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from "react";
import { translateText, type Language } from "./translations";

type LanguageContextValue = {
  language: Language;
  setLanguage: (language: Language) => void;
  toggleLanguage: () => void;
  t: (text: string) => string;
};

const LanguageContext = createContext<LanguageContextValue | undefined>(undefined);
const storageKey = "vcoder-language";
const originalText = new WeakMap<Text, string>();
const lastRenderedText = new WeakMap<Text, string>();
const originalAttributes = new WeakMap<Element, Map<string, string>>();
const lastRenderedAttributes = new WeakMap<Element, Map<string, string>>();
const translatedAttributes = ["placeholder", "title", "aria-label"] as const;

function readInitialLanguage(): Language {
  return localStorage.getItem(storageKey) === "vi" ? "vi" : "en";
}

function shouldIgnore(node: Node) {
  const element = node instanceof Element ? node : (node as ChildNode).parentElement;
  return Boolean(element?.closest("script, style, pre, code, [data-i18n-ignore]"));
}

function localizeTextNode(node: Text, language: Language) {
  if (shouldIgnore(node)) return;

  const current = node.data;
  const last = lastRenderedText.get(node);
  if (!originalText.has(node) || current !== last) {
    originalText.set(node, current);
  }

  const original = originalText.get(node) ?? current;
  const next = translateText(original, language);
  if (current !== next) node.data = next;
  lastRenderedText.set(node, next);
}

function localizeAttributes(element: Element, language: Language) {
  if (shouldIgnore(element)) return;

  const originals = originalAttributes.get(element) ?? new Map<string, string>();
  const rendered = lastRenderedAttributes.get(element) ?? new Map<string, string>();

  for (const attribute of translatedAttributes) {
    const current = element.getAttribute(attribute);
    if (!current) continue;

    if (!originals.has(attribute) || current !== rendered.get(attribute)) {
      originals.set(attribute, current);
    }

    const original = originals.get(attribute) ?? current;
    const next = translateText(original, language);
    if (current !== next) element.setAttribute(attribute, next);
    rendered.set(attribute, next);
  }

  originalAttributes.set(element, originals);
  lastRenderedAttributes.set(element, rendered);
}

function localizeTree(root: Node, language: Language) {
  if (root instanceof Text) {
    localizeTextNode(root, language);
    return;
  }

  if (root instanceof Element) localizeAttributes(root, language);

  const walker = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    if (node instanceof Text) localizeTextNode(node, language);
    else if (node instanceof Element) localizeAttributes(node, language);
  }
}

function useDocumentLocalization(language: Language) {
  useEffect(() => {
    document.documentElement.lang = language === "vi" ? "vi" : "en";
    document.title = translateText("VCoder Story Demo", language);
    localizeTree(document.body, language);

    let frame = 0;
    const pending = new Set<Node>();
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === "characterData") pending.add(mutation.target);
        if (mutation.type === "childList") {
          mutation.addedNodes.forEach((node) => pending.add(node));
        }
        if (mutation.type === "attributes") pending.add(mutation.target);
      }

      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        pending.forEach((node) => localizeTree(node, language));
        pending.clear();
      });
    });

    observer.observe(document.body, {
      attributes: true,
      attributeFilter: [...translatedAttributes],
      characterData: true,
      childList: true,
      subtree: true
    });

    return () => {
      observer.disconnect();
      window.cancelAnimationFrame(frame);
    };
  }, [language]);
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(readInitialLanguage);
  useDocumentLocalization(language);

  const setLanguage = useCallback((next: Language) => {
    localStorage.setItem(storageKey, next);
    setLanguageState(next);
  }, []);

  const value = useMemo<LanguageContextValue>(
    () => ({
      language,
      setLanguage,
      toggleLanguage: () => setLanguage(language === "en" ? "vi" : "en"),
      t: (text) => translateText(text, language)
    }),
    [language, setLanguage]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const value = useContext(LanguageContext);
  if (!value) throw new Error("useLanguage must be used inside LanguageProvider");
  return value;
}
