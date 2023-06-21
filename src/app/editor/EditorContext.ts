import { createContext } from "react";
import Project from "../../projects/Project";

export interface IEditorContext {
    project: Project | null;
    lastChange: number;
    updateProject: (() => void) | null;
}

const EditorContext = createContext<IEditorContext>({
    project: null,
    lastChange: Date.now(),
    updateProject: null
});

export default EditorContext;