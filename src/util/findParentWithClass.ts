
export default function findParentWithClass(
    element: Element,
    className: string
): Element | null {
    let pivot = element;
    console.log(pivot);
    while (
        pivot.parentElement != null &&
        !pivot.classList.contains(className)
    ) {
        pivot = pivot.parentElement!;
    }
    return pivot.classList.contains(className) ? pivot : null;
}