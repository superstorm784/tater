import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Form, InputGroup } from "react-bootstrap";
import TextBlob from "../../../projects/TextBlob";
import findParentWithClass from "../../../util/findParentWithClass";
import { faCopy } from "@fortawesome/free-solid-svg-icons";
import { useTranslation } from "react-i18next";
import { ChangeEvent, KeyboardEvent, useContext } from "react";
import EditorContext from "../EditorContext";
import copy from "../../../util/copy";
import localeEmoji from "locale-emoji";

function ScriptwriterBlobText({ blob, locale }: { blob: TextBlob, locale: string|null }) {
    const { t, i18n } = useTranslation();
    const { setProject } = useContext(EditorContext);

    const projectLocale = blob.page.manifest.locale;

    const updateText = (locale: string|null, e: ChangeEvent<HTMLInputElement>) => {
        if (locale) {
            blob.setTranslation(locale, e.target.value);
        } else {
            blob.setOriginal(e.target.value);
        }
        setProject?.();
    }
    const copyText = (locale: string|null) => {
        copy(locale ? blob.translations[locale] : blob.original);
    }

    const nextBlobText = (locale: string | null, e: KeyboardEvent) => {
        if (locale == null) {
            locale = projectLocale;
        }

        // Non-React JS
        const target = e.target as HTMLInputElement;
        const parentBT = findParentWithClass(target, "tt-scriptwriter-blob-text")!;
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
            e.preventDefault();

            const next = e.key.endsWith("Down");
            const blobs = Array.from(
                findParentWithClass(target, "tt-scriptwriter-pages")
                    ?.querySelectorAll(".tt-scriptwriter-blob-text") ?? []
            );

            const i = blobs.indexOf(parentBT);
            blobs[i + (next ? 1 : -1)]?.querySelector("input")?.focus();
        } else if (e.key === "PageDown" || e.key === "PageUp") {
            e.preventDefault();

            const next = e.key.endsWith("Down");
            const blobs = Array.from(
                findParentWithClass(target, "tt-scriptwriter-pages")
                    ?.querySelectorAll(`.tt-scriptwriter-blob-text[data-locale="${
                        locale
                    }"]`) ?? []
            );

            const i = Array.from(blobs).indexOf(parentBT);
            blobs[i + (next ? 1 : -1)]?.querySelector("input")?.focus();
        }
    }

    const text = locale ? blob.translations[locale] : blob.original;
    const scriptName = new Intl.DisplayNames([ i18n.language ], { type: "language" });
    return <InputGroup
        className="tt-scriptwriter-blob-text"
        key={`blob-${blob.internalId}.${locale}`}
        data-locale={locale ?? projectLocale}
    >
        <InputGroup.Text>{
            localeEmoji(locale ?? projectLocale)
        }</InputGroup.Text>
        <Form.Control
            placeholder={
                locale ? 
                    scriptName.of(locale) :
                    t("editor:blob.original", { locale: scriptName.of(projectLocale) })
            }
            value={text}
            onChange={updateText.bind(null, locale)}
            onKeyDown={nextBlobText.bind(null, locale)}
        />
        {
            locale && <Button
                title={t("editor:blob.translation.copy")}
                onClick={copyText.bind(null, locale)}
            ><FontAwesomeIcon icon={faCopy} /></Button>
        }
    </InputGroup>;
}

export default ScriptwriterBlobText;