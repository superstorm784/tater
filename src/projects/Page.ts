import TextBlob, { SerializedTextBlob } from "./TextBlob";

export interface SerializedPage {
    blobs: SerializedTextBlob[];
    imageHash: string;
}

export default class Page {

    static lastPageId = 0;

    // The internal ID is ephemeral and doesn't persist across sessions.
    // Its purpose is to track individual Blobs.
    // The text (original or translated) or order can't be used here,
    // since React will re-render the blob if any of those change, which
    // is very likely.
    readonly internalId: number = Page.lastPageId++;

    blobs: TextBlob[] = [];
    imageHash: string;

    static async deserialize(page: SerializedPage): Promise<Page> {
        const p = new Page(page.imageHash);
        p.blobs = page.blobs.map(TextBlob.deserialize);
        return p;
    }

    /**
     * Creates a Page. In this case, the image hash is immediately trusted. This should
     * only be used when the image is newly-uploaded, or else no file integrity check
     * will be performed.
     * 
     * @param page 
     * @param image 
     * @returns 
     */
    static create(imageHash: string): Page {
        const p = new Page(imageHash);
        p.blobs = [];
        return p;
    }

    private constructor(imageHash: string) {
        this.imageHash = imageHash;
    }

    serialize(): SerializedPage {
        return {
            blobs: this.blobs.map(v => v.serialize()),
            imageHash: this.imageHash
        };
    }

}