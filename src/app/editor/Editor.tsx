import React, { useEffect, useState } from 'react';
import Viewfinder from './viewfinder/Viewfinder';
import Scriptwriter from './scriptwriter/Scriptwriter';
import "./Editor.scss";
import usePreference from '../../prefs/usePreference';
import Splitter from './splitter/Splitter';

function Editor() {
    const ratioMatcher = window.matchMedia("(min-aspect-ratio: 1/1)");

    const [isWide, setWide] = useState(ratioMatcher.matches);
    
    const isPrioritizingScriptwriter = usePreference("prioritizeScriptwriter");
    const workspaceRatio = usePreference(
        isWide ? "horizontalWorkspaceRatio" : "verticalWorkspaceRatio"
    );

    useEffect(() => {
        const updateRatio = (ev: MediaQueryList | MediaQueryListEvent) => {
            setWide(ev.matches);
        };
        updateRatio(ratioMatcher);
        ratioMatcher.addEventListener("change", updateRatio);
        return () => {
            ratioMatcher.removeEventListener("change", updateRatio);
        };
    }, [ ratioMatcher, isWide ]);

    const splitter = <Splitter key="tt-splitter" horizontal={isWide} />;
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
                    { splitter }
                    { viewfinder }
                </> : <>
                    { viewfinder }
                    { splitter }
                    { scriptwriter }
                </>
            }
        </div>
    );
}

export default Editor;