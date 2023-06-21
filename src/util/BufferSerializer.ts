export default class BufferSerializer {

    static bufToHex(buffer: ArrayBuffer): string {
        return Array.from(new Uint8Array(buffer))
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("");
    }

    static hexToBuf(hex: string): ArrayBuffer {
        const buffer = new ArrayBuffer(hex.length / 2);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < hex.length; i += 2) {
            view[i / 2] = parseInt(hex.substring(i, i + 2), 16);
        }
        return buffer;
    }

}