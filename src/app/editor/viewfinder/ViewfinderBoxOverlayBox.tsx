import { KeyboardEvent, MouseEvent as ReactMouseEvent, useContext, useEffect, useState } from "react";
import EditorContext from "../EditorContext";
import ViewfinderContext from "./ViewfinderContext";
import TextBlob from "../../../projects/TextBlob";

function ViewfinderBoxOverlayBox({ blob: b }: { blob: TextBlob }) {
    const { setProject, focusedPage, focusedBlob, setFocusedBlob } = useContext(EditorContext);
    const { imageWidth, imageHeight } = useContext(ViewfinderContext);

    const [ dragging, setDragging ] = useState(false);
    const [ dragOrigin, setDragOrigin ] = useState<[number, number] | null>(null);
    const [ dragUnlocked, setDragUnlocked ] = useState<boolean>(false);

    const topLeftX = Math.min(b.pageTopLeft![0], b.pageBottomRight![0]);
    const topLeftY = Math.min(b.pageTopLeft![1], b.pageBottomRight![1]);
    const bottomRightX = Math.max(b.pageTopLeft![0], b.pageBottomRight![0]);
    const bottomRightY = Math.max(b.pageTopLeft![1], b.pageBottomRight![1]);

    const mouseEnter = (e: ReactMouseEvent) => {
        console.log(e.buttons);
        if (e.buttons === 0) {
            setDragging(false);
            setDragUnlocked(false);
        }
    }
    const mouseDown = (e: ReactMouseEvent) => {
        e.stopPropagation();
        setFocusedBlob!(b);
        setDragging(true);
        setDragOrigin([e.clientX, e.clientY]);
    }
    const mouseMove = (e: MouseEvent) => {
        if (!dragging) return;

        const deltaX = e.clientX - (dragOrigin ? dragOrigin[0] : 0);
        const deltaY = e.clientY - (dragOrigin ? dragOrigin[1] : 0);

        console.log(deltaX, deltaY);
        if (!dragUnlocked && (Math.abs(deltaX) < 3 || Math.abs(deltaY) < 3)) return;
        setDragUnlocked(true);

        const deltaXPercentage = deltaX / imageWidth!;
        const deltaYPercentage = deltaY / imageHeight!;

        let newTopLeftX = topLeftX + deltaXPercentage;
        let newTopLeftY = topLeftY + deltaYPercentage;
        let newBottomRightX = bottomRightX + deltaXPercentage;
        let newBottomRightY = bottomRightY + deltaYPercentage;

        if (newTopLeftX < 0) {
            newBottomRightX -= newTopLeftX;
            newTopLeftX = 0;
        }
        if (newTopLeftY < 0) {
            newBottomRightY -= newTopLeftY;
            newTopLeftY = 0;
        }

        if (newBottomRightX > 1) {
            newTopLeftX -= newBottomRightX - 1;
            newBottomRightX = 1;
        }
        if (newBottomRightY > 1) {
            newTopLeftY -= newBottomRightY - 1;
            newBottomRightY = 1;
        }

        b.pageTopLeft = [newTopLeftX, newTopLeftY];
        b.pageBottomRight = [newBottomRightX, newBottomRightY];
        setProject!();
        setDragOrigin([e.clientX, e.clientY]);
    }
    const mouseUp = (e: ReactMouseEvent) => {
        setDragging(false);
        setDragUnlocked(false);
    }

    const onBoxKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") {
            setFocusedBlob!(undefined);
        } else if (e.key === "Delete") {
            const successorBlob = b.nextBlob ?? undefined;
            const predecessorBlob = b.previousBlob ?? undefined;
            focusedPage!.blobs.splice(focusedPage!.blobs.indexOf(b), 1);
            setFocusedBlob!(successorBlob ?? predecessorBlob);
            setProject!();
            if (!successorBlob && predecessorBlob) {
                // We're going backwards, this needs funky work.
                document.querySelector<HTMLElement>(
                    `.tt-viewfinder-boxoverlay-box[data-blob-internalId="${
                        predecessorBlob.internalId
                    }"]`
                )?.focus();
            }
        }
    }

    useEffect(() => {
        document.body.addEventListener("mousemove", mouseMove);
        return () => {
            document.body.removeEventListener("mousemove", mouseMove);
        }
    })

    return <div
        className={`tt-viewfinder-boxoverlay-box ${
            focusedBlob === b ? "tt-viewfinder-boxoverlay-focused" : ""
        }`}
        style={{
            top: `${imageHeight! * topLeftY}px`,
            left: `${imageWidth! * topLeftX}px`,
            height: `${imageHeight! * (bottomRightY - topLeftY)}px`,
            width: `${imageWidth! * (bottomRightX - topLeftX)}px`
        }}
        onMouseEnter={mouseEnter}
        onMouseDown={mouseDown}
        onMouseUp={mouseUp}
        onKeyUp={onBoxKey}
        tabIndex={-1}
        data-blob-internalId={b.internalId}
    />;
}

export default ViewfinderBoxOverlayBox;