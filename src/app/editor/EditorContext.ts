import { createContext } from "react";
import Project from "../../projects/Project";
import Page from "../../projects/Page";
import TextBlob from "../../projects/TextBlob";

export interface IEditorContext {
    project?: Project | null;
    // Set the project, or refresh a loaded project
    setProject?: ((project?: Project) => void) | null;
    lastChange: number;
    
    focusedPage?: Page;
    focusedPageNo?: number;
    setFocusedPage?: (page?: Page) => void;

    focusedBlob?: TextBlob;
    setFocusedBlob?: (blob?: TextBlob) => void;
}

const EditorContext = createContext<IEditorContext>({
    lastChange: Date.now()
});

export default EditorContext;