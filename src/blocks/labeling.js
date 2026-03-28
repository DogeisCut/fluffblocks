import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["labeling_placeholder"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("...")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setOutput(true);
        this.setStyle("labeling_blocks");
        this.mode_ = 'inert'
        this.updateShape_();
    },

    updateShape_: function (ids, connections) {
        switch (this.mode_) {
            case 'inert':
                this.setOutput(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                break;
            case 'stack':
                this.setOutput(false);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                break;
            case 'input':
                this.setOutput(true);
                this.setPreviousStatement(false);
                this.setNextStatement(false);
                break;
        }
    },

    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('mode', this.mode_);
        return container;
    },

    domToMutation: function (xmlElement) {
        this.mode_ = String(xmlElement.getAttribute('mode'));
        this.updateShape_();
    },

    onchange: function (event) {
        if (event.type !== Blockly.Events.BLOCK_DRAG || event.isStart) return;

        const inInput = !!(this.outputConnection?.isConnected());
        const inStack = !!(this.previousConnection?.isConnected() || this.nextConnection?.isConnected());
        const inAnything = inInput || inStack

        if (inAnything) {
            this.mode_ = "inert"
            if (inInput) {
                this.mode_ = "input"
            } else if (inStack) {
                this.mode_ = "stack"
            }
        } else {
            this.mode_ = "inert"
        }
        this.updateShape_()

        // TODO: fix undo
    },
};

Blockly.Blocks["labeling_label"] = {
    init: function () {
        this.appendDummyInput("LABEL_TEXT").appendField("label:").appendField(new Blockly.FieldTextInput(""), "LABEL")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setOutput(true);
        this.setStyle("labeling_blocks");
        this.mode_ = 'inert'
        this.updateShape_();
    },

    updateShape_: function (ids, connections) {
        switch (this.mode_) {
            case 'inert':
                this.setOutput(true);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.removeInput("VALUE", true);
                this.removeInput("DO", true);
                break;
            case 'stack':
                this.setOutput(false);
                this.setPreviousStatement(true);
                this.setNextStatement(true);
                this.removeInput("VALUE", true);
                if (!this.getInput("DO")) {
                    this.appendStatementInput("DO").setCheck("default")
                }
                break;
            case 'input':
                this.setOutput(true);
                this.setPreviousStatement(false);
                this.setNextStatement(false);
                if (!this.getInput("VALUE")) {
                    this.appendValueInput("VALUE");
                    this.moveInputBefore("VALUE", "LABEL_TEXT");
                }
                this.removeInput("DO", true);
                break;
        }
    },

    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('mode', this.mode_);
        return container;
    },

    domToMutation: function (xmlElement) {
        this.mode_ = String(xmlElement.getAttribute('mode'));
        this.updateShape_();
    },

    onchange: function (event) {
        if (event.type !== Blockly.Events.BLOCK_DRAG || event.isStart) return;

        const inInput = !!(this.outputConnection?.isConnected()) || !!(this.getInput("VALUE")?.connection?.isConnected());
        const inStack = !!(this.previousConnection?.isConnected() || this.nextConnection?.isConnected()) || !!(this.getInput("DO")?.connection?.isConnected());
        const inAnything = inInput || inStack

        if (inAnything) {
            this.mode_ = "inert"
            if (inInput) {
                this.mode_ = "input"
            } else if (inStack) {
                this.mode_ = "stack"
            }
        } else {
            this.mode_ = "inert"
        }
        this.updateShape_()

        // TODO: fix undo
        // TODO: make block hover preview show result
    },
};

// honestly these generators dont matter since this is just for the editor anyways

BlocklyJS.javascriptGenerator.forBlock["labeling_placeholder"] = function (block) { // do need to change this at some point though, this will cause syntax errors
    if (block.outputConnection?.isConnected()) {
        return ["/* ... */", BlocklyJS.Order.ATOMIC];
    }

    return "// ... \n";
};

BlocklyJS.javascriptGenerator.forBlock["labeling_label"] = function (block, generator) {
    const label = block.getFieldValue("LABEL");

    if (block.mode_ === 'input') { 
        const value = generator.valueToCode(block, "VALUE", BlocklyJS.Order.ATOMIC) || 'null';
        return [`${value} /* ${label} */`, BlocklyJS.Order.NONE];
    } else if (block.mode_ === 'stack') {
        const branch = generator.statementToCode(block, "DO")
        return `/* ${label} */ {\n${branch}\n};`;
    }
    return '';
};