import { faChevronLeft, faChevronRight, faPencil } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useContext } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";
import { useTranslation } from "react-i18next";
import EditorContext from "../EditorContext";
import ViewfinderContext from "./ViewfinderContext";
import "./ViewfinderOverlay.scss";

function ViewfinderOverlay() {
    const { t } = useTranslation();
    const { drawing, setDrawing } = useContext(ViewfinderContext);
    const {
        project,
        focusedPage,
        focusedPageNo,
        setFocusedPage
    } = useContext(EditorContext);

    const hasPreviousPage = focusedPageNo != null && 
        focusedPageNo > 0;
    const hasNextPage = focusedPageNo != null &&
        focusedPageNo < (project?.manifest.pages.length ?? 0) - 1;
        
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

    const pageElements = project?.manifest.pages.map(
        (p, i) => <option
            key={p.internalId}
            value={i}
        >{i + 1}</option>
    ) ?? [];

    return <div className="tt-viewfinder-overlay">
        <InputGroup>
            <Button variant="primary" disabled={!hasPreviousPage} onClick={previousPage}>
                <FontAwesomeIcon icon={faChevronLeft} />
            </Button>
            <Form.Select 
                value={focusedPageNo ?? undefined}
                onChange={goToPage}
                disabled={project?.manifest.pages.length === 0}
            >
                {pageElements}
            </Form.Select>
            <Button variant="primary" disabled={!hasNextPage} onClick={nextPage}>
                <FontAwesomeIcon icon={faChevronRight} />
            </Button>
        </InputGroup>
        <Button
            variant={drawing ? "primary" : "outline-primary"}
            disabled={focusedPage == null}
            onClick={() => setDrawing!(!drawing)}
            title={t("editor:page.draw")}
        >
            <FontAwesomeIcon icon={faPencil} />
        </Button>
    </div>;
}

export default ViewfinderOverlay;