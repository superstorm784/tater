import React, { useEffect } from 'react';
import './Tater.scss';
import Editor from './editor/Editor';
import usePreference from '../prefs/usePreference';

function Tater() {
    const isDark = usePreference("darkMode");

    const darkQueryMatcher = window.matchMedia("(prefers-color-scheme: dark)");
    useEffect(() => {
        const checkForDarkMode = () => {
            const darkModeEnabled = isDark === null ? darkQueryMatcher.matches : isDark;
            document.documentElement.setAttribute("data-bs-theme", darkModeEnabled ? "dark" : "light");
        };
        checkForDarkMode();
        darkQueryMatcher.addEventListener("change", checkForDarkMode);
        return () => darkQueryMatcher.removeEventListener("change", checkForDarkMode);
    }, [ isDark, darkQueryMatcher ]);

    return (
        <div id="tater">
            <header className="tt-header">
            </header>
            <main>
                <Editor />
            </main>
        </div>
    );
}

export default Tater;
