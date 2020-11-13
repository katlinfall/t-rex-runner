import { Game } from '../main/Game.js'
import { Frame } from '../utils/Frame.js'
import { Hitbox } from '../utils/Hitbox.js'
import _ from 'lodash'

export class Cloud {
    static config = {
        HEIGHT: 14,
        WIDTH: 46,
        MAX_CLOUD_GAP: 400,
        MIN_CLOUD_GAP: 100,
        MIN_SKY_LEVEL: 320,
        MAX_SKY_LEVEL: 350,
        DEFAULT_SPEED: 70 / 1000,

        START_X: 86,
        START_Y: 2,
        WIDTH_FRAME: 46,
        HEIGHT_FRAME: 13
    }

    static states = {
        DEFAULT: 'default'
    }

    static animation = {
        [Cloud.states.DEFAULT]: {
            frames: [
                new Frame(
                    [new Hitbox(0, 0, Cloud.config.WIDTH_FRAME, Cloud.config.HEIGHT_FRAME)],
                    Cloud.config.START_X,
                    Cloud.config.START_Y,
                    Cloud.config.WIDTH_FRAME,
                    Cloud.config.HEIGHT_FRAME,
                ),
            ]
        },
    }

    constructor(canvas) {
        this.canvas = canvas
        this.canvasCtx = canvas.getContext('2d')

        this.x = this.canvas.width
        this.y = _.random(
            Math.abs(this.canvas.height - Cloud.config.MIN_SKY_LEVEL) % this.canvas.height,
            Math.abs(this.canvas.height - Cloud.config.MAX_SKY_LEVEL) % this.canvas.height
        )

        this.state = Cloud.states.DEFAULT
        this.activeFrame = Cloud.animation[Cloud.states.DEFAULT].frames[0]

        this.timer = 0
        this.speed = Cloud.config.DEFAULT_SPEED
    }

    update(delta) {
        this.draw()
        this.#move(delta)
    }

    draw() {
        const frame = this.activeFrame
        const drawX = this.x
        const drawY = this.y
        this.canvasCtx.drawImage(
            Game.sprite,
            frame.x, frame.y,
            frame.width, frame.height,
            drawX, drawY,
            frame.width, frame.height
        )
    }

    #move(delta) {
        this.x -= this.speed * delta
    }
}
