import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import en from "./locales/en.json";
import es from "./locales/es.json";
import fr from "./locales/fr.json";
import de from "./locales/de.json";
import pt from "./locales/pt.json";
import zh from "./locales/zh.json";
import hi from "./locales/hi.json";
import ja from "./locales/ja.json";
import ru from "./locales/ru.json";
import ar from "./locales/ar.json";
import ko from "./locales/ko.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: en },
      "zh-CN": { translation: zh },
      es: { translation: es },
      hi: { translation: hi },
      ar: { translation: ar },
      "pt-BR": { translation: pt },
      ja: { translation: ja },
      ko: { translation: ko },
      de: { translation: de },
      fr: { translation: fr },
      ru: { translation: ru },
    },
    fallbackLng: "en",
    supportedLngs: ["en", "zh-CN", "es", "hi", "ar", "pt-BR", "ja", "ko", "de", "fr"],
    interpolation: { escapeValue: false },
    detection: {
      order: ["querystring", "cookie", "localStorage", "navigator", "htmlTag"],
      caches: ["localStorage", "cookie"],
    },
  });

export default i18n;
