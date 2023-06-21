import i18next from "i18next";
import LanguageDetector from 'i18next-browser-languagedetector';
import resourcesToBackend from "i18next-resources-to-backend";
import { initReactI18next } from "react-i18next";

export default class I18n {
    static init() {
        i18next
            .use(initReactI18next)
            .use(
                resourcesToBackend(
                    (language: string, namespace: string) => 
                        import(`./${language}/${namespace}.json`)
                )
            )
            .use(LanguageDetector)
            .init({
                ns: ["common", "editor"],
                defaultNS: "common",
                nonExplicitSupportedLngs: true,
                fallbackLng: "en-US",
                cleanCode: true,
                interpolation: {
                    escapeValue: false,
                },
            });
    }
}