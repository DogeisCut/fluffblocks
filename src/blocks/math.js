import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["math_binary"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("A")//.setCheck("Number")
        this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
            ["+", "+"],
            ["-", "-"],
            ["*", "*"],
            ["/", "/"],
            ["^", "**"],
            ["%", "%"],
        ]),
        "MENU"
        );
        this.appendValueInput("B")//.setCheck("Number")
        this.setOutput(true/*, "Number"*/);
        this.setStyle("math_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock["math_binary"] = function (block, generator) { // TODO: handle types like vector
    const MENU = block.getFieldValue("MENU");
    const A = generator.valueToCode(block, "A", BlocklyJS.Order.ATOMIC) || 0;
    const B = generator.valueToCode(block, "B", BlocklyJS.Order.ATOMIC) || 0;
    return [`${A} ${MENU} ${B}`, BlocklyJS.Order.NONE];
};