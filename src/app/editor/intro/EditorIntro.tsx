import { useTranslation } from "react-i18next";
import "./EditorIntro.scss";

function EditorIntro() {
    const { t } = useTranslation();
    
    return  <div className="tt-editor-intro">
        <h1>{t("editor:intro.heading")}</h1>
        <p></p>
    </div>;
}

export default EditorIntro;