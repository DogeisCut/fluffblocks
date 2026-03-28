import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["print_any_to_console"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("ANY").appendField("print")
        this.appendDummyInput().appendField("to console")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle("debugging_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock["print_any_to_console"] = function (block, generator) {
    const ANY = generator.valueToCode(block, "ANY", BlocklyJS.Order.ATOMIC) || "";
    return `console.log(${ANY});\n`;
};