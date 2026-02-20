'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import en from '../translations/en.json';
import de from '../translations/de.json';

type Language = 'en' | 'de';
type Translations = typeof en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const dictionaries: Record<Language, Translations> = { en, de };

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');
    const [isLoaded, setIsLoaded] = useState(false);

    useEffect(() => {
        const savedLang = localStorage.getItem('language') as Language;
        if (savedLang && (savedLang === 'en' || savedLang === 'de')) {
            setLanguage(savedLang);
        }
        setIsLoaded(true);
    }, []);

    const handleSetLanguage = (lang: Language) => {
        setLanguage(lang);
        localStorage.setItem('language', lang);
    };

    const t = (path: string) => {
        const dict = dictionaries[language];
        const keys = path.split('.');
        let result: any = dict;

        for (const key of keys) {
            if (result && result[key]) {
                result = result[key];
            } else {
                return path; // Fallback to key name if not found
            }
        }
        return result;
    };

    return (
        <LanguageContext.Provider value={{ language, setLanguage: handleSetLanguage, t }}>
            <div style={{ opacity: isLoaded ? 1 : 0 }}>
                {children}
            </div>
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => {
    const context = useContext(LanguageContext);
    if (!context) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
};
