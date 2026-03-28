import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["booleans_any_to_boolean"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("ANY");
        this.appendDummyInput().appendField("to boolean");
        this.setOutput(true, "Boolean");
        this.setStyle("booleans_blocks");
    },
};

Blockly.Blocks["booleans_not"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("not");
        this.appendValueInput("BOOLEAN").setCheck("Boolean");
        this.setOutput(true, "Boolean");
        this.setStyle("booleans_blocks");
    },
};

Blockly.Blocks["booleans_binary_logic"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("A").setCheck("Boolean");
        this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
            ["and", "and"],
            ["or", "or"],
            ["xor", "xor"],
            ["nand", "nand"],
            ["nor", "nor"],
            ["xnor", "xnor"],
        ]),
        "MENU"
        );
        this.appendValueInput("B").setCheck("Boolean");
        this.setOutput(true, "Boolean");
        this.setStyle("booleans_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock["booleans_any_to_boolean"] = function (block, generator) {
    const ANY = generator.valueToCode(block, "ANY", BlocklyJS.Order.ATOMIC) || '';

    return [`Boolean(${ANY})`, BlocklyJS.Order.NONE];
};

BlocklyJS.javascriptGenerator.forBlock["booleans_not"] = function (block, generator) {
    const BOOLEAN = generator.valueToCode(block, "BOOLEAN", BlocklyJS.Order.ATOMIC) || false;

    return [`!${BOOLEAN}`, BlocklyJS.Order.NONE];
};

BlocklyJS.javascriptGenerator.forBlock["booleans_binary_logic"] = function (block, generator) {
    const MENU = block.getFieldValue("MENU");
    const A = generator.valueToCode(block, "A", BlocklyJS.Order.ATOMIC) || false;
    const B = generator.valueToCode(block, "B", BlocklyJS.Order.ATOMIC) || false;

    switch (MENU) {
        case 'and':
            return [`${A} && ${B}`, BlocklyJS.Order.NONE]
        case 'or':
            return [`${A} || ${B}`, BlocklyJS.Order.NONE]
        case 'xor':
            return [`${A} != ${B}`, BlocklyJS.Order.NONE]
        case 'nand':
            return [`!${A} && !${B}`, BlocklyJS.Order.NONE]
        case 'nor':
            return [`!${A} || !${B}`, BlocklyJS.Order.NONE]
        case 'xnor':
            return [`!${A} != !${B}`, BlocklyJS.Order.NONE]
    }

    return [``, BlocklyJS.Order.NONE];
};
