import { RefObject, useContext, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import getImageSize from '../../../util/getImageSize';
import EditorContext from '../EditorContext';
import "./Viewfinder.scss";
import ViewfinderContext from './ViewfinderContext';

function ViewfinderImage({ viewfinderRef }: {
    viewfinderRef: RefObject<HTMLDivElement>
}) {
    const { t } = useTranslation();
    const {
        setLoading,
        imageWidth, setImageWidth,
        imageHeight, setImageHeight    } = useContext(ViewfinderContext);
    const { project, focusedPage, focusedPageNo } = useContext(EditorContext);
    const [ imageSrc, setImageSrc ] = useState<string | null>(null);
    const [ imageHash, setImageHash ] = useState<string | null>(null);
    const [ imageUrl, setImageUrl ] = useState<string | null>(null);
    const [ originalImageWidth, setOriginalImageWidth ] = useState<number | null>(null);
    const [ originalImageHeight, setOriginalImageHeight ] = useState<number | null>(null);

    const img = useRef<HTMLImageElement>(null);

    // False positive
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const fitImage = (
        originalWidth = originalImageWidth, 
        originalHeight = originalImageHeight
    ) => {
        if (viewfinderRef.current && originalWidth && originalHeight) {
            // Resize the image to fit inside the viewfinder.
            const vfHeight = viewfinderRef.current!.clientHeight;
            const vfWidth = viewfinderRef.current!.clientWidth;
            // setImageWidth and setImageHeight to fit the image inside the
            // viewfinder height and width while preserving aspect ratio.
            const widthRatio = vfWidth / originalWidth;
            const heightRatio = vfHeight / originalHeight;
            const ratio = Math.min(heightRatio, widthRatio);
            setImageWidth!(originalWidth * ratio);
            setImageHeight!(originalHeight * ratio);
        }
    };

    useEffect(() => {
        if (focusedPage?.imageHash) {
            setLoading!(true);
            setImageHash(focusedPage?.imageHash);
        } else {
            setImageHash(null);
        }
    }, [ setLoading, project, setImageSrc, focusedPage ]);

    useEffect(() => {
        if (imageHash) {
            const startingHash = imageHash;
            project?.getImage(imageHash)
                .then((blob) => {
                    if (imageHash === startingHash && blob) {
                        setImageUrl(URL.createObjectURL(blob));
                    }
                });
        } else {
            setImageUrl(null);
        }
    }, [ project, imageHash ]);

    useEffect(() => {
        if (imageUrl) {
            const startingHash = imageHash;
            getImageSize(imageUrl).then(([iw, ih]) => {
                if (imageHash === startingHash) {
                    setOriginalImageWidth(iw);
                    setOriginalImageHeight(ih);
                    fitImage(iw, ih);
                    setImageSrc(imageUrl);
                }
            });
        } else {
            setImageSrc(null);
        }
    }, [ fitImage, imageUrl, imageHash ]);

    useEffect(() => {
        const imageFitter = fitImage.bind(null, undefined, undefined);
        window.addEventListener("resize", imageFitter);
        return () => {
            window.removeEventListener("resize", imageFitter);
        }
    });

    const doneLoading = () => {
        setLoading!(false);
    }

    return <>{
        focusedPage && focusedPageNo != null && imageSrc && 
            <div className="tt-viewfinder-image">
                <img 
                    ref={img}
                    src={imageSrc}
                    draggable={false}
                    alt={t("editor:page.heading.caption", {
                        page: focusedPageNo + 1 ,
                        filename: focusedPage.imageName
                    })}
                    style={{
                        width: imageWidth ? `${imageWidth}px` : undefined,
                        height: imageHeight ? `${imageHeight}px` : undefined
                    }}
                    onLoad={doneLoading}
                />
            </div>
    }</>;
}

export default ViewfinderImage;