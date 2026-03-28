import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["vectors_vector_of_menu"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("vector of");
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["zero", "ZERO"],
                ["one", "ONE"],
                ["infinity", "INF"],
                ["left", "LEFT"],
                ["right", "RIGHT"],
                ["up", "UP"],
                ["down", "DOWN"],
            ]),
            "MENU"
        );
        this.setOutput(true, "Vector");
        this.setStyle("vectors_blocks");
    },
};

Blockly.Blocks["vectors_vector_x_y"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("vector x:");
        this.appendValueInput("X").setCheck("Number")
        this.appendDummyInput().appendField("y:");
        this.appendValueInput("Y").setCheck("Number")
        this.setOutput(true, "Vector");
        this.setStyle("vectors_blocks");
    },
};

Blockly.Blocks["vectors_vector_magnitude_angle"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("vector magnitude:");
        this.appendValueInput("MAGNITUDE").setCheck("Number")
        this.appendDummyInput().appendField("angle:");
        this.appendValueInput("ANGLE").setCheck("Number")
        this.setOutput(true, "Vector");
        this.setStyle("vectors_blocks");
    },
};

Blockly.Blocks["vectors_menu_of_vector"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["x", "x"],
                ["y", "y"],
                ["length", "length"],
                ["squared length", "squaredLength"],
                ["angle", "angle"],
            ]),
            "MENU"
        );
        this.appendDummyInput().appendField("of");
        this.appendValueInput("VECTOR").setCheck("Vector")
        this.setOutput(true, "Number");
        this.setStyle("vectors_blocks");
    },
};

Blockly.Blocks["vectors_vector_menu"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("VECTOR").setCheck("Vector")
        this.appendDummyInput().appendField(
            new Blockly.FieldDropdown([
                ["normalized", "normalized"],
                ["rounded", "rounded"],
                ["floored", "floored"],
                ["ceiled", "ceiled"],
                ["absed", "absed"],
            ]),
            "MENU"
        );
        this.setOutput(true, "Vector");
        this.setStyle("vectors_blocks");
    },
};

Blockly.Blocks["vectors_vector_rotated_by_angle"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("VECTOR").setCheck("Vector")
        this.appendDummyInput().appendField("rotated by");
        this.appendValueInput("ANGLE").setCheck("Number")
        this.setOutput(true, "Vector");
        this.setStyle("vectors_blocks");
    },
};


BlocklyJS.javascriptGenerator.forBlock["vectors_vector_of_menu"] = function (block, generator) {
    const MENU = block.getFieldValue("MENU");
    return [`Vector.${MENU}`, BlocklyJS.Order.NONE];
};

BlocklyJS.javascriptGenerator.forBlock["vectors_vector_x_y"] = function (block, generator) {
    const X = generator.valueToCode(block, "X", BlocklyJS.Order.ATOMIC) || 0;
    const Y = generator.valueToCode(block, "Y", BlocklyJS.Order.ATOMIC) || 0;
    return [`new Vector(${X}, ${Y})`, BlocklyJS.Order.NONE];
};

BlocklyJS.javascriptGenerator.forBlock["vectors_vector_magnitude_angle"] = function (block, generator) {
    const MAGNITUDE = generator.valueToCode(block, "MAGNITUDE", BlocklyJS.Order.ATOMIC) || 0;
    const ANGLE = generator.valueToCode(block, "ANGLE", BlocklyJS.Order.ATOMIC) || 0;
    return [`Vector.fromAngle(${ANGLE}, ${MAGNITUDE})`, BlocklyJS.Order.NONE];
};

BlocklyJS.javascriptGenerator.forBlock["vectors_menu_of_vector"] = function (block, generator) {
    const MENU = block.getFieldValue("MENU");
    const VECTOR = generator.valueToCode(block, "VECTOR", BlocklyJS.Order.ATOMIC) || "Vector.ZERO";
    return [`${VECTOR}.${MENU}`, BlocklyJS.Order.NONE];
};

BlocklyJS.javascriptGenerator.forBlock["vectors_vector_menu"] = function (block, generator) {
    const MENU = block.getFieldValue("MENU");
    const VECTOR = generator.valueToCode(block, "VECTOR", BlocklyJS.Order.ATOMIC) || "Vector.ZERO";
    return [`${VECTOR}.${MENU}()`, BlocklyJS.Order.NONE];
};

BlocklyJS.javascriptGenerator.forBlock["vectors_vector_rotated_by_angle"] = function (block, generator) {
    const VECTOR = generator.valueToCode(block, "VECTOR", BlocklyJS.Order.ATOMIC) || "Vector.ZERO";
    const ANGLE = generator.valueToCode(block, "ANGLE", BlocklyJS.Order.ATOMIC) || 0;
    return [`${VECTOR}.rotated(${ANGLE})`, BlocklyJS.Order.NONE];
};