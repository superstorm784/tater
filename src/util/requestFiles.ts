interface FileRequestOptions {
    accept?: string;
    capture?: 'user' | 'environment';
    multiple?: boolean;
}

export default async function requestFiles
    (options: FileRequestOptions & { multiple: true }): Promise<File[] | null>;
export default async function requestFiles
    (options: FileRequestOptions & { multiple?: false }): Promise<File | null>;
export default async function requestFiles(options: FileRequestOptions): Promise<File | File[] | null> {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    if (options.accept) input.setAttribute("accept", options.accept);
    if (options.capture) input.setAttribute("accept", options.capture);
    if (options.multiple) input.toggleAttribute("multiple", options.multiple);
    input.click();
    return new Promise<File | File[] | null>((res, rej) => {
        input.addEventListener("change", () => {
            if (input.files == null) {
                res(null);
            } else if (options.multiple) {
                res(Array.from(input.files));
            } else {
                res(input.files[0]);
            }
        })
    });
}