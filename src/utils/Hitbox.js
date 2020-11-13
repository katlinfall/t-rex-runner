import { Rectangle } from "./Rectangle.js"

export class Hitbox extends Rectangle {
    constructor(...params) {
        super(...params)
    }

    draw(canvasCtx) {
        const drawX = this.x
        const drawY = this.y - this.height
        canvasCtx.strokeRect(drawX, drawY, this.width, this.height)
    }
}
