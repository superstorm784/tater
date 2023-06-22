import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Project from "../../../projects/Project";
import Manifest from "../../../projects/Manifest";
import "./EditorIntro.scss";
import EditorContext from "../EditorContext";
import { useContext } from "react";
import loadProject from "../func/loadProject";

function EditorIntro() {
    const { t } = useTranslation();
    const context = useContext(EditorContext);
    const { setProject } = context;

    const newProject = () => {
        setProject!(new Project(
            new Manifest("Untitled Project", "ja")
        ));
    }
    
    return <div className="tt-editor-intro">
        <h1>{t("editor:intro.heading")}</h1>
        <p>{t("editor:intro.text")}</p>
        <p>{t("editor:intro.instructions")}</p>
        <div>
            <Button onClick={newProject} className="me-3">{t("editor:actions.file.new")}</Button>
            <Button onClick={loadProject.bind(null, context)}>{t("editor:actions.file.load")}</Button>
        </div>
    </div>;
}

export default EditorIntro;