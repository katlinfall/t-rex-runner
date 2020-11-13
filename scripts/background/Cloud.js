import { Game } from './Game.js.js'
import _ from 'lodash'

export class Cloud {
    static config = {
        HEIGHT: 14,
        WIDTH: 46,

        MAX_CLOUD_GAP: 400,
        MIN_CLOUD_GAP: 100,

        MIN_SKY_LEVEL: 320,
        MAX_SKY_LEVEL: 350,
    }


    constructor(canvas) {

        this.canvas = canvas
        this.canvasCtx = canvas.getContext('2d')
        this.x = this.canvas.width
        this.y = _.random(
            Math.abs(this.canvas.height - Cloud.config.MIN_SKY_LEVEL) % this.canvas.height,
            Math.abs(this.canvas.height - Cloud.config.MAX_SKY_LEVEL) & this.canvas.height
        )

        this.timer = 0
        this.speed = 70 / 1000
    }

    draw() {
        this.canvasCtx.drawImage(
            Game.sprite,
            87,
            1,
            Cloud.config.WIDTH,
            Cloud.config.HEIGHT,
            this.x,
            this.y,
            Cloud.config.WIDTH,
            Cloud.config.HEIGHT
        );
    }

    update(delta) {
        this.draw()
        this.move(delta)
    }

    move(delta) {
        const increment = this.speed * delta
        this.x -= increment
    }
}
