import Page from "./Page";

export interface SerializedTextBlob {
    boundingBox: [ number, number, number, number ];
    panelNo: number;
    blobNo: number;
    original: string;
    translations: Record<string, string>;
}

export default class TextBlob {

    static lastBlobId = 0;

    // The internal ID is ephemeral and doesn't persist across sessions.
    // Its purpose is to track individual Blobs.
    // The text (original or translated) or order can't be used here,
    // since React will re-render the blob if any of those change, which
    // is very likely.
    readonly internalId: number = TextBlob.lastBlobId++;

    // All these positional parameters are percent-based.
    // The leftmost pixel of the page is 0%, the rightmost is 100%.
    // The topmost pixel of the page is 0%, the bottommost is 100%.
    pageTopLeft = 0;
    pageTopRight = 0;
    pageBottomLeft = 0;
    pageBottomRight = 0;

    page: Page;
    panelNo: number;
    blobNo: number;
    original: string;
    translations: Record<string, string> = {};

    static deserialize(page: Page, serialized: SerializedTextBlob): TextBlob {
        const blob = new TextBlob(
            page,
            serialized.panelNo,
            serialized.blobNo,
            serialized.original
        );
        blob.pageTopLeft = serialized.boundingBox[0];
        blob.pageTopRight = serialized.boundingBox[1];
        blob.pageBottomLeft = serialized.boundingBox[2];
        blob.pageBottomRight = serialized.boundingBox[3];
        blob.translations = serialized.translations;
        return blob;
    }

    static create(page: Page, panelNo: number, blobNo: number, originalText?: string): TextBlob {
        return new TextBlob(page, panelNo, blobNo, originalText);
    }

    private constructor(page: Page, panelNo: number, blobNo: number, originalText?: string) {
        this.page = page;
        this.panelNo = panelNo;
        this.blobNo = blobNo;
        this.original = originalText ?? "";
        for (const locale of page.manifest.targetLocales ?? []) {
            this.translations[locale] = "";
        }
    }

    setOriginal(originalText: string): TextBlob {
        this.original = originalText;
        return this;
    }

    setTranslation(locale: string, translation: string): TextBlob {
        this.translations[locale] = translation;
        return this;
    }

    removeTranslation(locale: string): TextBlob {
        delete this.translations[locale];
        return this;
    }

    serialize(): SerializedTextBlob {
        return {
            boundingBox: [
                this.pageTopLeft, this.pageTopRight,
                this.pageBottomLeft, this.pageBottomRight
            ],
            panelNo: this.panelNo,
            blobNo: this.blobNo,
            original: this.original,
            translations: this.translations,
        };
    }

}