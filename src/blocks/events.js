import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["events_on_start"] = {
  init: function () {
        this.setInputsInline(true);
        this.appendDummyInput()
            .appendField("on start")
        this.appendStatementInput("DO").setCheck("default");
        this.setStyle("events_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock["events_on_start"] = function (block, generator) {
	const branch = generator.statementToCode(block, "DO");
	return `registerEventListener("start", function* (target) {\n${branch}\n});\n`;
};
