import Manifest from "./Manifest";
import TextBlob, { SerializedTextBlob } from "./TextBlob";

export interface SerializedPage {
    blobs: SerializedTextBlob[];
    imageName: string;
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

    manifest: Manifest;
    blobs: TextBlob[] = [];
    imageName: string;
    imageHash: string;

    static async deserialize(manifest: Manifest, page: SerializedPage): Promise<Page> {
        const p = new Page(manifest, page.imageName, page.imageHash);
        p.blobs = page.blobs.map(TextBlob.deserialize.bind(null, p));
        p.sort();
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
    static create(manifest: Manifest, imageName: string, imageHash: string): Page {
        const p = new Page(manifest, imageName, imageHash);
        p.blobs = [];
        return p;
    }

    private constructor(manifest: Manifest, imageName: string, imageHash: string) {
        this.manifest = manifest;
        this.imageName = imageName;
        this.imageHash = imageHash;
    }

    get previousPage(): Page | null {
        const pageIndex = this.manifest.pages.indexOf(this);
        return this.manifest.pages[pageIndex - 1] ?? null;
    }

    get nextPage(): Page | null {
        const pageIndex = this.manifest.pages.indexOf(this);
        return this.manifest.pages[pageIndex + 1] ?? null;
    }

    get panelCount(): number {
        if (this.blobs.length === 0) return 0;
        return Math.max(...this.blobs.map(b => b.panelNo));
    }

    /**
     * Get the next blob number
     * @returns [panel, blob]
     */
    get nextBlobNo(): [number, number] {
        if (this.blobs.length === 0) return [ 1, 1 ];
        const panelCount = this.panelCount;
        return [
            panelCount,
            Math.max(
                ...this.blobs.filter(b => b.panelNo === panelCount)
                    .map(v => v.blobNo)
            ) + 1
        ];
    }

    /**
     * Sort blobs in-place.
     */
    sort(): void {
        const maxBlobNo = Math.max(...this.blobs.map(v => v.blobNo));
        this.blobs.sort((a, b) => {
            return (a.panelNo * maxBlobNo + a.blobNo) - (b.panelNo * maxBlobNo + b.blobNo)
        });
    }

    serialize(): SerializedPage {
        return {
            blobs: this.blobs.map(v => v.serialize()),
            imageName: this.imageName,
            imageHash: this.imageHash
        };
    }

}