import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";
// internal category

Blockly.Blocks["values_number"] = {
    init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), "NUMBER");
        this.setOutput(true, "Number");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_string"] = {
    init() {
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("foo"), "STRING");
        this.setOutput(true, "String");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_any"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField(
            new Blockly.FieldTextInput(),
            "ANY"
        );
        this.setOutput(true);
        this.setStyle("values");
    },
};



BlocklyJS.javascriptGenerator.forBlock["values_number"] = function(block) {
    const NUMBER = block.getFieldValue("NUMBER");
    const code = Number(NUMBER);
    const order = code < 0 ? BlocklyJS.Order.UNARY_NEGATION : BlocklyJS.Order.ATOMIC;
    return [code, order];
};

BlocklyJS.javascriptGenerator.forBlock["values_string"] = function(block) {
    const STRING = block.getFieldValue("STRING");
    const code = String(STRING);
    return [`"${code}"`, BlocklyJS.Order.ATOMIC];
};

BlocklyJS.javascriptGenerator.forBlock["values_any"] = function (block, generator) {
    var raw = block.getFieldValue('ANY').trim();
    return [parseValue(raw), BlocklyJS.Order.ATOMIC];
};



function parseValue(raw) {
    raw = raw.trim();

    if (raw === 'null') return 'null';
    if (raw === 'true' || raw === 'false') return raw;

    // Number
    if (!isNaN(raw) && raw !== '') return raw;

    // Array — try to parse recursively
    // ignore for now

    // Object/map — try to parse recursively
    // ignore for now

    // String
    return JSON.stringify(raw);
}