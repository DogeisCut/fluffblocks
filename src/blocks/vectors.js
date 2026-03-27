import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["vectors_vector_of_constant"] = {
    init: function () {
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
        this.setOutput(true, "Vector");
        this.setStyle("vectors_blocks");
    },
};
BlocklyJS.javascriptGenerator.forBlock["vectors_vector_of_constant"] = function (
  block,
  generator
) {
    const menu = block.getFieldValue("CONSTANT");
    return [`Vector.${menu}`, BlocklyJS.Order.NONE];
};