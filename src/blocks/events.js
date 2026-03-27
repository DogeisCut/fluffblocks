import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["on_start"] = {
    init: function () {
        this.appendDummyInput()
            .appendField("on start")
        this.appendStatementInput("DO").setCheck("default");
        this.setStyle("events_blocks");
    },
};