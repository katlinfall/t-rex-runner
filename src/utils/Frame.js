import { Rectangle } from './Rectangle.js'

export class Frame extends Rectangle {
    constructor(hitbox, ...params) {
        super(...params)
        this.hitbox = hitbox
    }
}
