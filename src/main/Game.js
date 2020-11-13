import { Background } from "../background/Background.js"
import { Bird } from "../obstacles/Bird.js"
import { Cactus } from "../obstacles/Cactus.js"
import { GameOverPanel } from "../panels/GameOverPanel.js"
import { Trex } from "./Trex.js"
import { ScorePanel } from "../panels/ScorePanel.js"
import _ from 'lodash'

const privateConfig = {
    MIN_OBSTACLE_GAP: 400,
    MAX_OBSTACLE_GAP: 500,
    MAX_OBSTACLES_NUMBER: 3,
    DISTANCE_COEFFICIENT: 30
}

export class Game {
    static sprite = document.getElementById('sprite')

    static config = {
        RENDER_HITBOX: false,
        DEFAULT_SPEED: 200 / 1000,
        LEFT_BORDER_X: 0,
        RIGHT_BORDER_X: null
    }

    static keycodes = {
        JUMP: 1,
        CROUCH: 2,
        UNCROUCH: 3
    }

    constructor(canvas) {
        this.canvas = canvas
        this.canvasCtx = canvas.getContext('2d')

        // init some static vars
        this.constructor.config.RIGHT_BORDER_X = this.canvas.width

        this.speed = this.constructor.config.DEFAULT_SPEED

        this.background = new Background(this.canvas, this.speed)
        this.trex = new Trex(this.canvas)
        this.timer = 0

        this.obstacles = []
        this.nextObstacleGap = _.random(privateConfig.MIN_OBSTACLE_GAP, privateConfig.MAX_OBSTACLE_GAP)

        this.gameOverPanel = new GameOverPanel(this.canvas)
        this.scorePanel = new ScorePanel(this.canvas)

        this.nextMilestone = 100

        this.maxScore = 0
        this.currentScore = 0
    }

    updateTrex(delta) {
        this.trex.update(delta);
    }

    updateBackground(delta) {
        this.background.update(delta)
    }

    #createNewObstacle() {
        const random = _.random(1)
        return random == 0
            ? new Bird(this.canvas, this.speed)
            : new Cactus(this.canvas, this.speed)
    }

    updateObstacles(delta) {
        this.obstacles = this.obstacles.filter(obstacle => obstacle.x + obstacle.width > 0)
        this.obstacles.forEach(obstacle => obstacle.update(delta))

        if (this.obstacles.length < privateConfig.MAX_OBSTACLES_NUMBER) {
            const lastObstacle = _.last(this.obstacles)

            if (lastObstacle) {
                if (lastObstacle.x + this.nextObstacleGap < this.canvas.width) {
                    this.nextObstacleGap = _.random(400, 500)
                    this.obstacles.push(this.#createNewObstacle())
                }
            } else {
                this.obstacles.push(this.#createNewObstacle())
            }
        }
    }

    updateScore(delta) {
        this.currentScore += this.speed * delta / privateConfig.DISTANCE_COEFFICIENT
        if (this.currentScore > this.nextMilestone) {
            this.speed += 50 / 1000
            this.nextMilestone += 50

            this.trex.jumpSpeed += 70 / 1000
            this.trex.acceleration += 1 / 1000
        }

        if (this.currentScore > this.nextMilestone) {
            this.trex.jumpSpeed += 50 / 1000
        }

        this.scorePanel.update(this.maxScore, this.currentScore)
    }

    update(time) {
        // console.log('update')
        this.canvasCtx.clearRect(0, 0, this.canvas.width, this.canvas.height)
        const timeNow = time
        const timeDelta = timeNow - this.timer
        this.timer = timeNow


        this.background.updateSpeed(this.speed)
        this.updateBackground(timeDelta)
        this.updateObstacles(timeDelta)
        this.updateTrex(timeDelta)
        this.checkCollisions()
        this.updateScore(timeDelta)

        if (!this.gameOver) {
            requestAnimationFrame(this.update.bind(this))
        }
    }

    #checkHitboxCollision(box1, box2) {
        if (box2.x < box1.x + box1.width
            && box2.y < box1.y + box1.height
            && box1.x < box2.x + box2.width
            && box1.y < box2.y + box2.height
        ) {
            if (Game.config.RENDER_HITBOX) {
                this.canvasCtx.strokeStyle = 'green'
                this.canvasCtx.strokeRect(
                    box1.x,
                    this.canvas.height - box1.y - box1.height, box1.width, box1.height);
                this.canvasCtx.strokeRect(
                    box2.x,
                    this.canvas.height - box2.y - box2.height, box2.width, box2.height);
            }
            return true
        }
        return false
    }

    #checkHitboxesCollectionForCollision(list1, list2) {
        for (const box1 of list1) {
            for (const box2 of list2) {
                if (this.#checkHitboxCollision(box1, box2)) {
                    return true
                }
            }
        }
        return false
    }

    checkCollisions() {
        const obstacle = _.first(this.obstacles)

        if (obstacle) {
            if ((obstacle.x - (this.trex.x + this.trex.width) < 80)
                && (obstacle.x - (this.trex.x + this.trex.width) > 0)) {
                obstacle.markAsThreat = true
            }
            if ((obstacle.x + obstacle.width < this.trex.x) && obstacle.nearby) {
                obstacle.markAsThreat = false
            }
            if (obstacle.nearby && this.#checkHitboxesCollectionForCollision(obstacle.hitbox, this.trex.hitbox)) {
                this.trex.die()
                this.gameOver = true
                this.gameOverPanel.draw()
            }
        }
    }

    start() {
        window.requestAnimationFrame(this.update.bind(this))
    }

    restart() {
        this.obstacles = []
        this.trex.reset()
        if (this.maxScore < this.currentScore) {
            this.maxScore = this.currentScore
        }

        this.speed = Game.config.DEFAULT_SPEED;
        this.background.speed = privateConfig.DEFAULT_SPEED
        this.background.ground.speed = privateConfig.DEFAULT_SPEED
        this.currentScore = 0
        this.gameOver = false
        this.start()
    }

    onEvent(key) {
        switch (key) {
            case this.constructor.keycodes.JUMP: {
                this.gameOver ? this.restart() : this.trex.startJump();
                break;
            }
            case this.constructor.keycodes.CROUCH: {
                this.trex.crouch();
                break;
            }
            case this.constructor.keycodes.UNCROUCH: {
                this.trex.uncrouch();
                break;
            }
        }
    }
}
