import * as Blockly from "blockly";


class CustomConstantProvider extends Blockly.zelos.ConstantProvider {
    init() {
        super.init();
    }
}

class CustomPathObject extends Blockly.zelos.PathObject {
    applyColour(block) {
        super.applyColour(block);
        if (block.isShadow() && block.canDuplicateOnDrag?.()) {
            this.svgPath.setAttribute("fill", block.style.colourPrimary);
            this.svgPath.setAttribute("stroke", block.style.colourTertiary);
        }
    }
}

export default class CustomRenderer extends Blockly.zelos.Renderer {
    constructor() {
        super();
    }
    
    makeConstants_() {
        return new CustomConstantProvider();
    }

    makePathObject(root, style) {
        return new CustomPathObject(root, style, this.getConstants());
    }
}