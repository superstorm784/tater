import { faChevronLeft, faChevronRight, faImages, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import requestFiles from "../../../util/requestFiles";
import EditorContext from "../EditorContext";

function ScriptwriterPageBar() {
    const { t } = useTranslation();
    const { project, updateProject } = useContext(EditorContext);

    const pageElements = project?.manifest.pages.map(
        (p, i) => <option
            key={p.internalId}
            value={i}
        >{t("editor:page.heading.verbose", { page: i + 1, filename: p.imageName })}</option>
    ) ?? [];
    if (project?.manifest.pages.length === 0) {
        pageElements.push(<option key="no-pages"
            selected
            disabled
        >{t("editor:page.empty")}</option>)
    }

    const uploadPage = async () => {
        const file = await requestFiles({ accept: "image/*" });
        if (file) {
            project?.addNewPage(file).then(updateProject);
        }
    }

    return <div className="tt-scriptwriter-pagebar d-flex">
        <InputGroup className="flex-1 me-2">
            <Button variant="primary">
                <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <Form.Select>
                {pageElements}
            </Form.Select>
            <Button variant="primary">
                <FontAwesomeIcon icon={faChevronRight} />
            </Button>
        </InputGroup>
        <InputGroup className="flex-nowrap" style={{flex: 0}}>
            <Button variant="secondary" title={t("editor:page.manage")}>
                <FontAwesomeIcon icon={faImages} />
            </Button>
            <Button variant="secondary" title={t("editor:page.upload")} onClick={uploadPage}>
                <FontAwesomeIcon icon={faUpload} />
            </Button>
        </InputGroup>
    </div>;
}

export default ScriptwriterPageBar;