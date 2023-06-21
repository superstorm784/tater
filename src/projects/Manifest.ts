import Page, { SerializedPage } from "./Page";

export interface SerializedManifest {
    pages: SerializedPage[];
    name: string;
    locale: string;
    targetLocales: string[];
    lastChange: number;
}

export default class Manifest {

    pages: Page[] = [];
    name: string;
    locale: string;
    targetLocales: string[];
    lastChange: Date;

    static async deserialize(project: SerializedManifest): Promise<Manifest> {
        const m = new Manifest(project.name, project.locale, project.targetLocales);
        m.pages = await Promise.all(project.pages.map(Page.deserialize.bind(null, m)));
        m.lastChange = new Date(project.lastChange);
        return m;
    }

    constructor(name: string, locale: string, targetLocales: string[] = ["en"]) {
        this.name = name;
        this.locale = locale;
        this.targetLocales = targetLocales;
        this.lastChange = new Date();
    }

    bump() {
        this.lastChange = new Date();
    }

    serialize(): SerializedManifest {
        return {
            pages: this.pages.map(v => v.serialize()),
            name: this.name,
            locale: this.locale,
            targetLocales: this.targetLocales,
            lastChange: this.lastChange.getTime()
        };
    }

}