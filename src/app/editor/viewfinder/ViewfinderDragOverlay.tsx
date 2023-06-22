import { MouseEvent, useContext, useState } from "react";
import ViewfinderContext from "./ViewfinderContext";
import TextBlob from "../../../projects/TextBlob";
import EditorContext from "../EditorContext";

function ViewfinderDragOverlay() {
    const { setProject, focusedPage } = useContext(EditorContext);
    const {
        drawing, drawingPoint1, drawingPoint2,
        imageWidth, imageHeight,
        setDrawingPoint1, setDrawingPoint2
    } = useContext(ViewfinderContext);
    const [ dragging, setDragging ] = useState<boolean>(false);

    const beginDrag = (e: MouseEvent<HTMLImageElement>) => {
        if (!drawing) return;
        const percentX = e.nativeEvent.offsetX / imageWidth!;
        const percentY = e.nativeEvent.offsetY / imageHeight!;
        setDragging(true);
        setDrawingPoint1!([ percentX, percentY ]);
        setDrawingPoint2!([ percentX, percentY ]);
    }

    const whileDrag = (e: MouseEvent<HTMLImageElement>) => {
        if (!drawing || !dragging) return;

        const percentX = e.nativeEvent.offsetX / imageWidth!;
        const percentY = e.nativeEvent.offsetY / imageHeight!;
        setDrawingPoint2!([ percentX, percentY ]);
    }

    const endDrag = (e: MouseEvent<HTMLImageElement>) => {
        if (!drawing) return;
        const percentX = e.nativeEvent.offsetX / imageWidth!;
        const percentY = e.nativeEvent.offsetY / imageHeight!;

        const [ blobNo, panelNo ] = focusedPage!.nextBlobNo;
        focusedPage?.blobs.push(TextBlob.create(
            focusedPage, blobNo, panelNo,
            [ drawingPoint1!, [ percentX, percentY ] ], ""
        ));

        setDragging(false);
        setDrawingPoint1!(null);
        setDrawingPoint2!(null);
        setProject!();
    }

    return <div className="tt-viewfinder-dragoverlay" data-dragging={dragging}>
        <div 
            className="tt-viewfinder-dragoverlay-area"
            style={{
                width: imageWidth ? `${imageWidth}px` : undefined,
                height: imageHeight ? `${imageHeight}px` : undefined
            }}
            onMouseDown={beginDrag}
            onMouseMove={whileDrag}
            onMouseUp={endDrag}
        >
            {dragging && (() => {
                const topLeftX = Math.min(drawingPoint1![0], drawingPoint2![0]);
                const topLeftY = Math.min(drawingPoint1![1], drawingPoint2![1]);
                const bottomRightX = Math.max(drawingPoint1![0], drawingPoint2![0]);
                const bottomRightY = Math.max(drawingPoint1![1], drawingPoint2![1]);
                return <div
                    className="tt-viewfinder-dragoverlay-box"
                    style={{
                        top: `${imageHeight! * topLeftY}px`,
                        left: `${imageWidth! * topLeftX}px`,
                        height: `${imageHeight! * (bottomRightY - topLeftY)}px`,
                        width: `${imageWidth! * (bottomRightX - topLeftX)}px`
                    }}
                />;
            })()}
        </div>
    </div>
}

export default ViewfinderDragOverlay;