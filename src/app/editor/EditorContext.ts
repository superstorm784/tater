import { createContext } from "react";
import Project from "../../projects/Project";

export interface IEditorContext {
    project: Project | null;
}

const EditorContext = createContext<IEditorContext>({
    project: null
});

export default EditorContext;