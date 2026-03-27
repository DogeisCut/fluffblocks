export default class Vector {
    constructor(x, y) {
        this.x = x
        this.y = y
    }
    static get ZERO() {
        return new Vector(0, 0)
    }
    static get ONE() {
        return new Vector(1, 1)
    }
    toCode() {
        return `new Vector(${this.x}, ${this.y})`
    }
}