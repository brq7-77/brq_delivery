import { createContext, useContext, useState, useEffect } from "react";
import { translations } from "./translations";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(
    localStorage.getItem("brq_language") || "en"
  );

  useEffect(() => {
    document.documentElement.dir =
      language === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = language;
  }, [language]);

  const changeLanguage = (lang) => {
    setLanguage(lang);
    localStorage.setItem("brq_language", lang);

    document.documentElement.dir =
      lang === "ar" ? "rtl" : "ltr";

    document.documentElement.lang = lang;
  };

  const t = translations[language];

  return (
    <LanguageContext.Provider
      value={{
        language,
        changeLanguage,
        t,
      }}
    >
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  return useContext(LanguageContext);
}