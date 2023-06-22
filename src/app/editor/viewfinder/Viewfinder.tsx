import React, { useContext, useEffect, useState } from 'react';
import EditorContext from '../EditorContext';
import { useTranslation } from 'react-i18next';
import "./Viewfinder.scss";

function Viewfinder({ horizontal, ratio }: { horizontal: boolean, ratio?: number }) {
    const { t } = useTranslation("editor");
    const { project, focusedPage } = useContext(EditorContext);
    const [ imageBlobUrl, setImageBlobUrl ] = useState<string | null>(null);

    const activePageNo = focusedPage?.manifest.pages.indexOf(focusedPage);

    useEffect(() => {
        if (focusedPage?.imageHash) {
            project?.getImage(focusedPage?.imageHash)
                .then((blob) => {
                    if (blob) {
                        setImageBlobUrl(URL.createObjectURL(blob));
                    } else {
                        setImageBlobUrl(null);
                    }
                });
        } else {
            setImageBlobUrl(null);
        }
    }, [ project, setImageBlobUrl, focusedPage ]);

    return (
        <div className="tt-viewfinder" style={{
            width: horizontal ? (ratio ? `${ratio * 100}vw` : undefined) : undefined,
            height: horizontal ? undefined : (ratio ? `${ratio * 100}vh` : undefined)
        }}>
            {
                (activePageNo != null && focusedPage && imageBlobUrl) && (
                    <img
                        className="tt-viewfinder-image"
                        src={imageBlobUrl}
                        alt={t("editor:page.heading.caption", {
                            page: activePageNo + 1 ,
                            filename: focusedPage.imageName
                        })}
                    ></img>
                )
            }
            no image
        </div>
    );
}

export default Viewfinder;