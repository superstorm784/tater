import { Button } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import Project from "../../../projects/Project";
import Manifest from "../../../projects/Manifest";
import "./EditorIntro.scss";

function EditorIntro({ setProject }: { setProject: (project: Project) => void }) {
    const { t } = useTranslation();

    const newProject = () => {
        setProject(new Project(
            new Manifest("Untitled Project", "en")
        ));
    }
    
    return <div className="tt-editor-intro">
        <h1>{t("editor:intro.heading")}</h1>
        <p>{t("editor:intro.text")}</p>
        <p>{t("editor:intro.instructions")}</p>
        <div>
            <Button onClick={newProject} className="me-3">{t("editor:actions.file.new")}</Button>
            <Button>{t("editor:actions.file.load")}</Button>
        </div>
    </div>;
}

export default EditorIntro;