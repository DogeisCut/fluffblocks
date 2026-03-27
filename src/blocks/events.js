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
BlocklyJS.javascriptGenerator.forBlock["on_start"] = function (
  block,
  generator
) {
  const branch = generator.statementToCode(block, "DO");
  return `registerEventListener("start", function* (target) {\n${branch}\n});\n`;
};

// Blockly.Blocks["restart"] = {
//     init: function () {
//         this.appendDummyInput()
//             .appendField("restart")
//         this.setPreviousStatement(true, "default");
//         this.setNextStatement(true, "default");
//         this.setStyle("events_blocks");
//     },
// };