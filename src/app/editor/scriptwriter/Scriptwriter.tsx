import React from 'react';
import ScriptwriterPageBar from './ScriptwriterPageBar';

function Scriptwriter({ horizontal, ratio }: { horizontal: boolean, ratio?: number }) {
    return (
        <div className="tt-scriptwriter p-3" style={{
            width: horizontal ? (ratio ? `${ratio * 100}vw` : undefined) : undefined,
            height: horizontal ? undefined : (ratio ? `${ratio * 100}vh` : undefined)
        }}>
            <ScriptwriterPageBar />
        </div>
    );
}
    
export default Scriptwriter;