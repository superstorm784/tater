import { useState } from 'react';
import Project from '../../projects/Project';
import "./Editor.scss";
import EditorContext from './EditorContext';
import EditorIntro from './intro/EditorIntro';
import EditorMain from './main/EditorMain';
import Toolbar from './toolbar/Toolbar';
import Page from '../../projects/Page';
import TextBlob from '../../projects/TextBlob';

function Editor() {
    const [project, setProject] = useState<Project | undefined>(undefined);
    const [focusedPage, setFocusedPage] = useState<Page | undefined>(undefined);
    const [focusedBlob, setFocusedBlob] = useState<TextBlob | undefined>(undefined);
    const [lastChange, setLastChange] = useState<number>(Date.now());

    return <EditorContext.Provider value={{
        project,
        setProject: () => {
            console.log("updating project!");
            project?.manifest.bump();
            setLastChange(project?.manifest.lastChange.getTime() ?? Date.now());
        },
        lastChange: lastChange,

        focusedPage,
        focusedPageNo: focusedPage ? 
            project?.manifest.pages.indexOf(focusedPage) : undefined,
        setFocusedPage,

        focusedBlob,
        setFocusedBlob
    }}>
        <div className="tt-editor">
            <Toolbar />
            {
                project == null ?
                    <EditorIntro setProject={setProject}/> :
                    <EditorMain />
            }
        </div>
    </EditorContext.Provider>;
}

export default Editor;