import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";
// contains stuff like null, and tween blocks, and everything else for all types

Blockly.Blocks["utility_binary_operations"] = {
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
        this.setStyle("utility_blocks");
    },
};

Blockly.Blocks["utility_binary_comparisons"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("A")
        this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
            ["=", "=="],
            ["==", "==="],
            [">", ">"],
            ["<", "<"],
            [">=", ">="],
            ["<=", "<="],
        ]),
        "MENU"
        );
        this.appendValueInput("B")
        this.setOutput(true, "Boolean");
        this.setStyle("utility_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock["utility_binary_operations"] = function (block, generator) {
    const MENU = block.getFieldValue("MENU");
    const A = generator.valueToCode(block, "A", BlocklyJS.Order.ATOMIC) || "";
    const B = generator.valueToCode(block, "B", BlocklyJS.Order.ATOMIC) || "";

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

    return [`handleBinaryOperation("${MENU}", ${A}, ${B})`, BlocklyJS.Order.NONE];
};

BlocklyJS.javascriptGenerator.forBlock["utility_binary_comparisons"] = function (block, generator) {
    const MENU = block.getFieldValue("MENU");
    const A = generator.valueToCode(block, "A", BlocklyJS.Order.ATOMIC) || "";
    const B = generator.valueToCode(block, "B", BlocklyJS.Order.ATOMIC) || "";

    return [`${A} ${MENU} ${B}`, BlocklyJS.Order.NONE];
};
