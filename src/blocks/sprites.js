import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";


Blockly.Blocks["sprites_sprites_menu"] = {
    init: function () {
        this.appendDummyInput().appendField(
        new Blockly.FieldDropdown([
            ["Sprite1", "placeholderID"],
        ]),
        "MENU"
        );
        this.setOutput(true, "Sprite");
        this.setStyle("sprites_blocks");
    },
};

Blockly.Blocks["sprites_get"] = { // TODO: change return type based on input and change input type based on where this block is placed
    init: function () {
        this.appendDummyInput().appendField("get");
        this.setOutput(true, "Sprite");
        this.setStyle("sprites_blocks");
    },
};


BlocklyJS.javascriptGenerator.forBlock["sprites_sprites_menu"] = function (
  block,
  generator
) {
    const menu = block.getFieldValue("MENU");
    return [`${menu}`, BlocklyJS.Order.NONE];
};
