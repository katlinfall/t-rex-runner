import { Cloud } from "./Cloud.js"
import { Ground } from "./Ground.js"
import _ from 'lodash'

export class Background {
    constructor(canvas, speed) {
        this.canvas = canvas
        this.canvasCtx = canvas.getContext('2d')
        this.x = 0
        this.y = 0
        this.clouds = []
        this.nextCloudGap = _.random(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP)

        this.speed = speed

        this.ground = new Ground(this.canvas, this.speed)
    }


    update(delta) {
        this.#updateClouds(delta)
        this.#updateGround(delta)
    }

    updateSpeed(speed) {
        this.ground.speed = speed
    }

    #updateClouds(delta) {
        this.clouds = this.clouds.filter(cloud => cloud.x + Cloud.config.WIDTH > 0)
        this.clouds.forEach(cloud => cloud.update(delta));

        if (this.clouds.length < 5) {
            const lastCloud = _.last(this.clouds)

            if (lastCloud) {
                if (lastCloud.x + this.nextCloudGap < this.canvas.width) {
                    this.nextCloudGap = _.random(Cloud.config.MIN_CLOUD_GAP, Cloud.config.MAX_CLOUD_GAP)
                    this.clouds.push(new Cloud(this.canvas))
                }
            } else {
                this.clouds.push(new Cloud(this.canvas))
            }
        }
    }

    #updateGround(delta) {
        this.ground.update(delta)
    }
}
