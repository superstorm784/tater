import Page, { SerializedPage } from "./Page";

export interface SerializedManifest {
    pages: SerializedPage[];
    locale: string;
}

export default class Manifest {

    pages: Page[] = [];
    locale: string;

    static async deserialize(project: SerializedManifest): Promise<Manifest> {
        const p = new Manifest(project.locale);
        p.pages = await Promise.all(project.pages.map(Page.deserialize));
        return p;
    }

    constructor(locale: string) {
        this.locale = locale;
    }

    serialize(): SerializedManifest {
        return {
            pages: this.pages.map(v => v.serialize()),
            locale: this.locale
        };
    }

}