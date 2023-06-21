import Page, { SerializedPage } from "./Page";

export interface SerializedManifest {
    pages: SerializedPage[];
    name: string;
    locale: string;
}

export default class Manifest {

    pages: Page[] = [];
    name: string;
    locale: string;

    static async deserialize(project: SerializedManifest): Promise<Manifest> {
        const p = new Manifest(project.name, project.locale);
        p.pages = await Promise.all(project.pages.map(Page.deserialize));
        return p;
    }

    constructor(name: string, locale: string) {
        this.name = name;
        this.locale = locale;
    }

    serialize(): SerializedManifest {
        return {
            pages: this.pages.map(v => v.serialize()),
            name: this.name,
            locale: this.locale
        };
    }

}