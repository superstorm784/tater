import React from 'react';

function Scriptwriter({ horizontal, ratio }: { horizontal: boolean, ratio?: number }) {
    return (
        <div className="tt-scriptwriter" style={{
            width: horizontal ? (ratio ? `${ratio * 100}vw` : undefined) : undefined,
            height: horizontal ? undefined : (ratio ? `${ratio * 100}vh` : undefined)
        }}>
            script goes here waaaaah
        </div>
    );
}
    
export default Scriptwriter;