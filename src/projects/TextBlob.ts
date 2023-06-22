import Page from "./Page";

export interface SerializedTextBlob {
    boundingBox: [ [number, number], [number, number] ];
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
    pageTopLeft: [number, number] = [0, 0];
    pageBottomRight: [number, number] = [0, 0];

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
            serialized.boundingBox,
            serialized.original
        );
        blob.translations = serialized.translations;
        return blob;
    }

    static create(
        page: Page, panelNo: number, blobNo: number,
        boundingBox: [ [number, number], [number, number] ], originalText?: string
    ): TextBlob {
        return new TextBlob(page, panelNo, blobNo, boundingBox, originalText);
    }

    private constructor(
        page: Page, panelNo: number, blobNo: number,
        boundingBox: [ [number, number], [number, number] ], originalText?: string
    ) {
        this.page = page;
        this.panelNo = panelNo;
        this.blobNo = blobNo;
        this.pageTopLeft = boundingBox[0];
        this.pageBottomRight = boundingBox[1];
        this.original = originalText ?? "";
        for (const locale of page.manifest.targetLocales ?? []) {
            this.translations[locale] = "";
        }
    }

    get previousBlob(): TextBlob | null {
        const blobIndex = this.page.blobs.indexOf(this);
        return this.page.blobs[blobIndex - 1] ?? null;
    }

    get nextBlob(): TextBlob | null {
        const blobIndex = this.page.blobs.indexOf(this);
        return this.page.blobs[blobIndex + 1] ?? null;
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
                this.pageTopLeft,
                this.pageBottomRight
            ],
            panelNo: this.panelNo,
            blobNo: this.blobNo,
            original: this.original,
            translations: this.translations,
        };
    }

}