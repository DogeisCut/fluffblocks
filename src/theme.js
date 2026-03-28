import * as Blockly from "blockly";

const blockStyles = {
    events_blocks: {
        colourPrimary: "#CC5252",
    },
    control_blocks: {
        colourPrimary: "#D27654",
    },
    input_blocks: {
        colourPrimary: "#D79D56",
    },
    booleans_blocks: {
        colourPrimary: "#DCC458",
    },
    numbers_blocks: {
        colourPrimary: "#D4E05A",
    },
    strings_blocks: {
        colourPrimary: "#B2E45B",
    },
    color_blocks: {
        colourPrimary: "#8FE75C",
    },
    vectors_blocks: {
        colourPrimary: "#6AE95D",
    },
    arrays_blocks: {
        colourPrimary: "#5EEB77",
    },
    tables_blocks: {
        colourPrimary: "#5EEC9E",
    },
    sprites_blocks: {
        colourPrimary: "#5EECC5",
    },
    threads_blocks: {
        colourPrimary: "#5EECEC",
    },
    matrices_blocks: {
        colourPrimary: "#5EC4EB",
    },
    utility_blocks: {
        colourPrimary: "#5D9DE9",
    },
    transforms_blocks: {
        colourPrimary: "#5C75E7",
    },
    graphics_blocks: {
        colourPrimary: "#685BE4",
    },
    audio_blocks: {
        colourPrimary: "#8B5AE0",
    },
    drawing_blocks: {
        colourPrimary: "#AC58DC",
    },
    labeling_blocks: {
        colourPrimary: "#999999",
    },
    debugging_blocks: {
        colourPrimary: "#666666",
    },
    variables_blocks: {
        colourPrimary: "#D254BB",
    },
    functions_blocks: {
        colourPrimary: "#CC5294",
    },
    values: {
        colourPrimary: "#ffffff",
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