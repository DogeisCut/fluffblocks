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
        this.else_ = false;
        this.updateShape_();
    },

    mutationToDom: function () {
        const container = Blockly.utils.xml.createElement('mutation');
        container.setAttribute('elseif', this.elseifCount_);
        container.setAttribute('else', this.else_ ? 'TRUE' : 'FALSE');
        return container;
    },

    domToMutation: function (xmlElement) {
        this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'), 10) || 0;
        this.else_ = xmlElement.getAttribute('else') === 'TRUE'
        this.updateShape_();
    },

    decompose: function (workspace) {
        const containerBlock = workspace.newBlock('control_if_mutator_if');
        containerBlock.initSvg();
        let connection = containerBlock.getInput('DO').connection;

        for (let i = 1; i <= this.elseifCount_; i++) {
            const elseifBlock = workspace.newBlock('control_if_mutator_else_if');
            elseifBlock.initSvg();
            connection.connect(elseifBlock.previousConnection);
            connection = elseifBlock.nextConnection;
        }

        if (this.else_) {
            const elseBlock = workspace.newBlock('control_if_mutator_else');
            elseBlock.initSvg();
            connection.connect(elseBlock.previousConnection);
        }
        return containerBlock;
    },

    compose: function (containerBlock) {
        let clauseBlock = containerBlock.getInputTargetBlock('DO');

        const valueConnections = [];
        const statementConnections = [];
        const shadowValues = [];
        let elseStatementConnection = null;

        this.elseifCount_ = 0;
        this.else_ = false;

        while (clauseBlock && !clauseBlock.isInsertionMarker()) {
            switch (clauseBlock.type) {
                case 'control_if_mutator_else_if':
                    this.elseifCount_++;
                    valueConnections.push(clauseBlock.valueConnection_);
                    statementConnections.push(clauseBlock.statementConnection_);

                    shadowValues.push(clauseBlock.savedShadowValue_ !== undefined ? clauseBlock.savedShadowValue_ : null);
                    break;
                case 'control_if_mutator_else':
                    this.else_ = true;
                    elseStatementConnection = clauseBlock.statementConnection_;
                    break;
                default:
                    throw TypeError('Unknown block type: ' + clauseBlock.type);
            }
            clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
        }

        this.updateShape_();

        this.reconnectChildBlocks_(valueConnections, statementConnections, elseStatementConnection, shadowValues);
    },

    saveConnections: function (containerBlock) {
        let clauseBlock = containerBlock.getInputTargetBlock('DO');
        let i = 1;

        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'control_if_mutator_else_if':
                    const inputIf = this.getInput('IF' + i);
                    const inputDo = this.getInput('DO' + i);

                    if (inputIf) {
                        clauseBlock.valueConnection_ = inputIf.connection.targetConnection;

                        const shadowState = inputIf.connection.getShadowState(true);
                        clauseBlock.savedShadowValue_ = shadowState?.fields?.BOOLEAN; // no idea why the checkbox field is evil and returns an actual bool here
                    }

                    if (inputDo) {
                        clauseBlock.statementConnection_ = inputDo.connection.targetConnection;
                    }

                    i++;
                    break;
                case 'control_if_mutator_else':
                    const inputElse = this.getInput('ELSE');
                    clauseBlock.statementConnection_ = inputElse && inputElse.connection.targetConnection;
                    break;
                default:
                    throw TypeError('Unknown block type: ' + clauseBlock.type);
            }
            clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
        }
    },

    updateShape_: function () {
        this.removeInput('ELSE', true);
        this.removeInput('ELSE_LABEL', true);
        let i = 1;
        while (this.getInput('IF' + i)) {
            this.removeInput('IF' + i);
            this.removeInput('DO' + i);
            i++;
        }

        for (i = 1; i <= this.elseifCount_; i++) {
            const valInput = this.appendValueInput('IF' + i)
                .setCheck('Boolean')
                .appendField('else if');
            const shadow = this.workspace.newBlock('values_boolean')
            shadow.setShadow(true)
            shadow.initSvg();
            valInput.connection.connect(shadow.outputConnection);
            this.appendStatementInput('DO' + i)
        }
        if (this.else_) {
            this.appendDummyInput("ELSE_LABEL").appendField('else');
            this.appendStatementInput('ELSE');
        }
    },

    reconnectChildBlocks_: function (valueConnections, statementConnections, elseStatementConnection, shadowValues) {
        for (let i = 1; i <= this.elseifCount_; i++) {
            const ifInput = this.getInput('IF' + i);
            const doInput = this.getInput('DO' + i);

            if (ifInput) {
                const valueConnection = valueConnections[i - 1];
                if (shadowValues && shadowValues[i - 1] !== null) {
                    const shadow = this.workspace.newBlock('values_boolean')
                    shadow.setFieldValue(shadowValues[i - 1] ? 'TRUE' : 'FALSE', 'BOOLEAN')
                    shadow.setShadow(true)
                    shadow.initSvg();
                    ifInput.connection.connect(shadow.outputConnection);
                }
                if (valueConnection &&
                valueConnection.getSourceBlock() &&
                !valueConnection.getSourceBlock().isShadow() &&
                !valueConnection.getSourceBlock().disposed &&
                !valueConnection.isConnected()) {
                    ifInput.connection.connect(valueConnection);
                } 
            }

            if (doInput) {
                const statementConnection = statementConnections[i-1]
                if (statementConnection &&
                statementConnection.getSourceBlock() &&
                !statementConnection.getSourceBlock().disposed &&
                !statementConnection.getSourceBlock().isShadow() &&
                !statementConnection.isConnected()) {
                    doInput.connection.connect(statementConnection);
                }
            }
        }

        if (this.getInput('ELSE')) {
            if (elseStatementConnection &&
            elseStatementConnection.getSourceBlock() &&
            !elseStatementConnection.getSourceBlock().disposed &&
            !elseStatementConnection.getSourceBlock().isShadow() &&
            !elseStatementConnection.isConnected()) {
                this.getInput('ELSE').connection.connect(elseStatementConnection);
            }
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
        this.appendDummyInput("EMPTY_ROW")
            .appendField("empty?:")
            .appendField(new Blockly.FieldCheckbox('FALSE'), "EMPTY");
        this.setPreviousStatement(true, "default");
        this.setNextStatement(true, "default");
        this.setStyle("control_blocks");
    },

    onchange: function (event) {
        const nextBlock = this.nextConnection && this.nextConnection.targetBlock();
        const hasBlockBelow = nextBlock && !nextBlock.isInsertionMarker();

        const prevBlock = this.previousConnection && this.previousConnection.targetBlock();
        const hasBlockAbove = prevBlock && !prevBlock.isInsertionMarker();

        const isLastInStack = hasBlockAbove && !hasBlockBelow;

        const emptyInput = this.getInput("EMPTY_ROW");

        if (emptyInput) {
            if (emptyInput.isVisible() === isLastInStack) {
                emptyInput.setVisible(!isLastInStack);
                
                if (isLastInStack) {
                    this.setFieldValue('FALSE', 'EMPTY');
                }

                this.queueRender();
            }
        }
    }
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
        const container = Blockly.utils.xml.createElement('mutation');
        (this.cases_ || []).forEach(empty => {
            const caseElement = Blockly.utils.xml.createElement('case');
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
        const containerBlock = workspace.newBlock('control_switch_mutator_switch');
        containerBlock.initSvg();
        let connection = containerBlock.getInput('DO').connection;

        (this.cases_ || []).forEach(empty => {
            const caseBlock = workspace.newBlock('control_switch_mutator_case');
            caseBlock.getField("EMPTY")?.setValue(empty ? 'TRUE' : 'FALSE')
            caseBlock.initSvg();
            connection.connect(caseBlock.previousConnection);
            connection = caseBlock.nextConnection;
        });

        if (this.default_) {
            const defaultBlock = workspace.newBlock('control_switch_mutator_default');
            defaultBlock.initSvg();
            connection.connect(defaultBlock.previousConnection);
        }
        return containerBlock;
    },

    compose: function (containerBlock) {
        let clauseBlock = containerBlock.getInputTargetBlock('DO');

        const valueConnections = [];
        const statementConnections = [];
        const shadowValues = [];
        let defaultStatementConnection = null;

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
                default:
                    throw TypeError('Unknown block type: ' + clauseBlock.type);
            }
            clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
        }
        
        this.updateShape_();
        
        this.reconnectChildBlocks_(valueConnections, statementConnections, defaultStatementConnection, shadowValues);
    },

    saveConnections: function (containerBlock) {
        let clauseBlock = containerBlock.getInputTargetBlock('DO');
        let i = 0;
        
        while (clauseBlock) {
            switch (clauseBlock.type) {
                case 'control_switch_mutator_case':
                    const inputCase = this.getInput('CASE' + i);
                    const inputDo = this.getInput('DO' + i);
                    
                    if (inputCase) {
                        clauseBlock.valueConnection_ = inputCase.connection.targetConnection;

                        const shadowState = inputCase.connection.getShadowState(true);
                        clauseBlock.savedShadowValue_ = shadowState?.fields?.ANY || "";
                    }

                    if (inputDo) {
                        clauseBlock.statementConnection_ = inputDo.connection.targetConnection;
                    }

                    i++;
                    break;
                case 'control_switch_mutator_default':
                    const inputDefault = this.getInput('DEFAULT');
                    clauseBlock.statementConnection_ = inputDefault && inputDefault.connection.targetConnection;
                    break;
                default:
                    throw TypeError('Unknown block type: ' + clauseBlock.type);
            }
            clauseBlock = clauseBlock.nextConnection && clauseBlock.nextConnection.targetBlock();
        }
    },

    updateShape_: function () {
        this.removeInput('DEFAULT_BREAK', true);
        this.removeInput('DEFAULT_LABEL', true);
        this.removeInput('DEFAULT', true);
        let i = 0;
        while (this.getInput('CASE' + i)) {
            this.removeInput('BREAK' + i, true);
            this.removeInput('CASE' + i, true);
            this.removeInput('DO' + i, true);
            i++;
        }

        i = 0;
        (this.cases_ || []).forEach(empty => {
            const caseInput = this.appendValueInput('CASE' + i).appendField('case');

            const caseShadow = this.workspace.newBlock('values_boolean')
            caseShadow.setShadow(true)
            caseShadow.initSvg();
            caseInput.connection.connect(caseShadow.outputConnection);

            if (!empty) {
                const doInput = this.appendStatementInput('DO' + i)

                const doShadow = this.workspace.newBlock('control_break')
                doShadow.setShadow(true)
                doShadow.initSvg();
                doInput.connection.connect(doShadow.previousConnection);
            }
            i++;
        });

        if (this.default_) {
            this.appendDummyInput('DEFAULT_LABEL').appendField('default');
            const defaultInput = this.appendStatementInput('DEFAULT');

            const defaultShadow = this.workspace.newBlock('control_break')
            defaultShadow.setShadow(true)
            defaultShadow.initSvg();
            defaultInput.connection.connect(defaultShadow.previousConnection);
        }
    },

    reconnectChildBlocks_: function (valueConnections, statementConnections, defaultStatementConnection, shadowValues) {
        for (let i = 0; i < this.cases_.length; i++) {
            const caseInput = this.getInput('CASE' + i);
            const doInput = this.getInput('DO' + i);

            if (caseInput) {
                const valueConnection = valueConnections[i];
                if (valueConnection &&
                valueConnection.getSourceBlock() &&
                !valueConnection.getSourceBlock().disposed &&
                !valueConnection.getSourceBlock().isShadow() &&
                !valueConnection.isConnected()) {
                    caseInput.connection.connect(valueConnection);
                } 
                if (shadowValues && shadowValues[i] !== null) {
                    const caseShadow = this.workspace.newBlock('values_boolean')
                    caseShadow.setFieldValue(shadowValues[i], 'ANY')
                    caseShadow.setShadow(true)
                    caseShadow.initSvg();
                    caseInput.connection.connect(caseShadow.outputConnection);
                }
            }
            
            if (doInput) {
                const statementConnection = statementConnections[i]
                if (statementConnection &&
                statementConnection.getSourceBlock() &&
                !statementConnection.getSourceBlock().disposed &&
                !statementConnection.getSourceBlock().isShadow() &&
                !statementConnection.isConnected()) {
                    doInput.connection.connect(statementConnection);
                }
            }
        }

        if (this.getInput('DEFAULT')) {
            if (defaultStatementConnection &&
            defaultStatementConnection.getSourceBlock() &&
            !defaultStatementConnection.getSourceBlock().disposed &&
            !defaultStatementConnection.getSourceBlock().isShadow() &&
            !defaultStatementConnection.isConnected()) {
                this.getInput('DEFAULT').connection.connect(defaultStatementConnection);
            }
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