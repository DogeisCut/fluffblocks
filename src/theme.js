import * as Blockly from "blockly";

const blockStyles = {
    events_blocks: {
        colourPrimary: "#d81b1b",
    },
    control_blocks: {
        colourPrimary: "#d8571b",
    },
    input_blocks: {
        colourPrimary: "#d8961b",
    },
    math_blocks: {
        colourPrimary: "#cbd81b",
    },
    strings_blocks: {
        colourPrimary: "#9fd81b",
    },
    color_blocks: {
        colourPrimary: "#67d81b",
    },
    vectors_blocks: {
        colourPrimary: "#1bd81b",
    },
    arrays_blocks: {
        colourPrimary: "#1bd86a",
    },
    tables_blocks: {
        colourPrimary: "#1bd879",
    },
    sprites_blocks: {
        colourPrimary: "#1bd8a9",
    },
    threads_blocks: {
        colourPrimary: "#1b8cd8",
    },
    matricies_blocks: {
        colourPrimary: "#1b47d8",
    },
    utility_blocks: {
        colourPrimary: "#1e1bd8",
    },
    transforms_blocks: {
        colourPrimary: "#631bd8",
    },
    graphics_blocks: {
        colourPrimary: "#8c1bd8",
    },
    audio_blocks: {
        colourPrimary: "#c81bd8",
    },
    drawing_blocks: {
        colourPrimary: "#d81bc8",
    },
    labeling_blocks: {
        colourPrimary: "#d81b90",
    },
    debugging_blocks: {
        colourPrimary: "#d81b83",
    },
    variables_blocks: {
        colourPrimary: "#d81b54",
    },
    functions_blocks: {
        colourPrimary: "#d81b34",
    },
};

const theme = Blockly.Theme.defineTheme('themeName', {
	base: Blockly.Themes.Classic,
	startHats: true,
    blockStyles,
    componentStyles: {
        workspaceBackgroundColour: "#251a1a",
        toolboxBackgroundColour: "#363030",
        toolboxForegroundColour: "#fff",
        flyoutBackgroundColour: "#212327",
        flyoutForegroundColour: "#ccc",
        flyoutOpacity: 1,
        scrollbarColour: "#797979",
        insertionMarkerColour: "#fff",
        insertionMarkerOpacity: 0.3,
        scrollbarOpacity: 0.4,
        cursorColour: "#d0d0d0",
    },
});

export default theme