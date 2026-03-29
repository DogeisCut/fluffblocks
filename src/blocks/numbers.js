import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["number_unary_operation"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
            ["+", "+"],
            ["-", "-"],
        ]),
        "MENU"
        );
        this.appendValueInput("ANY")
        this.appendDummyInput()
        this.setOutput(true, "Number");
        this.setStyle("numbers_blocks");
    },
};

BlocklyJS.javascriptGenerator.forBlock["number_unary_operation"] = function (block, generator) {
    const MENU = block.getFieldValue("MENU");
    const ANY = generator.valueToCode(block, "ANY", BlocklyJS.Order.ATOMIC) || 0;
    return [`${MENU}${ANY}`, BlocklyJS.Order.NONE]
}