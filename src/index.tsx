import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Tater from './app/Tater';
import Preferences from './prefs/Preferences';

declare global {
    interface Window {
        tt: {
            prefs: typeof Preferences;
        }
    }
}

window.tt = window.tt || {};
window.tt.prefs = Preferences;

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
    <React.StrictMode>
        <Tater />
    </React.StrictMode>
);
