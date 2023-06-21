import React, { useContext, useEffect } from 'react';
import ScriptwriterPageBar from './ScriptwriterPageBar';
import EditorContext from '../EditorContext';
import ScriptwriterPage from './ScriptwriterPage';
import "./Scriptwriter.scss";

function Scriptwriter({ horizontal, ratio }: { horizontal: boolean, ratio?: number }) {
    const { project, focusedPage, setFocusedPage } = useContext(EditorContext);

    const pages = project?.manifest.pages.map(
        (p, i) => <ScriptwriterPage page={p} pageNo={i + 1} key={p.internalId} />
    ) ?? [];

    useEffect(() => {
        if (focusedPage === undefined && (project?.manifest.pages.length ?? 0) > 0) {
            setFocusedPage?.(project?.manifest.pages[0] ?? undefined);
        }
    });

    return (
        <div className="tt-scriptwriter" style={{
            width: horizontal ? (ratio ? `${ratio * 100}vw` : undefined) : undefined,
            height: horizontal ? undefined : (ratio ? `${ratio * 100}vh` : undefined)
        }}>
            <ScriptwriterPageBar />
            <div className="tt-scriptwriter-pages">
                {pages}
            </div>
        </div>
    );
}
    
export default Scriptwriter;