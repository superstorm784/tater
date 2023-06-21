import React, { useContext } from 'react';
import ScriptwriterPageBar from './ScriptwriterPageBar';
import EditorContext from '../EditorContext';
import ScriptwriterPage from './ScriptwriterPage';
import "./Scriptwriter.scss";

function Scriptwriter({ horizontal, ratio }: { horizontal: boolean, ratio?: number }) {
    const { project } = useContext(EditorContext);

    const pages = project?.manifest.pages.map(
        (p, i) => <ScriptwriterPage page={p} pageNo={i + 1} key={p.internalId} />
    ) ?? [];

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