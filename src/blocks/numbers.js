import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["number_any_to_number"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("ANY")
        this.appendDummyInput().appendField("to number");
        this.setOutput(true, "Number");
        this.setStyle("numbers_blocks");
    },
};

BlocklyJS.javascriptGenerator.forBlock["number_any_to_number"] = function (block, generator) {
    const ANY = generator.valueToCode(block, "ANY", BlocklyJS.Order.ATOMIC) || 0;
    return [`+${ANY}`, BlocklyJS.Order.NONE]
}