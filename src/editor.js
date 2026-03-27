/**
 * @license
 * Copyright 2023 Google LLC
 * SPDX-License-Identifier: Apache-2.0
 */

import * as Blockly from 'blockly';
import {javascriptGenerator} from 'blockly/javascript';
import {save, load} from './serialization.js';
import toolbox from './toolbox.js';
import CustomRenderer from "./render.js";
import theme from './theme.js'
import './index.css';

import './blocks/events.js'
import './blocks/transforms.js'

// Set up UI elements and inject Blockly
const codeDiv = document.getElementById('generatedCode').firstChild;
const outputDiv = document.getElementById('output');
const blocklyDiv = document.getElementById('blocklyDiv');

Blockly.blockRendering.register("custom_zelos", CustomRenderer);

const toolboxElement = document.createElement("toolbox");
toolboxElement.innerHTML = toolbox;
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
	plugins: {},
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

// This function resets the code and output divs, shows the
// generated code from the workspace, and evals the code.
// In a real application, you probably shouldn't use `eval`.
const runCode = () => {
	const code = javascriptGenerator.workspaceToCode(ws);
	codeDiv.innerText = code;

	outputDiv.innerHTML = '';

	//eval(code);
};

// Load the initial state from storage and run the code.
load(ws);
runCode();

// Every time the workspace changes state, save the changes to storage.
ws.addChangeListener((e) => {
	// UI events are things like scrolling, zooming, etc.
	// No need to save after one of these.
	if (e.isUiEvent) return;
	save(ws);
});

// Whenever the workspace changes meaningfully, run the code again.
ws.addChangeListener((e) => {
	// Don't run the code when the workspace finishes loading; we're
	// already running it once when the application starts.
	// Don't run the code during drags; we might have invalid state.
	if (
		e.isUiEvent ||
		e.type == Blockly.Events.FINISHED_LOADING ||
		ws.isDragging()
	) {
		return;
	}
	runCode();
});
