import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["set_position_to_vector"] = {
    init: function () {
        this.appendValueInput("VECTOR").setCheck("Vector").appendField("set position to")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle("transforms_blocks");
    },
};
BlocklyJS.javascriptGenerator.forBlock["set_position_to_vector"] = function (
  block,
  generator
) {
    const vector = generator.valueToCode(block, "VECTOR", BlocklyJS.Order.ATOMIC) || 0;
    return `setPositionToVector(${vector});`;
};