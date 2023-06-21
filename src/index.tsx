import React from 'react';
import ReactDOM from 'react-dom/client';
import Tater from './app/Tater';
import Preferences from './prefs/Preferences';
import I18n from './i18n/I18n';
import i18next from 'i18next';

declare global {
    interface Window {
        tt: {
            prefs: typeof Preferences;
            i18next: typeof i18next;
        }
    }
}

window.tt = window.tt || {};
window.tt.prefs = Preferences;
window.tt.i18next = i18next;

I18n.init();

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Tater />
    </React.StrictMode>
);
