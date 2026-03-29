import * as Blockly from "blockly";
import * as BlocklyJS from "blockly/javascript";

Blockly.Blocks["control_if_mutator_if"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("if")
        this.appendStatementInput("DO").setCheck("default");
        this.setStyle("control_blocks");
    },
};
Blockly.Blocks["control_if_mutator_else_if"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("else if")
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle("control_blocks");
    },
};
Blockly.Blocks["control_if_mutator_else"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("else")
        this.setPreviousStatement(true, "default");
        this.setStyle("control_blocks");
    },
};
Blockly.Blocks["control_if"] = {
    // TODO: replace "else count" with a boolean (why did i make it a count in the first place??)
    // TODO: shadow boolean checkbox
    // TODO: ok we are just gonna refactor this shit to be like the switch case atp
    init: function () {
        this.setStyle("control_blocks");
        this.appendValueInput("IF0")
            .setCheck("Boolean")
            .appendField("if");
        this.appendStatementInput("DO0")
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setMutator(new Blockly.icons.MutatorIcon(['control_if_mutator_else_if', 'control_if_mutator_else'], this));
        this.elseifCount_ = 0;
        this.elseCount_ = 0;
        this.updateShape_();
    },

    mutationToDom: function () {
        if (!this.elseifCount_ && !this.elseCount_) {
            return null;
        }
        var container = Blockly.utils.xml.createElement('mutation');
        if (this.elseifCount_) {
            container.setAttribute('elseif', this.elseifCount_);
        }
        if (this.elseCount_) {
            container.setAttribute('else', 1);
        }
        return container;
    },

    domToMutation: function (xmlElement) {
        this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
        this.elseCount_ = parseInt(xmlElement.getAttribute('else'), 10) || 0;
        this.updateShape_();
    },

    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('control_if_mutator_if');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('DO').connection;

        for (var i = 1; i <= this.elseifCount_; i++) {
            var elseifBlock = workspace.newBlock('control_if_mutator_else_if');
            elseifBlock.initSvg();
            connection.connect(elseifBlock.previousConnection);
            connection = elseifBlock.nextConnection;
        }

        if (this.elseCount_) {
            var elseBlock = workspace.newBlock('control_if_mutator_else');
            elseBlock.initSvg();
            connection.connect(elseBlock.previousConnection);
        }
        return containerBlock;
    },

    compose: function (containerBlock) {
        var clauseBlock = containerBlock.getInputTargetBlock('DO');
        this.elseifCount_ = 0;
        this.elseCount_ = 0;
        var valueConnections = [null];
        var statementConnections = [null];
        var elseStatementConnection = null;

        while (clauseBlock && !clauseBlock.isInsertionMarker()) {
            switch (clauseBlock.type) {
                case 'control_if_mutator_else_if':
                    this.elseifCount_++;
                    valueConnections.push(clauseBlock.valueConnection_);
                    statementConnections.push(clauseBlock.statementConnection_);
                    break;
                case 'control_if_mutator_else':
                    this.elseCount_++;
                    elseStatementConnection = clauseBlock.statementConnection_;
                    break;
                default:
                    throw TypeError('Unknown block type: ' + clauseBlock.type);
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
        this.updateShape_();
        this.reconnectChildBlocks_(valueConnections, statementConnections, elseStatementConnection);
    },

    saveConnections: function (containerBlock) {
        var clauseBlock = containerBlock.getInputTargetBlock('DO');
        var i = 1;
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'control_if_mutator_else_if':
                    var inputIf = this.getInput('IF' + i);
                    var inputDo = this.getInput('DO' + i);
                    clauseBlock.valueConnection_ = inputIf && inputIf.connection.targetConnection;
                    clauseBlock.statementConnection_ = inputDo && inputDo.connection.targetConnection;
                    i++;
                    break;
                case 'control_if_mutator_else':
                    var inputElse = this.getInput('ELSE');
                    clauseBlock.statementConnection_ = inputElse && inputElse.connection.targetConnection;
                    break;
                default:
                    throw TypeError('Unknown block type: ' + clauseBlock.type);
            }
            clauseBlock = clauseBlock.nextConnection &&
                clauseBlock.nextConnection.targetBlock();
        }
    },

    updateShape_: function () {
        if (this.getInput('ELSE')) {
            this.removeInput('ELSE');
            this.removeInput('ELSE_LABEL');
        }
        var i = 1;
        while (this.getInput('IF' + i)) {
            this.removeInput('IF' + i);
            this.removeInput('DO' + i);
            i++;
        }
        for (i = 1; i <= this.elseifCount_; i++) {
            this.appendValueInput('IF' + i)
                .setCheck('Boolean')
                .appendField('else if');
            this.appendStatementInput('DO' + i)
        }
        if (this.elseCount_) {
            this.appendDummyInput("ELSE_LABEL").appendField('else');
            this.appendStatementInput('ELSE');
        }
    },

    reconnectChildBlocks_: function (valueConnections, statementConnections, elseStatementConnection) {
        for (var i = 1; i <= this.elseifCount_; i++) {
            if (valueConnections[i]) {
                this.getInput('IF' + i).connection.connect(valueConnections[i]);
            }
            if (statementConnections[i]) {
                this.getInput('DO' + i).connection.connect(statementConnections[i]);
            }
        }
        if (elseStatementConnection) {
            this.getInput('ELSE').connection.connect(elseStatementConnection);
        }
    }
};

Blockly.Blocks["control_switch_mutator_switch"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("switch")
        this.appendStatementInput("DO").setCheck("default");
        this.setStyle("control_blocks");
    },
};
Blockly.Blocks["control_switch_mutator_case"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("case");
        this.appendDummyInput().appendField("empty?:").appendField(new Blockly.FieldCheckbox("FALSE"), "EMPTY");
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle("control_blocks");
    },
};
Blockly.Blocks["control_switch_mutator_default"] = {
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("default");
        this.setPreviousStatement(true, "default");
        this.setStyle("control_blocks");
    },
};
Blockly.Blocks["control_switch"] = {
    init: function () {
        this.setInputsInline(false);
        this.setStyle("control_blocks");
        this.appendValueInput("ANY")
            .appendField("switch");
        this.setPreviousStatement(true);
        this.setNextStatement(true);
        this.setMutator(new Blockly.icons.MutatorIcon(['control_switch_mutator_case', 'control_switch_mutator_default'], this));
        this.cases_ = [];
        this.default_ = false;
        this.updateShape_();
    },
    
    mutationToDom: function () {
        var container = Blockly.utils.xml.createElement('mutation');
        (this.cases_ || []).forEach(empty => {
            var caseElement = Blockly.utils.xml.createElement('case');
            caseElement.setAttribute('empty', empty ? 'TRUE' : 'FALSE');
            container.appendChild(caseElement);
        });
        container.setAttribute('default', this.default_ ? 'TRUE' : 'FALSE');
        return container;
    },

    domToMutation: function (xmlElement) {
        this.default_ = xmlElement.getAttribute('default') === 'TRUE'
        this.cases_ = Array.from(xmlElement.querySelectorAll('case'))
            .map(el => el.getAttribute('empty')  === 'TRUE');
        this.updateShape_();
    },

    decompose: function (workspace) {
        var containerBlock = workspace.newBlock('control_switch_mutator_switch');
        containerBlock.initSvg();
        var connection = containerBlock.getInput('DO').connection;

        (this.cases_ || []).forEach(empty => {
            var caseBlock = workspace.newBlock('control_switch_mutator_case');
            caseBlock.getField("EMPTY")?.setValue(empty ? 'TRUE' : 'FALSE')
            caseBlock.initSvg();
            connection.connect(caseBlock.previousConnection);
            connection = caseBlock.nextConnection;
        });

        if (this.default_) {
            var defaultBlock = workspace.newBlock('control_switch_mutator_default');
            defaultBlock.initSvg();
            connection.connect(defaultBlock.previousConnection);
        }
        return containerBlock;
    },

    compose: function (containerBlock) {
        var clauseBlock = containerBlock.getInputTargetBlock('DO');
        this.caseCount_ = 0;
        this.defaultCount_ = 0;
        
        var valueConnections = [];
        var statementConnections = [];
        var shadowValues = [];
        var defaultStatementConnection = null;

        this.cases_ = [];
        this.default_ = false;
        
        while (clauseBlock && !clauseBlock.isInsertionMarker()) {
            switch (clauseBlock.type) {
                case 'control_switch_mutator_case':
                    this.cases_.push(clauseBlock.getFieldValue("EMPTY") === 'TRUE');
                    valueConnections.push(clauseBlock.valueConnection_);
                    statementConnections.push(clauseBlock.statementConnection_);
                    
                    shadowValues.push(clauseBlock.savedShadowValue_ !== undefined ? clauseBlock.savedShadowValue_ : null);
                    break;
                case 'control_switch_mutator_default':
                    this.default_ = true;
                    defaultStatementConnection = clauseBlock.statementConnection_;
                    break;
            }
            clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
        }
        
        this.updateShape_();
        
        this.reconnectChildBlocks_(valueConnections, statementConnections, defaultStatementConnection, shadowValues);
    },

    saveConnections: function (containerBlock) {
        var clauseBlock = containerBlock.getInputTargetBlock('DO');
        var i = 0;
        
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'control_switch_mutator_case':
                    var inputCase = this.getInput('CASE' + i);
                    var inputDo = this.getInput('DO' + i);
                    
                    if (inputCase) {
                        clauseBlock.valueConnection_ = inputCase.connection.targetConnection;

                        var shadowState = inputCase.connection.getShadowState(true);
                        clauseBlock.savedShadowValue_ = shadowState?.fields?.ANY || "";
                    }

                    if (inputDo) {
                        clauseBlock.statementConnection_ = inputDo && inputDo.connection.targetConnection;
                    }

                    i++;
                    break;
                case 'control_switch_mutator_default':
                    var inputDefault = this.getInput('DEFAULT');
                    clauseBlock.statementConnection_ = inputDefault && inputDefault.connection.targetConnection;
                    break;
            }
            clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
        }
    },

    updateShape_: function () {
        this.removeInput('DEFAULT_BREAK', true);
        this.removeInput('DEFAULT_LABEL', true);
        this.removeInput('DEFAULT', true);
        var i = 0;
        while (this.getInput('CASE' + i)) {
            this.removeInput('BREAK' + i, true);
            this.removeInput('CASE' + i, true);
            this.removeInput('DO' + i, true);
            i++;
        }

        var i = 0;
        (this.cases_ || []).forEach(empty => {
            var valInput = this.appendValueInput('CASE' + i).appendField('case');
            var shadowDom = Blockly.utils.xml.textToDom(
                `<shadow type="values_any"></shadow>`
            );
            valInput.connection.setShadowDom(shadowDom);
            if (!empty) {
                const doInput = this.appendStatementInput('DO' + i)
                var doShadowDom = Blockly.utils.xml.textToDom(
                    `<shadow type="control_break"></shadow>`
                );
                doInput.connection.setShadowDom(doShadowDom);
            }
            i++;
        });

        if (this.default_) {
            this.appendDummyInput('DEFAULT_LABEL').appendField('default');
            this.appendStatementInput('DEFAULT');
        }
    },

    reconnectChildBlocks_: function (valueConnections, statementConnections, defaultStatementConnection, shadowValues) {
        for (var i = 0; i < this.cases_.length; i++) {
            var caseInput = this.getInput('CASE' + i);
            var doInput = this.getInput('DO' + i);

            if (caseInput) {
                var valueConnection = valueConnections[i];
                if (valueConnection &&
                valueConnection.getSourceBlock() &&
                !valueConnection.getSourceBlock().isShadow() &&
                !valueConnection.isConnected()) {
                    caseInput.connection.connect(valueConnection);
                } 
                if (shadowValues && shadowValues[i] !== null) {
                    var shadowDom = Blockly.utils.xml.textToDom(
                        `<shadow type="values_any"><field name="ANY">${shadowValues[i]}</field></shadow>`
                    );
                    caseInput.connection.setShadowDom(shadowDom);
                }
            }
            
            if (doInput && statementConnections[i]) {
                if (statementConnections[i].getSourceBlock() &&
                !statementConnections[i].getSourceBlock().disposed &&
                !statementConnections[i].isConnected()) {
                    doInput.connection.connect(statementConnections[i]);
                }
            }
        }
        
        if (defaultStatementConnection && this.getInput('DEFAULT')) {
            this.getInput('DEFAULT')?.connection.connect(defaultStatementConnection);
        }
    }
};

Blockly.Blocks["control_break"] = { // TODO: custom connection stuff or whatever to prevent break going where it shouldn't
    init: function () {
        this.setInputsInline(true);
        this.appendDummyInput().appendField("break").appendField(
            new Blockly.FieldImage(
                "/icons/arrow-down.svg",
                18,
                25,
                "breaks",
            ),
        ).setAlign(Blockly.inputs.Align.RIGHT)
        this.setPreviousStatement(true, "default");
        this.setStyle("control_blocks");
    },
};



BlocklyJS.javascriptGenerator.forBlock['control_if'] = function(block, generator) {
    let n = 0;
    let code = '';
    
    const condition0 = generator.valueToCode(block, 'IF0', BlocklyJS.Order.ATOMIC) || 'false';
    const branch0 = generator.statementToCode(block, 'DO0');
    code += `if (${condition0}) {\n${branch0}}`;

    for (n = 1; n <= block.elseifCount_; n++) {
        const condition = generator.valueToCode(block, 'IF' + n, BlocklyJS.Order.ATOMIC) || 'false';
        const branch = generator.statementToCode(block, 'DO' + n);
        code += ` else if (${condition}) {\n${branch}}`;
    }

    if (block.elseCount_) {
        const branch = generator.statementToCode(block, 'ELSE');
        code += ` else {\n${branch}}`;
    }

    return code + '\n';
};

BlocklyJS.javascriptGenerator.forBlock['control_switch'] = function(block, generator) {
    // im not even gonna bother yet

    return '\n';
};

BlocklyJS.javascriptGenerator.forBlock['control_break'] = function(block, generator) {
    return 'break;\n';
};