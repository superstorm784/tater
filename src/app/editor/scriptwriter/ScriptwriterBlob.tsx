import { faTrash } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ChangeEvent, useContext } from "react";
import { Dropdown, Form, InputGroup } from "react-bootstrap";
import DropdownItem from "react-bootstrap/esm/DropdownItem";
import DropdownMenu from "react-bootstrap/esm/DropdownMenu";
import DropdownToggle from "react-bootstrap/esm/DropdownToggle";
import { useTranslation } from "react-i18next";
import Page from "../../../projects/Page";
import TextBlob from "../../../projects/TextBlob";
import EditorContext from "../EditorContext";
import ScriptwriterBlobText from "./ScriptwriterBlobText";
import "./ScriptwriterPage.scss";

function ScriptwriterBlob({ page, pageNo, blob }: { page: Page, pageNo: number, blob: TextBlob }) {
    const { t } = useTranslation();
    const { setProject, focusedBlob, setFocusedBlob } = useContext(EditorContext);

    const setFocused = () => {
        setFocusedBlob!(blob);
    }

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
    const deleteBlob = () => {
        page.blobs.splice(page.blobs.indexOf(blob), 1);
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

    return <div className={`tt-scriptwriter-blob d-flex ${
        focusedBlob === blob ? "tt-scriptwriter-blob-focused" : ""
    }`} onFocus={setFocused}>
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
        </div>
        <div>{translationElements}</div>
        <Dropdown align="end" autoClose={"outside"}>
            <DropdownToggle split variant="secondary" title={
                t("editor:blob.actions")
            } />
            <DropdownMenu>
                <DropdownItem className="text-danger" onClick={deleteBlob}>
                    <FontAwesomeIcon icon={faTrash}/> {t("editor:blob.delete")}
                </DropdownItem>
            </DropdownMenu>
        </Dropdown>
    </div>
}

export default ScriptwriterBlob;
