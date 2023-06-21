import { useTranslation } from "react-i18next";
import Page from "../../../projects/Page";
import "./ScriptwriterPage.scss";
import ScriptwriterBlob from "./ScriptwriterBlob";

function ScriptwriterPage({ page, pageNo }: { page: Page, pageNo: number }) {
    const { t } = useTranslation();

    const blobs = page.blobs.map(
        (b) => <ScriptwriterBlob key={b.internalId} page={page} pageNo={pageNo} blob={b} />
    );

    return <div className="tt-scriptwriter-page">
        <div className="tt-scriptwriter-page-header">{
            t("editor:page.heading.plain", { page: pageNo, filename: page.imageName })
        }</div>
        <div className="tt-scriptwriter-blobgrid">
            {blobs}
        </div>
    </div>
}

export default ScriptwriterPage;