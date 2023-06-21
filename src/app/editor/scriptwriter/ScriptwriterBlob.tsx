import { faCopy, faPlus, faTrash, faXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Dropdown, DropdownButton, Form, InputGroup } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import { useTranslation } from "react-i18next";
import Page from "../../../projects/Page";
import TextBlob from "../../../projects/TextBlob";
import "./ScriptwriterPage.scss";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { ChangeEvent, useContext } from "react";
import EditorContext from "../EditorContext";

function ScriptwriterBlob({ page, pageNo, blob }: { page: Page, pageNo: number, blob: TextBlob }) {
    const { t } = useTranslation();
    const { setProject: updateProject } = useContext(EditorContext);

    const updatePanelNo = (e: ChangeEvent<HTMLInputElement>) => {
        blob.panelNo = +e.target.value;
        page.sort();
        updateProject?.();
    }
    const updateBlobNo = (e: ChangeEvent<HTMLInputElement>) => {
        blob.blobNo = +e.target.value;
        page.sort();
        updateProject?.();
    }
    const updateOriginal = (e: ChangeEvent<HTMLInputElement>) => {
        blob.setOriginal(e.target.value);
        updateProject?.();
    }
    const updateTranslation = (locale: string, e: ChangeEvent<HTMLInputElement>) => {
        blob.setTranslation(locale, e.target.value);
        updateProject?.();
    }
    const addBlob = (nextPanel: boolean) => {
        page.blobs.push(TextBlob.create(
            page,
            nextPanel ? blob.panelNo + 1 : blob.panelNo,
            nextPanel ? 1 : blob.blobNo + 1
        ));
        page.sort();
        updateProject?.();
    }

    const translationElements = Object.entries(blob.translations).map(
        ([locale, text]) => <InputGroup key={`blob-${blob.internalId}.${locale}`}>
            <InputGroup.Text>🏳️</InputGroup.Text>
            <Form.Control
                placeholder={t("editor:blob.translation.placeholder", { locale })}
                value={text}
                onChange={updateTranslation.bind(null, locale)}
            />
            <Button title={t("editor:blob.translation.copy")}>
                <FontAwesomeIcon icon={faCopy} />
            </Button>
        </InputGroup>
    );

    return <div className="tt-scriptwriter-blob d-flex">
        <div>
            <InputGroup>
                <Form.Control 
                    type="number"
                    placeholder="P"
                    value={blob.panelNo}
                    onChange={updatePanelNo}
                />
                <Form.Control 
                    type="number"
                    placeholder="B"
                    value={blob.blobNo}
                    onChange={updateBlobNo}
                />
            </InputGroup>
            <div className="tt-scriptwriter-blob-new">
                <Button title={t("editor:blob.new.panel")} onClick={addBlob.bind(null, true)}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
                <Button title={t("editor:blob.new.blob")} onClick={addBlob.bind(null, false)}>
                    <FontAwesomeIcon icon={faPlus} />
                </Button>
            </div>
        </div>
        <div>
            <InputGroup>
                <InputGroup.Text>🌎</InputGroup.Text>
                <Form.Control
                    placeholder={t("editor:blob.original")}
                    value={blob.original}
                    onChange={updateOriginal}
                />
            </InputGroup>
            {translationElements}
        </div>
        <Dropdown align="end" autoClose={"outside"}>
            <DropdownToggle split variant="secondary" title={
                t("editor:blob.actions")
            } />
            <DropdownMenu>
                <DropdownItem className="text-danger">
                    <FontAwesomeIcon icon={faTrash} /> {t("editor:blob.delete")}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
}

export default ScriptwriterBlob;