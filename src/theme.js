import * as Blockly from "blockly";

const blockStyles = {
    events_blocks: {
        colourPrimary: "#d89c1b",
    },
    vectors_blocks: {
        colourPrimary: "#2ccfb9",
    },
    transforms_blocks: {
        colourPrimary: "#2f2ccf",
    },
    variable_blocks: {
        colourPrimary: "#cf6813",
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