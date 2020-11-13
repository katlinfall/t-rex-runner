import { Frame } from '../utils/Frame.js'
import { Ground } from '../background/Ground.js'
import { Hitbox } from '../utils/Hitbox.js'
import { Obstacle } from './Obstacle.js'
import _ from 'lodash'

export class Cactus extends Obstacle {
    static config = {
        START_X_SMALL: 228,
        START_X_LARGE: 332,
        START_X_COMPOUND: 431,
        START_Y: 3,

        WIDTH_SMALL: 17,
        HEIGHT_SMALL: 35,

        WIDTH_LARGE: 25,
        HEIGHT_LARGE: 50,

        WIDTH_COMPOUND: 51,
        HEIGHT_COMPOUND: 50
    }

    static states = {
        DEFAULT: 'default'
    }

    static animation = {
        [Cactus.states.DEFAULT]: {
            frames: [
                // small cactuses
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_SMALL, Cactus.config.HEIGHT_SMALL)],
                    Cactus.config.START_X_SMALL,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_SMALL,
                    Cactus.config.HEIGHT_SMALL,
                ),
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_SMALL, Cactus.config.HEIGHT_SMALL)],
                    Cactus.config.START_X_SMALL + Cactus.config.WIDTH_SMALL,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_SMALL,
                    Cactus.config.HEIGHT_SMALL
                ),
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_SMALL, Cactus.config.HEIGHT_SMALL)],
                    Cactus.config.START_X_SMALL + 2 * Cactus.config.WIDTH_SMALL,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_SMALL,
                    Cactus.config.HEIGHT_SMALL
                ),
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_SMALL, Cactus.config.HEIGHT_SMALL)],
                    Cactus.config.START_X_SMALL + 3 * Cactus.config.WIDTH_SMALL,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_SMALL,
                    Cactus.config.HEIGHT_SMALL
                ),
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_SMALL, Cactus.config.HEIGHT_SMALL)],
                    Cactus.config.START_X_SMALL + 4 * Cactus.config.WIDTH_SMALL,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_SMALL,
                    Cactus.config.HEIGHT_SMALL
                ),
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_SMALL, Cactus.config.HEIGHT_SMALL)],
                    Cactus.config.START_X_SMALL + 5 * Cactus.config.WIDTH_SMALL,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_SMALL,
                    Cactus.config.HEIGHT_SMALL
                ),
                // big cactuses
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_LARGE, Cactus.config.HEIGHT_LARGE)],
                    Cactus.config.START_X_LARGE,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_LARGE,
                    Cactus.config.HEIGHT_LARGE
                ),
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_LARGE, Cactus.config.HEIGHT_LARGE)],
                    Cactus.config.START_X_LARGE + Cactus.config.WIDTH_LARGE,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_LARGE,
                    Cactus.config.HEIGHT_LARGE
                ),
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_LARGE, Cactus.config.HEIGHT_LARGE)],
                    Cactus.config.START_X_LARGE + 2 * Cactus.config.WIDTH_LARGE + 1,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_LARGE,
                    Cactus.config.HEIGHT_LARGE
                ),
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_LARGE - 1, Cactus.config.HEIGHT_LARGE)],
                    Cactus.config.START_X_LARGE + 3 * Cactus.config.WIDTH_LARGE,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_LARGE - 1,
                    Cactus.config.HEIGHT_LARGE
                ),
                // compound cactuses
                new Frame(
                    [new Hitbox(0, 0, Cactus.config.WIDTH_COMPOUND, Cactus.config.HEIGHT_COMPOUND)],
                    Cactus.config.START_X_COMPOUND,
                    Cactus.config.START_Y,
                    Cactus.config.WIDTH_COMPOUND,
                    Cactus.config.HEIGHT_COMPOUND
                )
            ]
        }
    }

    constructor(canvas, speed) {
        super(canvas)

        this.x = this.canvas.width
        this.y = Ground.config.SURFACE_Y

        this.state = Cactus.states.DEFAULT
        const index = _.random(Cactus.animation[this.state].frames.length - 1)
        this.activeFrame = Cactus.animation[this.state].frames[index]

        this.speed = speed
    }

    update(delta) {
        this.updateHitbox()
        this.draw()
        this.move(delta)
    }
}
