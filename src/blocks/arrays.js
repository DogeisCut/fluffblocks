import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["arrays_array_mutator_items"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("items");
        this.appendStatementInput("DO").setCheck("default");
        this.setStyle("arrays_blocks");
        this.contextMenu = false;
    },
}
Blockly.Blocks["arrays_array_mutator_item"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("item");
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle("arrays_blocks");
        this.itemId_ = null;
        this.savedConnection_ = null;
        this.savedValue_ = null;
    },
}
Blockly.Blocks['arrays_create_array'] = {
    init: function () {
        this.setInputsInline(true); 
        this.appendDummyInput().appendField('create array');
        this.setOutput(true, 'Array');
        this.setStyle('arrays_blocks');
        this.setMutator(new Blockly.icons.MutatorIcon(['arrays_array_mutator_item'], this));
        this.itemCount_ = 0;
        this.updateShape_();
    },

    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('items', this.itemCount_);
        return container;
    },

    domToMutation: function (xmlElement) {
        this.itemCount_ = parseInt(xmlElement.getAttribute('items') || '0', 10);
        this.updateShape_();
    },

    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('arrays_array_mutator_items');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('DO').connection;

        for (var i = 0; i < this.itemCount_; i++) {
            var itemBlock = workspace.newBlock('arrays_array_mutator_item');
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }
        return containerBlock;
    },

    compose: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('DO');
        var connections = [];
        var shadowValues = [];

        while (itemBlock && !itemBlock.isInsertionMarker()) {
            connections.push(itemBlock.valueConnection_);
            shadowValues.push(itemBlock.savedShadowValue_ || null);
            itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
        }

        this.itemCount_ = connections.length;
        this.updateShape_();
        this.reconnectChildBlocks_(connections, shadowValues);
    },

    saveConnections: function (containerBlock) {
        var itemBlock = containerBlock.getInputTargetBlock('DO');
        var i = 0;
        while (itemBlock) {
            var input = this.getInput('ADD' + i);
            if (input) {
                itemBlock.valueConnection_ = input.connection.targetConnection;
                
                var shadowState = input.connection.getShadowState(true);
                itemBlock.savedShadowValue_ = shadowState?.fields?.ANY || null;
            }
            itemBlock = itemBlock.nextConnection && itemBlock.nextConnection.targetBlock();
            i++;
        }
    },

    updateShape_: function () {
        var i = 0;
        while (this.getInput('ADD' + i)) {
            this.removeInput('ADD' + i);
            i++;
        }

        for (var i = 0; i < this.itemCount_; i++) {
            var input = this.appendValueInput('ADD' + i);
            // if (i === 0) { // not sure i like the way this looks
            //     input.appendField('with');
            // }
            
            var shadowDom = Blockly.utils.xml.textToDom(
                '<shadow type="values_any"></shadow>'
            );
            input.connection.setShadowDom(shadowDom);
        }
    },

    reconnectChildBlocks_: function (connections, shadowValues) {
        for (var i = 0; i < this.itemCount_; i++) {
            var input = this.getInput('ADD' + i);
            if (!input) continue;

            var connection = connections[i];
            if (connection && connection.getSourceBlock() && !connection.getSourceBlock().disposed) {
                input.connection.connect(connection);
            }

            if (shadowValues[i] !== null) {
                var shadowDom = Blockly.utils.xml.textToDom(
                    `<shadow type="values_any"><field name="ANY">${shadowValues[i]}</field></shadow>`
                );
                input.connection.setShadowDom(shadowDom);
            }
        }
    }
};

Blockly.Blocks['arrays_array_builder'] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField('array builder');
        this.appendStatementInput("DO").setCheck("default");
        this.setOutput(true, 'Array');
        this.setStyle('arrays_blocks');
    },
};

Blockly.Blocks["arrays_append_value_to_builder"] = { // todo: warning when not in array builder, or just like.. some custom connection checker that only allows the append block if within an array builder
    init: function () {
        this.setInputsInline(true);
        this.appendValueInput("ANY").appendField("append")
        this.appendDummyInput().appendField("to builder")
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setStyle("arrays_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock["arrays_array"] = function (block, generator) {
    var items = [];
    
    for (var i = 0; i < block.itemCount_; i++) {
        var valueCode = generator.valueToCode(block, 'ADD' + i, BlocklyJS.Order.NONE) || 'null';
        items.push(valueCode);
    }

    var code = '[' + items.join(', ') + ']';
    return [code, BlocklyJS.Order.ATOMIC];
};