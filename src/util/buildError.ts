export default function buildError<K = void>(defaultMessage: string | ((data: K) => string)) {
    return class extends Error {
        constructor(data: K, message?: string) {
            const _defaultMessage = 
                typeof defaultMessage === "string" ? defaultMessage : defaultMessage(data);
            super(message ?? _defaultMessage);
            Object.assign(this, data);
        }
    }
}