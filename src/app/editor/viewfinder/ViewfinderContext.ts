import { createContext } from "react";

export interface IViewfinderContext {
    loading: boolean;
    setLoading?: (loading: boolean) => void;

    drawing: boolean;
    setDrawing?: (drawing: boolean) => void;
    // Percent value, [width, height], relative to image
    drawingPoint1?: [ number, number ] | null;
    setDrawingPoint1?: (point: [ number, number ] | null) => void;
    // Percent value, [width, height], relative to image
    drawingPoint2?: [ number, number ] | null;
    setDrawingPoint2?: (point: [ number, number ] | null) => void;

    imageWidth?: number | null;
    setImageWidth?: (width: number | null) => void;
    imageHeight?: number | null;
    setImageHeight?: (height: number | null) => void;
}

const ViewfinderContext = createContext<IViewfinderContext>({
    loading: false,
    drawing: false
});

export default ViewfinderContext;