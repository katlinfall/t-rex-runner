import { Game } from '../main/Game.js'
import { Frame } from '../utils/Frame.js'
import _ from 'lodash'

export class Ground {
    static config = {
        SURFACE_Y: 60,
        START_Y: 54,
        START_X: 2,
        WIDTH_FRAME: 400,
        HEIGHT_FRAME: 12
    }

    static states = {
        DEFAULT: 'default'
    }

    static animation = {
        [Ground.states.DEFAULT]: {
            frames: [
                new Frame(
                    null,
                    Ground.config.START_X,
                    Ground.config.START_Y,
                    Ground.config.WIDTH_FRAME,
                    Ground.config.HEIGHT_FRAME,
                ),
                new Frame(
                    null,
                    Ground.config.START_X + Ground.config.WIDTH_FRAME,
                    Ground.config.START_Y,
                    Ground.config.WIDTH_FRAME,
                    Ground.config.HEIGHT_FRAME,
                ),
                new Frame(
                    null,
                    Ground.config.START_X,
                    Ground.config.START_Y,
                    Ground.config.WIDTH_FRAME,
                    Ground.config.HEIGHT_FRAME,
                ),
                new Frame(
                    null,
                    Ground.config.START_X + 2 * Ground.config.WIDTH_FRAME,
                    Ground.config.START_Y,
                    Ground.config.WIDTH_FRAME,
                    Ground.config.HEIGHT_FRAME,
                )
            ]
        }
    }

    constructor(canvas, speed) {
        this.canvas = canvas
        this.canvasCtx = canvas.getContext('2d')

        this.x = 0
        this.y = Ground.config.SURFACE_Y

        this.speed = speed
        this.state = Ground.states.DEFAULT

        this.activeFrames = []
        for (let i = 0; i < 3; i++) {
            const randomIndex = _.random(Ground.animation[this.state].frames.length - 1)
            this.activeFrames.push(Ground.animation[this.state].frames[randomIndex])
        }
    }


    draw() {
        const drawGroundFrame = (frame, offset) => {
            const drawX = this.x + offset
            const drawY = this.canvas.height - this.y - frame.height
            this.canvasCtx.drawImage(
                Game.sprite,
                frame.x, frame.y,
                frame.width, frame.height,
                drawX, drawY,
                frame.width, frame.height
            )
        }

        const drawGroundFrames = () => {
            let offset = 0
            for (const frame of this.activeFrames) {
                drawGroundFrame(frame, offset)
                offset += frame.width
            }
        }

        drawGroundFrames()
    }

    update(delta) {
        const move = (delta) => {
            this.x -= _.round(this.speed * delta)
        }

        const addFrame = () => {
            const frameWidth = this.activeFrames[0].width
            if (this.x + frameWidth < 0) {
                this.x += frameWidth
                this.activeFrames.shift()
                const randomIndex = _.random(1)
                this.activeFrames.push(Ground.animation[this.state].frames[randomIndex])
            }
        }

        this.draw()
        move(delta)
        addFrame()
    }
}
