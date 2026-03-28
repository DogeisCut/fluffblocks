/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {registerContinuousToolbox} from '@blockly/continuous-toolbox';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from './serialization.js';
import toolbox from './toolbox.js';
import CustomRenderer from "./render.js";
import theme from './theme.js'
import './index.css';

// i dont even want to think about the default blocks
Object.keys(Blockly.Blocks).forEach(key => delete Blockly.Blocks[key]);
Object.keys(javascriptGenerator.forBlock).forEach(key => delete javascriptGenerator.forBlock[key]);

const context = require.context('./blocks', false, /\.js$/);
context.keys().forEach(context);

window.Blockly = Blockly

const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');

Blockly.blockRendering.register("custom_zelos", CustomRenderer);

const toolboxElement = document.createElement("toolbox");
toolboxElement.innerHTML = toolbox;
registerContinuousToolbox();
const ws = Blockly.inject(blocklyDiv, {
	toolbox: toolboxElement,
	collapse: true,
	comments: true,
	css: true,
	disable: true,
	grid: {
		spacing: 20,
		length: 1,
		colour: '#ccc',
		snap: false,
	},
	horizontalLayout: false,
	maxBlocks: Infinity,
	maxTrashcanContents: 0,
	media: 'https://blockly-demo.appspot.com/static/media/',
	modalInputs: true,
	move: {
        scrollbars: {
			horizontal: true,
			vertical: true
        },
        drag: true,
        wheel: true
	},
	oneBasedIndex: false,
	plugins: {
		flyoutsVerticalToolbox: 'ContinuousFlyout',
		metricsManager: 'ContinuousMetrics',
		toolbox: 'ContinuousToolbox',
	},
	readOnly: false,
	renderer: 'custom_zelos',
	rtl: false,
	scrollbars: true,
	sounds: true,
	theme: theme,
	toolboxPosition: 'start',
	trashcan: false,
	zoom: {
		controls: true,
		wheel: true,
		startScale: 0.9,
		maxScale: 3,
		minScale: 0.3,
		scaleSpeed: 1.2,
		pinch: true
	},
});

ws.registerToolboxCategoryCallback("VARIABLES", function (_) {
  const xmlList = [];
  return xmlList;
});

ws.registerToolboxCategoryCallback("FUNCTIONS", function (_) {
  const xmlList = [];
  return xmlList;
});

// will replace this with stuff to interface with the vm later
const compile = () => {
    javascriptGenerator.init(ws);
    const code = [];

    for (const block of ws.getTopBlocks(true)) {
        if (block.previousConnection || block.outputConnection) continue;

        let line = javascriptGenerator.blockToCode(block);
        if (Array.isArray(line)) line = line[0];
        if (line) code.push(line);
    }

    let codeString = code.join('\n');
    codeString = javascriptGenerator.finish(codeString);
    codeString = codeString.replace(/^\s+\n/, '');
    codeString = codeString.replace(/\n\s+$/, '\n');
    codeString = codeString.replace(/[ \t]+\n/g, '\n');

    codeDiv.innerText = codeString;
    outputDiv.innerHTML = '';
};
ws.addChangeListener((e) => {
	if (
		e.isUiEvent ||
		e.type == Blockly.Events.FINISHED_LOADING ||
		ws.isDragging()
	) {
		return;
	}
	compile();
});
