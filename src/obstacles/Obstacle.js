import { Game } from '../main/Game.js'
import _ from 'lodash'

export class Obstacle {
    constructor(canvas) {
        this.canvas = canvas
        this.canvasCtx = canvas.getContext('2d')

        this.nearby = false

        this.x = 0
        this.y = 0
    }

    set markAsThreat(value) {
        this.nearby = value
    }

    get hitbox() {
        return this.activeFrame.hitbox
    }

    get width() {
        return this.activeFrame.width
    }

    get height() {
        return this.activeFrame.height
    }

    updateHitbox() {
        for (let i = 0; i < this.activeFrame.hitbox.length; i++) {
            this.activeFrame.hitbox[i].x = this.x
            this.activeFrame.hitbox[i].y = this.y
        }
    }

    drawHitbox() {
        this.canvasCtx.strokeStyle = 'red'
        for (const box of this.activeFrame.hitbox) {
            const drawX = box.x
            const drawY = this.canvas.height - box.y - box.height

            this.canvasCtx.strokeRect(drawX, drawY, box.width, box.height)
        }
    }

    drawObstacle() {
        const frame = this.activeFrame
        const drawX = this.x
        const drawY = this.canvas.height - this.y - frame.height

        this.canvasCtx.drawImage(
            Game.sprite,
            frame.x, frame.y,
            frame.width, frame.height,
            drawX, drawY,
            frame.width, frame.height
        )
    }

    move(delta) {
        this.x -= _.round(this.speed * delta)
    }

    draw() {
        this.drawObstacle()
        if (Game.config.RENDER_HITBOX) {
            this.drawHitbox()
        }
    }
}
