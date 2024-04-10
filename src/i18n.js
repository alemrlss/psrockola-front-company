// i18n.js
import i18n from "i18next";
import { initReactI18next } from "react-i18next";

const storedLanguage = localStorage.getItem("language");

i18n.use(initReactI18next).init({
  resources: {
    us: {
      translation: {
        test: "Test",
      },
    },
    es: {
      translation: {
        test: "Prueba",
      },
    },
    pt: {
      translation: {
        test: "Teste",
      },
    },
  },
  lng: storedLanguage || "us",
  fallbackLng: "us",
  interpolation: {
    escapeValue: false,
  },
});

export default i18n;
