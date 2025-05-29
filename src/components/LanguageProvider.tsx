import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import enTranslations from "../translations/en.json";
import hiTranslations from "../translations/hi.json";
import mrTranslations from "../translations/mr.json";

type Language = "en" | "hi" | "mr";

type TranslationValue = string | string[] | Record<string, any>;

type LanguageContextType = {
  language: Language;
  setLanguage: (language: Language) => void;
  t: (key: string) => TranslationValue;
  hasSelectedLanguage: boolean;
};

const translations = {
  en: enTranslations,
  hi: hiTranslations,
  mr: mrTranslations
};

const LanguageContext = createContext<LanguageContextType>({
  language: "en",
  setLanguage: () => {},
  t: () => "",
  hasSelectedLanguage: false,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>(() => {
    // Try to get language from localStorage
    const savedLanguage = localStorage.getItem("language");
    return (savedLanguage as Language) || "mr";
  });
  
  const [hasSelectedLanguage, setHasSelectedLanguage] = useState(false);

  // Update localStorage when language changes
  useEffect(() => {
    localStorage.setItem("language", language);
    setHasSelectedLanguage(true);
  }, [language]);

  const t = (key: string): TranslationValue => {
    const keys = key.split('.');
    let result: any = translations[language];
    
    for (const k of keys) {
      if (result && result[k] !== undefined) {
        result = result[k];
      } else {
        return key; // Return the key if translation not found
      }
    }
    
    return result;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, hasSelectedLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
