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
Blockly.Blocks['arrays_array'] = {
    init: function () {
        this.itemCount_ = 1;
        this.nextId_ = 0;
        this.setInputsInline(true);
        this.appendDummyInput().appendField('array');
        this.setOutput(true, 'Array');
        this.setStyle('arrays_blocks');
        this.updateShape_([this.newItemId_()]);
        this.setMutator(new Blockly.icons.MutatorIcon(['arrays_array_mutator_item'], this));
    },

    newItemId_: function () {
        return 'ITEM' + (this.nextId_++);
    },

    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('nextid', this.nextId_);
        (this.itemIds_ || []).forEach((id, i) => {
            var item = Blockly.utils.xml.createElement('item');
            item.setAttribute('id', id);
            container.appendChild(item);
        });
        return container;
    },

    domToMutation: function (xmlElement) {
        this.nextId_ = parseInt(xmlElement.getAttribute('nextid') || '0', 10);
        var ids = Array.from(xmlElement.querySelectorAll('item'))
            .map(el => el.getAttribute('id'));
        if (ids.length === 0) ids = [this.newItemId_()];
        this.itemCount_ = ids.length;
        this.updateShape_(ids);
    },

    decompose: function (workspace) {
        var topBlock = workspace.newBlock('arrays_array_mutator_items');
        topBlock.initSvg();

        var connection = topBlock.getInput('DO').connection;
        for (var id of (this.itemIds_ || [])) {
            var itemBlock = workspace.newBlock('arrays_array_mutator_item');
            itemBlock.itemId_ = id;
            itemBlock.initSvg();
            connection.connect(itemBlock.previousConnection);
            connection = itemBlock.nextConnection;
        }

        return topBlock;
    },

    compose: function (topBlock) {
        var itemBlock = topBlock.getInputTargetBlock('DO');

        var ids = [];
        var connections = {};
        while (itemBlock && !itemBlock.isInsertionMarker()) {
            if (!itemBlock.itemId_) itemBlock.itemId_ = this.newItemId_();
            ids.push(itemBlock.itemId_);
            connections[itemBlock.itemId_] = itemBlock.savedConnection_ || null;
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }

        this.itemCount_ = ids.length;
        this.updateShape_(ids, connections);
    },

    saveConnections: function (topBlock) {
        var itemBlock = topBlock.getInputTargetBlock('DO');
        while (itemBlock && !itemBlock.isInsertionMarker()) {
            if (itemBlock.itemId_) {
                var input = this.getInput(itemBlock.itemId_);
                if (input) {
                    var target = input.connection.targetBlock();
                    if (target && !target.isShadow()) {
                        itemBlock.savedConnection_ = input.connection.targetConnection;
                    } else {
                        itemBlock.savedConnection_ = null;
                    }
                }
            }
            itemBlock = itemBlock.nextConnection &&
                itemBlock.nextConnection.targetBlock();
        }
    },

    updateShape_: function (ids, connections) {
        connections = connections || {};
        var existing = this.inputList
            .map(i => i.name)
            .filter(n => n && n.startsWith('ITEM'));

        for (var name of existing) {
            if (!ids.includes(name)) {
                var input = this.getInput(name);
                if (input && input.connection) {
                    var target = input.connection.targetBlock();
                    if (target && target.isShadow()) target.dispose();
                }
                this.removeInput(name, true);
            }
        }

        for (var i = 0; i < ids.length; i++) {
            var id = ids[i];
            if (!this.getInput(id)) {
                var input = this.appendValueInput(id).setCheck(null);
                var conn = connections[id];

                var shadow = this.workspace.newBlock('values_any');
                shadow.setShadow(true);
                shadow.initSvg();
                shadow.render();
                input.connection.connect(shadow.outputConnection);

                if (conn && conn.getSourceBlock && conn.getSourceBlock()) {
                    conn.reconnect(this, id);
                }
            }
            this.moveInputBefore(id, null);
        }

        for (var i = ids.length - 1; i >= 0; i--) {
            var after = i < ids.length - 1 ? ids[i + 1] : null;
            this.moveInputBefore(ids[i], after);
        }

        this.itemIds_ = ids;
    },
};

BlocklyJS.javascriptGenerator.forBlock["arrays_array"] = function (block, generator) {
    var items = (block.itemIds_ || []).map(function (id) {
        return generator.valueToCode(block, id, BlocklyJS.Order.NONE) || 'null';
    });
    return ['[' + items.join(', ') + ']', BlocklyJS.Order.ATOMIC];
};