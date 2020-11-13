import { Hitbox } from '../utils/Hitbox.js'
import { Obstacle } from './Obstacle.js'
import { Ground } from '../background/Ground.js'
import { Frame } from '../utils/Frame.js'
import _ from 'lodash'


export class Bird extends Obstacle {

    static config = {
        START_Y: 2,
        START_X_WING_DOWN: 134,
        START_X_WING_UP: 180,
        WIDTH_FRAME: 46,
        HEIGHT_FRAME: 40,
        FLYING_HEIGHTS: [35, 18, 100],
        DEFAULT_STEP_SPEED: 3 / 1000
    }

    static states = {
        DEFAULT: 'default'
    }

    static animation = {
        [Bird.states.DEFAULT]: {
            frames: [
                new Frame(
                    [new Hitbox(0, 0, Bird.config.WIDTH_FRAME, Bird.config.HEIGHT_FRAME)],
                    Bird.config.START_X_WING_DOWN,
                    Bird.config.START_Y,
                    Bird.config.WIDTH_FRAME,
                    Bird.config.HEIGHT_FRAME,
                ),
                new Frame(
                    [new Hitbox(0, 0, Bird.config.WIDTH_FRAME, Bird.config.HEIGHT_FRAME)],
                    Bird.config.START_X_WING_UP,
                    Bird.config.START_Y,
                    Bird.config.WIDTH_FRAME,
                    Bird.config.HEIGHT_FRAME,
                )
            ]
        }
    }

    constructor(canvas, speed) {
        super(canvas)

        this.x = this.canvas.width
        const index = _.random(0, Bird.config.FLYING_HEIGHTS.length - 1)
        this.y = Ground.config.SURFACE_Y + Bird.config.FLYING_HEIGHTS[index]

        this.state = Bird.states.DEFAULT
        this.currentFrameIndex = 0
        this.activeFrame = Bird.animation[this.state].frames[0]

        this.stepTimer = 0
        this.stepSpeed = Bird.config.DEFAULT_STEP_SPEED

        this.timer = 0
        this.speed = speed
    }


    update(delta) {
        this.#step(delta)
        this.move(delta)

        this.updateHitbox()
        this.draw()
    }

    #step(delta) {
        this.stepTimer += delta
        if (this.stepTimer > 1 / this.stepSpeed) {
            // do step
            this.currentFrameIndex += 1
            this.currentFrameIndex = this.currentFrameIndex % Bird.animation[this.state].frames.length
            this.activeFrame = Bird.animation[this.state].frames[this.currentFrameIndex]
            this.stepTimer = 0
        }
    }
}
