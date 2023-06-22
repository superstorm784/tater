import { faSpinner } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useTranslation } from "react-i18next";
import "./ViewfinderLoading.scss";

function ViewfinderLoading() {
    const { t } = useTranslation();

    return <div className="tt-viewfinder-loading">
        <div className="tt-viewfinder-loading-text">
            <FontAwesomeIcon 
                icon={faSpinner} className="tt-viewfinder-loading-spinner"
            /> {t("editor:page.loading")}
        </div>
    </div>;
}

export default ViewfinderLoading;