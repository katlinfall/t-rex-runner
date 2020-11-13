import { Game } from '../main/Game.js'
import { Frame } from '../utils/Frame.js'
import _ from 'lodash'

export class GameOverPanel {
    static config = {
        START_Y: 2,
        START_X_WING_DOWN: 134,
        START_X_WING_UP: 180,
        WIDTH_FRAME: 46,
        HEIGHT_FRAME: 40,
    }

    static states = {
        TEXT: 'text',
    }

    static animation = {
        [GameOverPanel.states.TEXT]: {
            frames: [new Frame(null, 484, 15, 191, 11)]
        }
    }

    constructor(canvas) {
        this.canvas = canvas
        this.canvasCtx = this.canvas.getContext('2d')
    }

    update(delta) {
        this.step(delta)
        this.move(delta)
        this.updateHitbox()
        this.draw()
    }

    draw() {
        const frame = GameOverPanel.animation[GameOverPanel.states.TEXT].frames[0]
        const drawX = (this.canvas.width - frame.width) / 2
        const drawY = (this.canvas.height - frame.height) / 2

        this.canvasCtx.drawImage(
            Game.sprite,
            frame.x, frame.y,
            frame.width, frame.height,
            drawX, drawY,
            frame.width, frame.height
        )
    }
}
