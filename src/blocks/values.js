import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";
// internal category

Blockly.Blocks["values_boolean"] = { // TODO: custom checkbox field... this one doesnt interface with shadowed blocks and seems to have a minimum height
    init() {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField(new Blockly.FieldCheckbox(), "BOOLEAN");
        this.setOutput(true, "Boolean");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_number"] = {
    init() {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), "NUMBER");
        this.setOutput(true, "Number");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_angle"] = { // TODO: Custom Angle Field
    init() {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField(new Blockly.FieldNumber(0), "NUMBER");
        this.setOutput(true, "Number");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_string"] = {
    init() {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField(new Blockly.FieldTextInput("foo"), "STRING");
        this.setOutput(true, "String");
        this.setStyle("values");
    }
};

Blockly.Blocks["values_any"] = { // TODO: custom field that lets you select a type
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

Blockly.Blocks["values_vector"] = { // TODO: custom vector field
    init() {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("x:")
            .appendField(new Blockly.FieldNumber(0), "X")
        this.appendDummyInput().appendField("y:")
            .appendField(new Blockly.FieldNumber(0), "Y");
        this.setOutput(true, "Vector");
        this.setStyle("values");
    }
};

BlocklyJS.javascriptGenerator.forBlock["values_boolean"] = function(block) {
    const BOOLEAN = block.getFieldValue("BOOLEAN");
    const code = Boolean(BOOLEAN === 'TRUE');
    return [code, BlocklyJS.Order.ATOMIC];
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
    const raw = block.getFieldValue('ANY').trim();
    return [parseValue(raw), BlocklyJS.Order.ATOMIC];
};

BlocklyJS.javascriptGenerator.forBlock["values_vector"] = function (block, generator) {
    const X = block.getFieldValue("X");
    const Y = block.getFieldValue("Y");
    return [`new Vector(${X}, ${Y})`, BlocklyJS.Order.NONE];
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