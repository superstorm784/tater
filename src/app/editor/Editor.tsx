import { useState } from 'react';
import Project from '../../projects/Project';
import "./Editor.scss";
import EditorContext from './EditorContext';
import EditorIntro from './intro/EditorIntro';
import EditorMain from './main/EditorMain';
import Toolbar from './toolbar/Toolbar';

function Editor() {
    const [project, setProject] = useState<Project | null>(null);
    const [lastChange, setLastChange] = useState<number>(Date.now());

    return <EditorContext.Provider value={{
        project,
        lastChange: lastChange,
        updateProject: () => {
            console.log("updating project!");
            project?.manifest.bump();
            setLastChange(project?.manifest.lastChange.getTime() ?? Date.now());
        }
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