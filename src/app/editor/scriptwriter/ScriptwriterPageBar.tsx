import { faChevronLeft, faChevronRight, faImages, faUpload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import requestFiles from "../../../util/requestFiles";
import EditorContext from "../EditorContext";

function ScriptwriterPageBar() {
    const { t } = useTranslation();
    const {
        project,
        setProject,
        focusedPage,
        focusedPageNo,
        setFocusedPage
    } = useContext(EditorContext);

    const hasPreviousPage = focusedPageNo != null && 
        focusedPageNo > 0;
    const hasNextPage = focusedPageNo != null &&
        focusedPageNo < (project?.manifest.pages.length ?? 0) - 1;

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
        const files = await requestFiles({ accept: "image/*", multiple: true });
        if (files) {
            // Done synchronously to ensure file order.
            for (const file of files) {
                await project?.addNewPage(file);
            }
            setProject?.();
        }
    }
    const goToPage = async (e: ChangeEvent<HTMLSelectElement>) => {
        setFocusedPage?.(project?.manifest.pages[+e.target.value]);
    }
    const previousPage = async () => {
        if (hasPreviousPage) {
            setFocusedPage?.(project?.manifest.pages[focusedPageNo! - 1]);
        }
    }
    const nextPage = async () => {
        if (hasNextPage) {
            setFocusedPage?.(project?.manifest.pages[focusedPageNo! + 1]);
        }
    }

    return <div className="tt-scriptwriter-pagebar d-flex">
        <InputGroup className="flex-1 me-2">
            <Button variant="primary" disabled={!hasPreviousPage} onClick={previousPage}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <Form.Select value={focusedPage?.internalId} onChange={goToPage}>
                {pageElements}
            </Form.Select>
            <Button variant="primary" disabled={!hasNextPage} onClick={nextPage}>
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