import { useEffect, useState } from "react";
import Preferences from "./Preferences";

export default function usePreference<K extends keyof typeof Preferences>(
    preferenceName: K
): ReturnType<typeof Preferences[K]["get"]> {
    const pref = Preferences[preferenceName];

    const [ prefState, setPrefState ] = useState(pref.get());
    useEffect(() => {
        const prefChangeListener = () => setPrefState(pref.get());
        pref.addEventListener("change", prefChangeListener);
        return () => pref.removeEventListener("change", prefChangeListener);
    }, [ pref, prefState ]);

    return prefState as ReturnType<typeof Preferences[K]["get"]>;
}