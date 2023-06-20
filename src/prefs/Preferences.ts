import Preference from "./Preference";

const Preferences = {
    darkMode: new Preference<boolean | null, boolean | null>("darkMode", {
        // null: fall back to browser preference
        defaultValue: null,
        type: "switch",
        displayName: "Dark mode",
        description: "Enable dark or light mode, regardless of your browser preference."
    }),
    prioritizeScriptwriter: new Preference<boolean, boolean>("prioritizeScriptwriter", {
        defaultValue: false,
        type: "slider",
        displayName: "Prioritize scriptwriter",
        description: "Keep the scriptwriter on the left when the workspace is horizontal, and on the top when the workspace is vertical."
    }),
    verticalWorkspaceRatio: new Preference<number, number>("verticalWorkspaceRatio", {
        defaultValue: 0.4,
        type: "slider",
        displayName: "Workspace ratio (vertical)",
        description: "The ratio of your workspace, viewfinder over scriptwriter, when the workspace is vertical (window is portrait). Dragging the separating line in the workspace will also change this setting."
    }),
    horizontalWorkspaceRatio: new Preference<number, number>("horizontalWorkspaceRatio", {
        defaultValue: 0.4,
        type: "slider",
        displayName: "Workspace ratio (horizontal)",
        description: "The ratio of your workspace, viewfinder over scriptwriter, when the workspace is horizontal (window is landscape). Dragging the separating line in the workspace will also change this setting."
    })
};

export default Preferences;