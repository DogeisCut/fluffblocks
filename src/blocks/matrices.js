import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";


Blockly.Blocks["matrices_matrix"] = {
    init: function () {
        this.setInputsInline(false);
        this.appendDummyInput().appendField("matrix");
        this.appendValueInput("X").setCheck("Vector")
        this.appendValueInput("Y").setCheck("Vector")
        this.appendValueInput("ORIGIN").setCheck("Vector")
        this.setOutput(true, "Matrix");
        this.setStyle("matrices_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock["matrices_matrix"] = function (block, generator) {
    const X = generator.valueToCode(block, "X", BlocklyJS.Order.ATOMIC) || 'Vector.ZERO';
    const Y = generator.valueToCode(block, "Y", BlocklyJS.Order.ATOMIC) || 'Vector.ZERO';
    const ORIGIN = generator.valueToCode(block, "ORIGIN", BlocklyJS.Order.ATOMIC) || 'Vector.ZERO';
    return [`new Matrix(${X}, ${Y}, ${ORIGIN})`, BlocklyJS.Order.NONE];
};
