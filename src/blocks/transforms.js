// may do matrixes too

import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["transforms_sprites_menu"] = {
    init: function () {
        this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
            ["placeholder", ""],
        ]),
        "MENU"
        );
        this.setOutput(true, "Sprite");
        this.setStyle("transforms_blocks");
    },
};

Blockly.Blocks["transforms_reparent_to_sprite"] = {
    init: function () {
        this.appendValueInput("SPRITE").setCheck("Sprite").appendField("reparent to")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle("transforms_blocks");
    },
};

Blockly.Blocks["transforms_set_space_position_to_vector"] = {
    init: function () {
        this.appendDummyInput().appendField("set")
        this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
            ["local", "local"],
            ["global", "global"],
        ]),
        "CONSTANT"
        );  
        this.appendValueInput("VECTOR").setCheck("Vector").appendField("position to")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle("transforms_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock["transforms_reparent_to_sprite"] = function (
  block,
  generator
) {
    const sprite = block.getFieldValue("SPRITE");
    return `reparentTo(${sprite});`;
};

BlocklyJS.javascriptGenerator.forBlock["transforms_set_space_position_to_vector"] = function (
  block,
  generator
) {
    const space = block.getFieldValue("CONSTANT");
    const vector = generator.valueToCode(block, "VECTOR", BlocklyJS.Order.ATOMIC) || 0;
    return `setSpacePositionToVector(${space}, ${vector});`;
};