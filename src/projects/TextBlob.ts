export interface SerializedTextBlob {
    boundingBox: [ number, number, number, number ];
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
    private internalId: number = TextBlob.lastBlobId++;

    // All these positional parameters are percent-based.
    // The leftmost pixel of the page is 0%, the rightmost is 100%.
    // The topmost pixel of the page is 0%, the bottommost is 100%.
    pageTopLeft = 0;
    pageTopRight = 0;
    pageBottomLeft = 0;
    pageBottomRight = 0;

    original: string;
    translations: Record<string, string> = {};

    static deserialize(serialized: SerializedTextBlob): TextBlob {
        const blob = new TextBlob(serialized.original);
        blob.pageTopLeft = serialized.boundingBox[0];
        blob.pageTopRight = serialized.boundingBox[1];
        blob.pageBottomLeft = serialized.boundingBox[2];
        blob.pageBottomRight = serialized.boundingBox[3];
        blob.translations = serialized.translations;
        return blob;
    }

    static create(originalText: string): TextBlob {
        return new TextBlob(originalText);
    }

    private constructor(originalText: string) {
        this.original = originalText;
    }

    addTranslation(locale: string, translation: string): TextBlob {
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
            original: this.original,
            translations: this.translations,
        };
    }

}