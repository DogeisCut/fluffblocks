import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["arrays_array"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("vector of");
        this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
            ["zero", "ZERO"],
            ["one", "ONE"],
            ["infinity", "INF"],
            ["left", "LEFT"],
            ["right", "RIGHT"],
            ["up", "UP"],
            ["down", "DOWN"],
        ]),
        "CONSTANT"
        );
        this.setOutput(true, "Array");
        this.setStyle("arrays_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock["arrays_array"] = function (block, generator) {
    const menu = block.getFieldValue("CONSTANT");
    return [`Vector.${menu}`, BlocklyJS.Order.NONE];
};