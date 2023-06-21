import TextBlob, { SerializedTextBlob } from "./TextBlob";

export interface SerializedPage {
    blobs: SerializedTextBlob[];
    imageHash: string;
}

export default class Page {

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
    static async create(page: SerializedPage, imageHash: string): Promise<Page> {
        const p = new Page(imageHash);
        p.blobs = page.blobs.map(TextBlob.deserialize);
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