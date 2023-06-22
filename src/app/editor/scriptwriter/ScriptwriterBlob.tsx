import { faCopy, faPlus, faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useContext } from "react";
import { Button, Dropdown, Form, InputGroup } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { useTranslation } from "react-i18next";
import Page from "../../../projects/Page";
import TextBlob from "../../../projects/TextBlob";
import EditorContext from "../EditorContext";
import "./ScriptwriterPage.scss";
import ScriptwriterBlobText from "./ScriptwriterBlobText";

function ScriptwriterBlob({ page, pageNo, blob }: { page: Page, pageNo: number, blob: TextBlob }) {
    const { t } = useTranslation();
    const { project, setProject } = useContext(EditorContext);

    const updatePanelNo = (e: ChangeEvent<HTMLInputElement>) => {
        blob.panelNo = +e.target.value;
        page.sort();
        setProject?.();
    }
    const updateBlobNo = (e: ChangeEvent<HTMLInputElement>) => {
        blob.blobNo = +e.target.value;
        page.sort();
        setProject?.();
    }
    const addBlob = (nextPanel: boolean) => {
        page.blobs.push(TextBlob.create(
            page,
            nextPanel ? blob.panelNo + 1 : blob.panelNo,
            nextPanel ? 1 : blob.blobNo + 1
        ));
        page.sort();
        setProject?.();
    }

    const translationElements = [
        <ScriptwriterBlobText 
            key={`bt--${blob.internalId}-original`} blob={blob} locale={null}
        />,
        ...Object.keys(blob.translations).map(
            (locale) => <ScriptwriterBlobText
                key={`bt--${blob.internalId}-loc#${locale}`} blob={blob} locale={locale}
            />
        )
    ];

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
        <div>{translationElements}</div>
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
