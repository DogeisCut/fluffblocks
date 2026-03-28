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



BlocklyJS.javascriptGenerator.forBlock["math_binary"] = function (block, generator) {
    const MENU = block.getFieldValue("MENU");
    const A = generator.valueToCode(block, "A", BlocklyJS.Order.ATOMIC) || "0";
    const B = generator.valueToCode(block, "B", BlocklyJS.Order.ATOMIC) || "0";

    // decided to comment this out since this doesnt handle the value_any block (as it just always assumes to directly use operators)
    // ugh i wouldnt have to deal with this if js had operator overloads

    // const blockA = block.getInputTargetBlock("A");
    // const blockB = block.getInputTargetBlock("B");

    // const getOutputType = (b) => b?.outputConnection?.getCheck()?.[0] ?? null;

    // const typeA = getOutputType(blockA);
    // const typeB = getOutputType(blockB);

    // const isNumeric = (t) => t === "Number" || t === null;
    // const isString  = (t) => t === "String";

    // const NUMBERS_ONLY   = isNumeric(typeA) && isNumeric(typeB);
    // const STRINGS_CONCAT = (isString(typeA) || isString(typeB)) && MENU === "+";

    // if (NUMBERS_ONLY || STRINGS_CONCAT) {
    //     return [`${A} ${MENU} ${B}`, BlocklyJS.Order.NONE];
    // }

    return [`handleBinary("${MENU}", ${A}, ${B})`, BlocklyJS.Order.NONE];
};