import JSZip from "jszip";
import Manifest from "./Manifest";
import BufferSerializer from "../util/BufferSerializer";
import buildError from "../util/buildError";
import Page from "./Page";

export const FileReadError = buildError(
    "FileReader read a null file"
);
export const ZipManifestMissingError = buildError(
    "manifest.json missing from file"
);
export const ZipImageFolderMissingError = buildError(
    "Image folder missing from file. No images will be loaded."
);
export const ZipImageMissingError = buildError<{ pageNo: number, page: Page }>(
    d => `Image file for page ${d.pageNo} is missing. No image will be loaded.`
)
export const ZipImageIntegrityError = buildError<{ pageNo: number, page: Page }>(
    d => `Image file for page ${d.pageNo} is corrupt. It will be removed for safety.`
);

export interface ProjectZipExport {
    data: ArrayBuffer;
    errors: Error[];
}

export default class Project {

    static MIME_TYPE = "application/x-taterproj+zip";

    zip: JSZip;
    manifest: Manifest;

    loadErrors: Error[] = [];

    static async loadFromBlob(blob: File | Blob): Promise<Project> {
        return new Promise((res, rej) => {
            const fr = new FileReader();
            fr.onload = async (e) => {
                if (e.target == null) {
                    rej(new Error("FileReader returned null"));
                } else {
                    res(await this.loadFromBuffer(
                        e.target.result as ArrayBuffer
                    ));
                }
            }
            fr.onerror = rej;
            fr.readAsArrayBuffer(blob);
        });
    }

    static async loadFromBuffer(zipFile: ArrayBuffer): Promise<Project> {
        const loadErrors = [];
        const zip = await JSZip.loadAsync(zipFile);

        const manifestFile = await zip.file("manifest.json")?.async("text");
        if (manifestFile == null) {
            throw new ZipManifestMissingError();
        }

        const manifest = await Manifest.deserialize(JSON.parse(manifestFile));

        const imgFolder = zip.folder("images");
        if (imgFolder == null) {
            loadErrors.push(new ZipImageFolderMissingError());
        } else {
            for (const pageNo in manifest.pages) {
                const page = manifest.pages[pageNo];
                const image = await imgFolder.file(page.imageHash + ".bin")?.async("arraybuffer");
                if (image == null) {
                    loadErrors.push(new ZipImageMissingError({ pageNo: +pageNo + 1, page }));
                } else {
                    const imageHash = BufferSerializer.bufToHex(
                        await crypto.subtle.digest("SHA-1", image)
                    );
                    if (page.imageHash !== imageHash) {
                        loadErrors.push(new ZipImageIntegrityError({ pageNo: +pageNo + 1, page }));
                    }
                }
            }
        }

        return new Project(manifest, zip, loadErrors);
    }

    constructor(manifest: Manifest, zip?: JSZip, loadErrors?: Error[]) {
        this.manifest = manifest;
        this.zip = zip ?? new JSZip();
        if (loadErrors != null) {
            this.loadErrors = loadErrors;
        }
    }

    /**
     * 
     * @param hash The image hash
     * @returns The image blob, or null if the image does not exist.
     */
    async getImage(hash: string): Promise<Blob | null> {
        return this.zip.folder("images")?.file(hash + ".bin")?.async("blob")
            ?? null;
    }

    /**
     * @returns Image hashes
     */
    getImages(): string[] {
        return this.zip.folder("images")?.file(/[a-f0-9]+\.bin$/)
            .map(f => f.name.split("/").pop()?.split(".bin").shift() as string) ?? [];
    }

    async addNewPage(image: File): Promise<Page> {
        return new Promise<ArrayBuffer>((res, rej) => {
            const fr = new FileReader();
            fr.onload = async (e) => {
                if (e.target == null) {
                    rej(new FileReadError());
                } else {
                    res(e.target.result as ArrayBuffer);
                }
            }
            fr.onerror = rej;
            fr.readAsArrayBuffer(image);
        }).then(async (v) => {
            const hash = await this.attachImage(v);
            const page = Page.create(this.manifest, image.name, hash);
            this.manifest.pages.push(page);
            return page;
        });
    }

    private async attachImage(image: ArrayBuffer): Promise<string> {
        const imageHash = BufferSerializer.bufToHex(
            await crypto.subtle.digest("SHA-1", image)
        );

        // The folder will always be created, but the ? is for
        // type safety.
        this.zip.folder("images")?.file(imageHash + ".bin", image);
        return imageHash;
    }

    async save(): Promise<Blob> {
        const errors = [];
        const imgFolder = this.zip.folder("images");

        // Overwrite manifest
        this.zip.file("manifest.json", JSON.stringify(this.manifest.serialize()));

        // zero-indexed page image hashes
        // { "0": "page 1 hash", "1": "page 2 hash", ... }
        const pageImageHashMap = Object.fromEntries(
            this.manifest.pages.map((p, i) => [i, p.imageHash])
        );

        // Check if all the images are there
        for (const [pageNo, pageImageHash] of Object.entries(pageImageHashMap)) {
            // Check if the image is corrupt
            const imageFile = await imgFolder?.file(`${pageImageHash}.bin`);
            if (imageFile == null) {
                errors.push(new ZipImageMissingError({ 
                    pageNo: +pageNo + 1,
                    page: this.manifest.pages[+pageNo]
                }));
                continue;
            }

            const actualImageHash =
                await crypto.subtle.digest("SHA-1", await imageFile.async("arraybuffer"));
            if (pageImageHash !== BufferSerializer.bufToHex(actualImageHash)) {
                errors.push(new ZipImageIntegrityError({ 
                    pageNo: +pageNo + 1,
                    page: this.manifest.pages[+pageNo]
                }));
                continue;
            }
        }

        // Silently remove images that are no longer in use
        const zipImageHashes = this.getImages();
        const pageImageHashes = Object.values(pageImageHashMap);
        for (const zipImageHash of zipImageHashes) {
            if (!pageImageHashes.includes(zipImageHash)) {
                imgFolder?.remove(`${zipImageHash}.bin`);
            }
        }

        return this.zip.generateAsync({
            type: "blob",
            compression: "DEFLATE",
            compressionOptions: { level: 9 },
            comment: "Created with Tater (https://superstorm784.github.io/tater)",
            mimeType: Project.MIME_TYPE
        });
    }

    async triggerDownload(): Promise<void> {
        var anchor = document.createElement("a");
        // document.body.appendChild(anchor);
        // anchor.style.display = "none";
        const data = await this.save();
        const url = window.URL.createObjectURL(data);
        anchor.href = url;
        anchor.download = 
            this.manifest.name.replace(/[^A-Z0-9\-_()+!?]/gi, "-") + ".tater";
        anchor.click();
        window.URL.revokeObjectURL(url);
        // document.body.removeChild(anchor);
    }

}