import * as Blockly from "blockly";
const svgPaths = Blockly.utils.svgPaths;

class CustomConstantProvider extends Blockly.zelos.ConstantProvider {
    init() {
        super.init();
        this.BUMPED = this.makeBumped(); // String
        this.SPIKE_BUMPED = this.makeSpikeBumped(); // Number
        this.ARROW = this.makeArrow(); // Vector
        this.SCRAPPED = this.makeBowl(); // Matrix
        this.BRACKET = this.makeBowl(); // Tables
        this.BOWL = this.makeBowl(); // Arrays
        this.OCTAGONAL = this.makeBowl(); // Sprite
        this.DECAGONAL = this.makeBowl(); // Color
    }

    makeBumped() {
        const maxW = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
        const maxH = maxW * 2;

        function makeMainPath(blockHeight, up, right) {
            const remainingHeight = blockHeight > maxH ? blockHeight - maxH : 0;
            const height = blockHeight > maxH ? maxH : blockHeight;
            const radius = height / 4;
            const sweep = right === up ? "0" : "1";
            return (
                svgPaths.arc(
                    "a",
                    "0 0," + sweep,
                    radius,
                    svgPaths.point((right ? 1 : -1) * radius, (up ? -1 : 1) * radius),
                ) +
                svgPaths.arc(
                    "a",
                    "0 0," + sweep,
                    radius,
                    svgPaths.point((right ? -1 : 1) * radius, (up ? -1 : 1) * radius),
                ) +
                svgPaths.lineOnAxis("v", (up ? -1 : 1) * remainingHeight) +
                svgPaths.arc(
                    "a",
                    "0 0," + sweep,
                    radius,
                    svgPaths.point((right ? 1 : -1) * radius, (up ? -1 : 1) * radius),
                ) +
                svgPaths.arc(
                    "a",
                    "0 0," + sweep,
                    radius,
                    svgPaths.point((right ? -1 : 1) * radius, (up ? -1 : 1) * radius),
                )
            );
        }

        return {
            type: this.SHAPES.ROUND,
            isDynamic: true,
            width(height) {
                const half = height / 4;
                return half > maxW ? maxW : half;
            },
            height(height) {
                return height;
            },
            connectionOffsetY(height) {
                return height / 2;
            },
            connectionOffsetX(width) {
                return -width;
            },
            pathDown(height) {
                return makeMainPath(height, false, false);
            },
            pathUp(height) {
                return makeMainPath(height, true, false);
            },
            pathRightDown(height) {
                return makeMainPath(height, false, true);
            },
            pathRightUp(height) {
                return makeMainPath(height, false, true);
            },
        };
    }

    makeSpikeBumped() {
        const maxW = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
        const maxH = maxW * 2;

        function makeMainPath(blockHeight, up, right) {
            const dirR = right ? 1 : -1;
            const dirU = up ? -1 : 1;

            const remainingHeight = blockHeight > maxH ? blockHeight - maxH : 0;
            const height = blockHeight > maxH ? maxH : blockHeight;
            const totalHeight = height + remainingHeight;
            const radius = (height / 4) * dirR;

            return `
                h ${radius / 2}
                l ${radius} ${totalHeight/4*dirU}
                l ${-radius} ${totalHeight/4*dirU}
                l ${radius} ${totalHeight/4*dirU}
                l ${-radius} ${totalHeight/4*dirU}
                h ${-radius / 2}
            `;
        }

        return {
            type: this.SHAPES.ROUND,
            isDynamic: true,
            width(height) {
                const half = height / 4;
                return half > maxW ? maxW : half;
            },
            height(height) {
                return height;
            },
            connectionOffsetY(height) {
                return height / 2;
            },
            connectionOffsetX(width) {
                return -width;
            },
            pathDown(height) {
                return makeMainPath(height, false, false);
            },
            pathUp(height) {
                return makeMainPath(height, true, false);
            },
            pathRightDown(height) {
                return makeMainPath(height, false, true);
            },
            pathRightUp(height) {
                return makeMainPath(height, false, true);
            },
        };
    }

    makeBowl() {
        const maxW = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
        const maxH = maxW * 2;

        function makeRoundPath(blockHeight, up, right) {
            const remainingHeight = blockHeight > maxH ? blockHeight - maxH : 0;
            const height = blockHeight > maxH ? maxH : blockHeight;
            const radius = height / 2;
            const sweep = right === up ? "0" : "1";
            return (
                svgPaths.arc(
                    "a",
                    "0 0," + sweep,
                    radius,
                    svgPaths.point((right ? 1 : -1) * radius, (up ? -1 : 1) * radius),
                ) +
                svgPaths.lineOnAxis("v", (up ? -1 : 1) * remainingHeight) +
                svgPaths.arc(
                    "a",
                    "0 0," + sweep,
                    radius,
                    svgPaths.point((right ? -1 : 1) * radius, (up ? -1 : 1) * radius),
                )
            );
        }

        function makeMainPath(blockHeight, up, right) {
            const remainingHeight = blockHeight > maxH ? blockHeight - maxH : 0;
            const height = blockHeight > maxH ? maxH : blockHeight;
            const radius = height / 2;
            const dirR = right ? 1 : -1;
            const dirU = up ? -1 : 1;

            const totalHeight = height + remainingHeight;

            return (
                svgPaths.lineOnAxis("h", radius * dirR) +
                svgPaths.curve("q", [
                    svgPaths.point((radius / 2) * -dirR, dirU * (totalHeight / 2)),
                    svgPaths.point(0, totalHeight * dirU),
                ]) +
                svgPaths.lineOnAxis("h", radius * -dirR)
            );
        }

        return {
            type: this.SHAPES.ROUND,
            isDynamic: true,
            width(height) {
                const half = height / 2;
                return half > maxW ? maxW : half;
            },
            height(height) {
                return height;
            },
            connectionOffsetY(height) {
                return height / 2;
            },
            connectionOffsetX(width) {
                return -width;
            },
            pathDown(height) {
                return makeMainPath(height, false, false);
            },
            pathUp(height) {
                return makeMainPath(height, true, false);
            },
            pathRightDown(height) {
                return makeRoundPath(height, false, true);
            },
            pathRightUp(height) {
                return makeRoundPath(height, false, true);
            },
        };
    }

    makeArrow() {
        const maxW = this.MAX_DYNAMIC_CONNECTION_SHAPE_WIDTH;
        const maxH = maxW * 2;

        function makeIndentPath(blockHeight, up, right) {
            const dirR = right ? 1 : -1;
            const dirU = up ? -1 : 1;

            const remainingHeight = blockHeight > maxH ? blockHeight - maxH : 0;
            const height = blockHeight > maxH ? maxH : blockHeight;
            const totalHeight = height + remainingHeight;
            const radius = (height / 4) * dirR;

            return `
                h ${radius*2}
                l ${-radius} ${totalHeight/2 * dirU}
                l ${radius} ${totalHeight/2 * dirU}
            `;
        }

        function makeOutdentPath(blockHeight, up, right) {
            const dirR = right ? 1 : -1;
            const dirU = up ? -1 : 1;

            const remainingHeight = blockHeight > maxH ? blockHeight - maxH : 0;
            const height = blockHeight > maxH ? maxH : blockHeight;
            const totalHeight = height + remainingHeight;
            const radius = (height / 4) * dirR;

            return `
                h ${radius/2}
                l ${radius} ${totalHeight/2 * dirU}
                l ${-radius} ${totalHeight/2 * dirU}
            `;
        }

        return {
            type: this.SHAPES.ROUND,
            isDynamic: true,
            width(height) {
                const half = height / 4;
                return half > maxW ? maxW : half;
            },
            height(height) {
                return height;
            },
            connectionOffsetY(height) {
                return height / 2;
            },
            connectionOffsetX(width) {
                return -width;
            },
            pathDown(height) {
                return makeIndentPath(height, false, false);
            },
            pathUp(height) {
                return makeIndentPath(height, true, false);
            },
            pathRightDown(height) {
                return makeOutdentPath(height, false, true);
            },
            pathRightUp(height) {
                return makeOutdentPath(height, false, true);
            },
        };
    }

    /**
   * @param {Blockly.RenderedConnection} connection
   */
    shapeFor(connection) {
        let checks = connection.getCheck() ?? [];
        if (!checks && connection.targetConnection)
            checks = connection.targetConnection.getCheck() ?? [];
        let outputShape = connection.sourceBlock_.getOutputShape();

        if (connection.type === 1 || connection.type === 2) {
            if (checks.includes("String") || outputShape === 4) {
                return this.BUMPED;
            } else if (checks.includes("Number") || outputShape === 5) {
                return this.SPIKE_BUMPED;
            } else if (checks.includes("Vector") || outputShape === 6) {
                return this.ARROW;
            } else if (checks.includes("Matrix") || outputShape === 7) {
                return this.SCRAPPED;
            } else if (checks.includes("Table") || outputShape === 8) {
                return this.BRACKET;
            } else if (checks.includes("Array") || outputShape === 9) {
                return this.BOWL;
            } else if (checks.includes("Sprite") || outputShape === 10) {
                return this.OCTAGONAL;
            } else if (checks.includes("Color") || outputShape === 11) {
                return this.DECAGONAL;
            }
        }

        return super.shapeFor(connection);
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