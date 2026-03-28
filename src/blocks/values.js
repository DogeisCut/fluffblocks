import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";
// internal category

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