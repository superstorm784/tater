import { useContext, useRef, useState } from 'react';
import EditorContext from '../EditorContext';
import "./Viewfinder.scss";
import ViewfinderContext from './ViewfinderContext';
import ViewfinderImage from './ViewfinderImage';
import ViewfinderLoading from './ViewfinderLoading';
import ViewfinderOverlay from './ViewfinderOverlay';
import ViewfinderDragOverlay from './ViewfinderDragOverlay';
import ViewfinderBoxOverlay from './ViewfinderBoxOverlay';

function Viewfinder({ horizontal, ratio }: { horizontal: boolean, ratio?: number }) {
    const { focusedPage } = useContext(EditorContext);
    const [ loading, setLoading ] = useState(false);
    const [ drawing, setDrawing ] = useState(false);
    const [ drawingPoint1, setDrawingPoint1 ] = useState<[number, number] | null>(null);
    const [ drawingPoint2, setDrawingPoint2 ] = useState<[number, number] | null>(null);
    const [ imageWidth, setImageWidth ] = useState<number | null>(null);
    const [ imageHeight, setImageHeight ] = useState<number | null>(null);

    const viewfinder = useRef<HTMLDivElement>(null);
    
    const idleBoxOverlay = <ViewfinderBoxOverlay key="tt-viewfinder-boxoverlay" />;
    const activeBoxOverlay = <ViewfinderDragOverlay key="tt-viewfinder-dragoverlay" />;

    return <ViewfinderContext.Provider value={{
        loading, setLoading, drawing, setDrawing,
        drawingPoint1, setDrawingPoint1, drawingPoint2, setDrawingPoint2,
        imageWidth, setImageWidth, imageHeight, setImageHeight
    }}>
        <div 
            ref={viewfinder}
            className="tt-viewfinder"
            style={{
                width: horizontal ? (ratio ? `${ratio * 100}vw` : undefined) : undefined,
                height: horizontal ? undefined : (ratio ? `${ratio * 100}vh` : undefined)
            }}
            data-drawing={drawing}
        >
            {loading && <ViewfinderLoading />}
            {focusedPage && <ViewfinderImage viewfinderRef={viewfinder} />}
            {drawing ? 
                <>{idleBoxOverlay}{activeBoxOverlay}</> :
                <>{activeBoxOverlay}{idleBoxOverlay}</>
            }
            <ViewfinderOverlay />
        </div>
    </ViewfinderContext.Provider>;
}

export default Viewfinder;