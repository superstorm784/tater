import React, { useContext } from 'react';
import EditorContext from '../EditorContext';

function Viewfinder({ horizontal, ratio }: { horizontal: boolean, ratio?: number }) {
    const { focusedPage } = useContext(EditorContext);

    const activePageNo = focusedPage?.manifest.pages.indexOf(focusedPage);

    return (
        <div className="tt-viewfinder" style={{
            width: horizontal ? (ratio ? `${ratio * 100}vw` : undefined) : undefined,
            height: horizontal ? undefined : (ratio ? `${ratio * 100}vh` : undefined)
        }}>
            image goes here waaaaah page {
                activePageNo !== undefined ? activePageNo + 1 : "undefined"
            } is active
        </div>
    );
}

export default Viewfinder;