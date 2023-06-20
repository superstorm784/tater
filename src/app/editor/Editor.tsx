import React, { useEffect, useState } from 'react';
import Viewfinder from './viewfinder/Viewfinder';
import Scriptwriter from './scriptwriter/Scriptwriter';
import "./Editor.scss";
import usePreference from '../../prefs/usePreference';

function Editor() {
    const [isWide, setWide] = useState(false);
    
    const isPrioritizingScriptwriter = usePreference("prioritizeScriptwriter");
    const workspaceRatio = usePreference(
        isWide ? "horizontalWorkspaceRatio" : "verticalWorkspaceRatio"
    );

    useEffect(() => {
        const ratioMatcher = window.matchMedia("(min-aspect-ratio: 1/1)");
        const updateRatio = (ev: MediaQueryList | MediaQueryListEvent) => {
            setWide(ev.matches);
        };
        updateRatio(ratioMatcher);
        ratioMatcher.addEventListener("change", updateRatio);
        return () => {
            ratioMatcher.removeEventListener("change", updateRatio);
        };
    }, [ isWide ]);

    const viewfinder = <Viewfinder key="tt-viewfinder" horizontal={isWide}
        ratio={ isPrioritizingScriptwriter ? undefined : workspaceRatio } />;
    const scriptwriter = <Scriptwriter key="tt-scriptwriter" horizontal={isWide}
        ratio={ isPrioritizingScriptwriter ? workspaceRatio : undefined } />;

    return (
        <div className={`tt-editor ${
            isWide ? "wide" : "tall"
        }`}>
            {
                isPrioritizingScriptwriter ? <>
                    { scriptwriter }
                    { viewfinder }
                </> : <>
                    { viewfinder }
                    { scriptwriter }
                </>
            }
        </div>
    );
}

export default Editor;