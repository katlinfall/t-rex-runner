import { Game } from './Game.js'
import { Ground } from '../background/Ground.js'
import { Hitbox } from '../utils/Hitbox.js'
import { Frame } from '../utils/Frame.js'
import _ from 'lodash'

export class Trex {
    static config = {
        START_Y_RUNNING: 3,
        START_X_RUNNING: 765,
        WIDTH_RUNNING: 44,
        HEIGHT_RUNNING: 47,

        START_Y_CROUCHING: 19,
        START_X_CROUCHING: 941,
        WIDTH_CROUCHING: 59,
        HEIGHT_CROUCHING: 30,

        START_X_JUMPING: 677,
        START_X_CRASHED: 853,
        START_X_CRASHED_CROUCHING: 1060,

        DEFAULT_JUMP_SPEED: 500 / 1000,
        DEFAULT_ACCELERATION: 16 / 1000,
        DEFAULT_STEP_SPEED: 10 / 1000,
        DEFAULT_X: 100
    }

    static states = {
        RUNNING: 'running',
        CROUCHING: 'crouching',
        JUMPING: 'jumping',
        CRASHED: 'crashed'
    }

    static animation = {
        [Trex.states.RUNNING]: {
            frames: [
                new Frame(
                    [new Hitbox(0, 0, Trex.config.WIDTH_RUNNING, Trex.config.HEIGHT_RUNNING)],
                    Trex.config.START_X_RUNNING,
                    Trex.config.START_Y_RUNNING,
                    Trex.config.WIDTH_RUNNING,
                    Trex.config.HEIGHT_RUNNING,
                ),
                new Frame(
                    [new Hitbox(0, 0, Trex.config.WIDTH_RUNNING, Trex.config.HEIGHT_RUNNING)],
                    Trex.config.START_X_RUNNING + Trex.config.WIDTH_RUNNING,
                    Trex.config.START_Y_RUNNING,
                    Trex.config.WIDTH_RUNNING,
                    Trex.config.HEIGHT_RUNNING,
                ),
            ]
        },
        [Trex.states.CROUCHING]: {
            frames: [
                new Frame(
                    [new Hitbox(0, 0, Trex.config.WIDTH_CROUCHING, Trex.config.HEIGHT_CROUCHING)],
                    Trex.config.START_X_CROUCHING,
                    Trex.config.START_Y_CROUCHING,
                    Trex.config.WIDTH_CROUCHING,
                    Trex.config.HEIGHT_CROUCHING,
                ),
                new Frame(
                    [new Hitbox(0, 0, Trex.config.WIDTH_CROUCHING, Trex.config.HEIGHT_CROUCHING)],
                    Trex.config.START_X_CROUCHING + Trex.config.WIDTH_CROUCHING,
                    Trex.config.START_Y_CROUCHING,
                    Trex.config.WIDTH_CROUCHING,
                    Trex.config.HEIGHT_CROUCHING,
                ),
            ]
        },
        [Trex.states.JUMPING]: {
            frames: [
                new Frame(
                    [new Hitbox(0, 0, Trex.config.WIDTH_RUNNING, Trex.config.HEIGHT_RUNNING)],
                    Trex.config.START_X_JUMPING,
                    Trex.config.START_Y_RUNNING,
                    Trex.config.WIDTH_RUNNING,
                    Trex.config.HEIGHT_RUNNING,
                )
            ]
        },
        [Trex.states.CRASHED]: {
            frames: [
                new Frame(
                    [new Hitbox(0, 0, Trex.config.WIDTH_RUNNING, Trex.config.HEIGHT_RUNNING)],
                    Trex.config.START_X_CRASHED,
                    Trex.config.START_Y_RUNNING,
                    Trex.config.WIDTH_RUNNING,
                    Trex.config.HEIGHT_RUNNING,
                ),
                new Frame(
                    [new Hitbox(0, 0, Trex.config.WIDTH_CROUCHING, Trex.config.HEIGHT_CROUCHING)],
                    Trex.config.START_X_CRASHED_CROUCHING,
                    Trex.config.START_Y_CROUCHING,
                    Trex.config.WIDTH_CROUCHING,
                    Trex.config.HEIGHT_CROUCHING,
                )
            ]
        },
    }

    constructor(canvas) {
        this.canvas = canvas
        this.canvasCtx = canvas.getContext('2d')

        this.x = Trex.config.DEFAULT_X
        this.y = Ground.config.SURFACE_Y

        this.state = Trex.states.RUNNING

        this.jumping = false
        this.crouching = false

        this.currentFrameIndex = 0
        this.activeFrame = Trex.animation[this.state].frames[0]

        this.stepTimer = 0
        this.stepSpeed = Trex.config.DEFAULT_STEP_SPEED

        this.jumpingTimer = 0
        this.jumpSpeed = Trex.config.DEFAULT_JUMP_SPEED
        this.acceleration = Trex.config.DEFAULT_ACCELERATION
    }

    // public

    get hitbox() {
        return this.activeFrame.hitbox
    }

    get width() {
        return this.activeFrame.width
    }

    update(delta) {
        this.#step(delta)

        if (this.jumping) {
            this.#jump(delta)
        }

        this.#updateHitbox()
        this.draw()
    }

    draw() {
        this.#drawTrex()
        if (Game.config.RENDER_HITBOX) {
            this.#drawHitbox()
        }
    }

    reset() {
        this.jumpSpeed = Trex.config.DEFAULT_JUMP_SPEED
        this.acceleration = Trex.config.DEFAULT_ACCELERATION
        this.jumpingTimer = 0
        this.stepTimer = 0

        this.state = Trex.states.RUNNING
        this.activeFrame = Trex.animation[this.state].frames[0]
        this.jumping = false
        this.x = Trex.config.DEFAULT_X
        this.y = Ground.config.SURFACE_Y
    }

    crouch() {
        console.log('CROUCH')
        this.state = Trex.states.CROUCHING
    }

    uncrouch() {
        this.state = Trex.states.RUNNING
    }

    die() {
        const prevState = this.state
        this.state = Trex.states.CRASHED
        if (Trex.states.CROUCHING === prevState) {
            this.activeFrame = Trex.animation[this.state].frames[1]
        } else {
            this.activeFrame = Trex.animation[this.state].frames[0]
        }

        this.#updateHitbox()
        this.draw()
    }

    startJump() {
        this.jumping = true
        this.state = Trex.states.JUMPING
    }

    start() {
        this.draw()
    }

    // private

    #stopJump() {
        this.y = Ground.config.SURFACE_Y
        this.jumping = false
        this.jumpSpeed = Trex.config.DEFAULT_JUMP_SPEED
        this.state = Trex.states.RUNNING
    }


    #jump(delta) {
        this.jumpSpeed -= this.acceleration
        const currentIncrement = _.round(this.jumpSpeed * delta)
        this.y += currentIncrement

        // prevent falling underground
        if (this.y <= Ground.config.SURFACE_Y) {
            this.#stopJump()
        }
    }

    #step(delta) {
        this.stepTimer += delta
        if (this.stepTimer > 1 / this.stepSpeed) {
            // do step
            this.currentFrameIndex += 1
            this.currentFrameIndex = this.currentFrameIndex % Trex.animation[this.state].frames.length
            this.activeFrame = Trex.animation[this.state].frames[this.currentFrameIndex]
            this.stepTimer = 0
        }
    }

    #drawTrex() {
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

    #drawHitbox() {
        this.canvasCtx.strokeStyle = 'red'
        for (const box of this.activeFrame.hitbox) {
            const drawX = box.x
            const drawY = this.canvas.height - box.y - box.height
            this.canvasCtx.strokeRect(drawX, drawY, box.width, box.height)
        }
    }

    #updateHitbox() {
        for (let i = 0; i < this.activeFrame.hitbox.length; i++) {
            this.activeFrame.hitbox[i].x = this.x
            this.activeFrame.hitbox[i].y = this.y
        }
    }
}
