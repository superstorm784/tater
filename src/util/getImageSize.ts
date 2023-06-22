export default async function getImageSize(imageSrc: string): Promise<[number, number]> {
    const img = document.createElement("img");
    img.setAttribute("src", imageSrc);
    img.style.opacity = "0";
    img.style.position = "fixed";
    img.style.top = "100vh";
    img.style.left = "100vw";
    document.body.appendChild(img);
    return new Promise((res) => {
        img.addEventListener("load", () => {
            const width = img.width;
            const height = img.height;
            document.body.removeChild(img);
            res([width, height]);
        });
    });
}