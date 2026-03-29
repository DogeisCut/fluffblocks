import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["strings_any_to_string"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("ANY");
        this.setOutput(true, "String");
        this.setStyle("strings_blocks");
    },
};

Blockly.Blocks["strings_join_mutator_join"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("join");
        this.appendStatementInput("DO").setCheck("default");
        this.setStyle('strings_blocks');
        this.contextMenu = false;
    },
};
Blockly.Blocks["strings_join_mutator_string"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("string")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle('strings_blocks');
    },
};
Blockly.Blocks["strings_join_mutator_value"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("value")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle('strings_blocks');
    },
};
Blockly.Blocks["strings_join"] = { // like array block, has two inner blocks, one for string, another for var, compiles to `${var} my text${1+2}${7}`
    init: function () {
        this.setInputsInline(true); 
        this.appendDummyInput().appendField('join');
        this.setOutput(true, 'String');
        this.setStyle('strings_blocks');
        this.setMutator(new Blockly.icons.MutatorIcon(['strings_join_mutator_string', 'strings_join_mutator_value'], this));
        this.items_ = [];
        this.updateShape_();
    },

    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        (this.items_ || []).forEach(type => {
            var itemElement = Blockly.utils.xml.createElement(type);
            container.appendChild(itemElement);
        });
        return container;
    },

    domToMutation: function (xmlElement) {
        this.items_ = Array.from(xmlElement.querySelectorAll('*')).map(el => el.tagName.toLowerCase());
        this.updateShape_();
    },

    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('strings_join_mutator_join');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('DO').connection;

        return containerBlock;
    },

    compose: function (containerBlock) {
        this.updateShape_();
    },

    updateShape_: function () {
    },
};





BlocklyJS.javascriptGenerator.forBlock["strings_any_to_string"] = function (block, generator) {
    const ANY = generator.valueToCode(block, "ANY", BlocklyJS.Order.ATOMIC) || '';

    return [`String(${ANY})`, BlocklyJS.Order.ATOMIC];
};