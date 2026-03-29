import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["strings_any_to_string"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("ANY");
        this.setOutput(true, "String");
        this.setStyle("strings_blocks");
    },
};


Blockly.Blocks["strings_join_mutator_join"] = {
    init: function () {
    },
};
Blockly.Blocks["strings_join_mutator_string"] = {
    init: function () {
    },
};
Blockly.Blocks["strings_join_mutator_value"] = {
    init: function () {
    },
};
Blockly.Blocks["strings_join"] = { // like array block, has two inner blocks, one for string, another for var, compiles to `${var} my text${1+2}${7}`
    init: function () {
    },
};



BlocklyJS.javascriptGenerator.forBlock["strings_any_to_string"] = function (block, generator) {
    const ANY = generator.valueToCode(block, "ANY", BlocklyJS.Order.ATOMIC) || '';

    return [`String(${ANY})`, BlocklyJS.Order.ATOMIC];
};