import { DragEvent, useState } from "react";
import Preferences from "../../../prefs/Preferences";

function clampAndSnap(ratio: number): number {
    const snapThreshold = 0.02;

    return Math.min(0.9, Math.max(0.1, 
        Math.abs(0.3 - ratio) < snapThreshold ? 0.3 : (
            Math.abs(0.5 - ratio) < snapThreshold ? 0.5 : (
                Math.abs(0.7 - ratio) < snapThreshold ? 0.7 : (
                    Math.round(ratio * 1000) / 1000
                )
            )
        )
    ));
}

function Splitter({ horizontal }: { horizontal: boolean }) {
    const [isDragging, setDragging] = useState(false);

    const dragStart = (ev: DragEvent<HTMLDivElement>) => {
        const canvas = document.createElement('canvas');
        ev.dataTransfer.setDragImage(canvas, 0, 0);
        canvas.remove();
        setDragging(true)
    };
    const dragEnd = () => setDragging(false);

    const allowDrop = (ev: DragEvent<HTMLDivElement>) => {
        if (horizontal) {
            const ratio = clampAndSnap(ev.clientX / window.innerWidth);
            console.log(ratio);
            Preferences.horizontalWorkspaceRatio.set(ratio);
        } else {
            const ratio = clampAndSnap(ev.clientY / window.innerHeight);
            console.log(ratio);
            Preferences.verticalWorkspaceRatio.set(ratio);
        }
        ev.preventDefault();
    }

    return <>
        {isDragging && <div className="tt-splitter-dropzone" onDragOver={allowDrop}/>}
        <div className="tt-splitter" role="presentation" style={{
            position: "relative",
            width: horizontal ? undefined : "100vw",
            height: horizontal ? "calc(100vh - var(--tt-toolbar-height))" : undefined
        }} draggable="true" onDragStart={dragStart} onDragEnd={dragEnd} onDragOver={allowDrop}>
            <div className="tt-splitter-handle"></div>
        </div>
    </>;
}

export default Splitter;