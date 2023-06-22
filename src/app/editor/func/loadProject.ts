import Project from "../../../projects/Project";
import requestFiles from "../../../util/requestFiles";
import {IEditorContext} from "../EditorContext";

export default async function loadProject(
    context: IEditorContext | ((project: Project) => void)
) {
    const file = await requestFiles({ accept: "*.tater" });
    if (file) {
        const project = await Project.loadFromBlob(file);
        if (typeof context === "function") {
            context(project);
        } else {
            context.setProject?.(project);
        }
    }
}