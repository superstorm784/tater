type OptionalWhenJSONSerializable<T, U> = 
    [T] extends 
    // Primitives
    [string] | [number] | [boolean] | [undefined] | [null] |
    // Array primitives (of varying types)
    [(string | number | boolean | undefined | null)[]] ? Partial<U> : Required<U>;

interface PreferenceInitBase<U> {
    defaultValue: U;
}

type PreferenceType = "shorttext" | "longtext" | "switch" | "slider";

interface VisiblePreferenceInit {
    type: PreferenceType;
    displayName: string;
    description: string;
}

interface HiddenPreferenceInit {
    type: "hidden";
    displayName: never;
    description: never;
}

type PreferenceInit<U, S> = PreferenceInitBase<U> & (
    OptionalWhenJSONSerializable<U, {
        serialize: (value: U) => S;
        deserialize: (value: S) => U;
    }>
) & (HiddenPreferenceInit | VisiblePreferenceInit)

export class PreferenceChangeEvent<U, S> extends Event {
    
    constructor(
        public preference: Preference<U, S>,
        public value: U,
        eventInitDict?: EventInit
    ) { 
        super("change", eventInitDict);
    }

}
interface PreferenceChangeEventListener<U, S> {
    (evt: PreferenceChangeEvent<U, S>): void;
}

interface PreferenceChangeEventListenerObject<U, S> {
    handleEvent(object: PreferenceChangeEvent<U, S>): void;
}

type PreferenceChangeEventListenerOrObject<U, S> = 
    PreferenceChangeEventListener<U, S> | PreferenceChangeEventListenerObject<U, S>;

/**
 * A preference. `U` is the type of this preference, unserialized, and `S`
 * is the type of this preference, serialized.
 */
class Preference<U, S> extends EventTarget {

    static primitiveSerializer = (v: any) => v;
    static primitiveDeserializer = (v: any) => v;
    
    public readonly name: string;
    private loaded: boolean = false;
    private value: U;
    private readonly defaultValue: U;

    private serializer: (value: U) => S;
    private deserializer: (value: S) => U;

    constructor(name: string, options: PreferenceInit<U, S>) {
        super();
        this.name = name;
        this.value = options.defaultValue;
        this.defaultValue = options.defaultValue;

        this.serializer = options.serialize ?? Preference.primitiveSerializer;
        this.deserializer = options.deserialize ?? Preference.primitiveDeserializer;
    }

    get(): U {
        if (this.loaded) {
            return this.value;
        } else {
            return this.reload();
        }
    }

    set(value: U) {
        this.value = value;
        this.save();
        this.dispatchEvent(new PreferenceChangeEvent(this, value));
    }

    reload(): U {
        const savedValue = window.localStorage.getItem("tt-pref-" + this.name);
        if (savedValue) {
            const serialized = JSON.parse(savedValue) as S;
            this.value = this.deserializer(serialized);
            this.loaded = true;
        } else {
            // Default value already preloaded
            this.loaded = true;
        }
        return this.value;
    }

    save() {
        const serialized = JSON.stringify(this.serializer(this.value));
        window.localStorage.setItem("tt-pref-" + this.name, serialized);
    }

    clear() {
        this.value = this.defaultValue;
        // In case this was called before the preference got loaded
        this.loaded = true;
        window.localStorage.removeItem("tt-pref-" + this.name);
        this.dispatchEvent(new PreferenceChangeEvent(this, this.value));
    }

}

interface Preference<U, S> {
    addEventListener(
        type: "change",
        listener: PreferenceChangeEventListenerOrObject<U, S> | null,
        options?: boolean | AddEventListenerOptions
    ): void;
}

export default Preference;