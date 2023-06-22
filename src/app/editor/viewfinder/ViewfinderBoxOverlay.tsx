import { useContext } from "react";
import EditorContext from "../EditorContext";
import ViewfinderBoxOverlayBox from "./ViewfinderBoxOverlayBox";
import ViewfinderContext from "./ViewfinderContext";

function ViewfinderBoxOverlay() {
    const { focusedPage, setFocusedBlob } = useContext(EditorContext);
    const { imageWidth, imageHeight } = useContext(ViewfinderContext);

    const clearFocused = () => {
        setFocusedBlob!(undefined);
    }

    const boundingBoxes = focusedPage?.blobs.map(
        (blob) => <ViewfinderBoxOverlayBox blob={blob} />
    );

    return <div className="tt-viewfinder-boxoverlay">
        <div 
            className="tt-viewfinder-boxoverlay-area"
            style={{
                width: imageWidth ? `${imageWidth}px` : undefined,
                height: imageHeight ? `${imageHeight}px` : undefined
            }}
            onMouseDown={clearFocused}
        >
            {boundingBoxes}
        </div>
    </div>
}

export default ViewfinderBoxOverlay;