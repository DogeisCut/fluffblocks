import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

// would probably be better to use proper mutators for these so that there's no undoing issues

Blockly.Blocks["labeling_placeholder"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("...")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setOutput(true);
        this.setStyle("labeling_blocks");
    },

    onchange: function (event) {
        if (event.type !== Blockly.Events.BLOCK_DRAG || event.isStart) return;

        const inInput = !!(this.outputConnection?.isConnected());
        const inStack = !!(this.previousConnection?.isConnected() || this.nextConnection?.isConnected());

        this.setOutput(!inStack);
        this.setPreviousStatement(!inInput);
        this.setNextStatement(!inInput);

        // todo: fix undo
    },
};

Blockly.Blocks["labeling_label"] = {
    init: function () {
        this.setInputsInline(true);
        //this.appendDummyInput()
        this.appendValueInput("VALUE")
        this.appendStatementInput("DO").setCheck("default");
        this.appendDummyInput("LABEL_TEXT").appendField("label:").appendField(new Blockly.FieldTextInput(""), "LABEL")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setOutput(true);
        this.setStyle("labeling_blocks");
        this.getInput("VALUE")?.setVisible(false);
        this.getInput("DO")?.setVisible(false);
    },

    onchange: function (event) {
        if (event.type !== Blockly.Events.BLOCK_DRAG || event.isStart) return;

        const inInput = !!(this.outputConnection?.isConnected());
        const inStack = !!(this.previousConnection?.isConnected() || this.nextConnection?.isConnected());
        const inAnything = inInput || inStack

        this.setOutput(!inStack);
        this.setPreviousStatement(!inInput);
        this.setNextStatement(!inInput);

        this.getInput("VALUE")?.setVisible(!inStack && inAnything);
        this.getInput("DO")?.setVisible(!inInput && inAnything);

        // if (!inAnything) {
        //     this.removeInput("VALUE", true);
        //     this.removeInput("DO", true);
        // } else {
        //     if (inInput) {
        //         this.removeInput("DO", true);
        //         if (!this.getInput("VALUE")) {
        //             this.appendValueInput("VALUE");
        //             this.moveInputBefore("VALUE", "LABEL_TEXT");
        //         }
        //     } else if (inStack) {
        //         this.removeInput("VALUE", true);
        //         if (!this.getInput("DO")) {
        //             this.appendStatementInput("DO").setCheck("default");
        //             this.moveInputBefore("DO", "LABEL_TEXT");
        //         }
        //     } else {
        //         if (!this.getInput("VALUE")) {
        //             this.appendValueInput("VALUE");
        //             this.moveInputBefore("VALUE", "LABEL_TEXT");
        //         }
        //         if (!this.getInput("DO")) {
        //             this.appendStatementInput("DO").setCheck("default");
        //             this.moveInputBefore("DO", "LABEL_TEXT");
        //         }
        //     }
        // }


        // this bricks any blocks put in the stack for some reason, as in you cant put blocks in thier inputs
        // if (!inAnything) {
        //     this.getInput("VALUE")?.setCheck([])
        //     this.getInput("DO")?.setCheck([])
        // } else {
        //     if (inInput) {
        //         this.getInput("VALUE")?.setCheck(null)
        //         this.getInput("DO")?.setCheck([])
        //     } else if (inStack) {
        //         this.getInput("VALUE")?.setCheck([])
        //         this.getInput("DO")?.setCheck('default')
        //     } else {
        //         this.getInput("VALUE")?.setCheck(null)
        //         this.getInput("DO")?.setCheck('default')
        //     }
        // }

        // todo: prevent placement and kick out contents when hidden
        // todo: fix undo
    },
};

// honestly these generators dont matter since this is just for the editor anyways

BlocklyJS.javascriptGenerator.forBlock["labeling_placeholder"] = function (block) {
    if (block.outputConnection?.isConnected()) {
        return ["/* ... */", BlocklyJS.Order.ATOMIC];
    }

    return "// ... \n";
};

BlocklyJS.javascriptGenerator.forBlock["labeling_label"] = function (block, generator) {
    const branch = generator.statementToCode(block, "DO").replace(/^\s+/gm, "");
    const value = generator.valueToCode(block, "VALUE", BlocklyJS.Order.ATOMIC) || 'null';
    const label = block.getFieldValue("LABEL");

    if (block.outputConnection?.isConnected()) {
        return [`${value} /* ${label} */`, BlocklyJS.Order.ATOMIC];
    }

    const lines = branch.trimEnd().split("\n");
    lines[lines.length - 1] += ` // ${label}`;
    return lines.join("\n") + "\n";
};