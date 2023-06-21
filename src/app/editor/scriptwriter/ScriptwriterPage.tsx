import { useTranslation } from "react-i18next";
import Page from "../../../projects/Page";
import "./ScriptwriterPage.scss";
import ScriptwriterBlob from "./ScriptwriterBlob";
import { useContext } from "react";
import EditorContext from "../EditorContext";

function ScriptwriterPage({ page, pageNo }: { page: Page, pageNo: number }) {
    const { t } = useTranslation();
    const { focusedPage, setFocusedPage } = useContext(EditorContext);

    const blobs = page.blobs.map(
        (b) => <ScriptwriterBlob key={b.internalId} page={page} pageNo={pageNo} blob={b} />
    );

    const focusIn = () => {
        setFocusedPage?.(page);
    }

    return <div className={`${
        focusedPage === page ? "tt-scriptwriter-page-active" : ""
    } tt-scriptwriter-page`} onFocus={focusIn} onClick={focusIn}>
        <div className="tt-scriptwriter-page-header">{
            t("editor:page.heading.plain", { page: pageNo, filename: page.imageName })
        }</div>
        <div className="tt-scriptwriter-blobgrid">
            {blobs}
        </div>
    </div>
}

export default ScriptwriterPage;