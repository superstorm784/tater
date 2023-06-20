import React from 'react';

function Viewfinder({ horizontal, ratio }: { horizontal: boolean, ratio?: number }) {
    return (
        <div className="tt-viewfinder" style={{
            width: horizontal ? (ratio ? `${ratio * 100}vw` : undefined) : undefined,
            height: horizontal ? undefined : (ratio ? `${ratio * 100}vh` : undefined)
        }}>
            image goes here waaaaah
        </div>
    );
}

export default Viewfinder;