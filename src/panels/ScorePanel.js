import { Game } from '../main/Game.js'
import { Frame } from '../utils/Frame.js'
import _ from 'lodash'


export class ScorePanel {
    static config = {
        MAX_DIGITS_NUMBER: 6,
        OFFSET_X: 200,
        OFFSET_Y: 50
    }

    static digits = {
        0: new Frame(null, 484, 2, 9, 11),
        1: new Frame(null, 495, 2, 9, 11),
        2: new Frame(null, 504, 2, 9, 11),
        3: new Frame(null, 514, 2, 9, 11),
        4: new Frame(null, 524, 2, 9, 11),
        5: new Frame(null, 534, 2, 9, 11),
        6: new Frame(null, 544, 2, 9, 11),
        7: new Frame(null, 554, 2, 9, 11),
        8: new Frame(null, 564, 2, 9, 11),
        9: new Frame(null, 574, 2, 9, 11),
        HI: new Frame(null, 584, 2, 19, 11),
    }

    constructor(canvas) {
        this.canvas = canvas
        this.canvasCtx = this.canvas.getContext('2d')

        this.x = this.canvas.width - ScorePanel.config.OFFSET_X
        this.y = ScorePanel.config.OFFSET_Y

        this.score = 0
        this.maxScore = 0
    }

    update(maxScore, score) {
        this.score = _.round(score)
        this.maxScore = _.round(maxScore)
        this.draw()
    }

    draw() {
        const startX = this.x
        const startY = this.y
        this.#drawHighscore(startX, startY)
        this.#drawScore(startX + 100, startY)
    }

    #drawDigit(digit, x, y) {
        const drawX = x
        const drawY = y
        const frame = ScorePanel.digits[digit]

        this.canvasCtx.drawImage(
            Game.sprite,
            frame.x, frame.y,
            frame.width, frame.height,
            drawX, drawY,
            frame.width, frame.height
        )
    }

    #drawScore(X, Y) {
        const str = this.score.toString()
        const digits = str.length === 1 ? ['0'] : str.split('')
        const zeroes = '0'.repeat(ScorePanel.config.MAX_DIGITS_NUMBER - digits.length).split('')
        digits.unshift(...zeroes)

        let y = Y
        let x = X
        for (const digit of digits) {
            this.#drawDigit(digit, x, y)
            x += ScorePanel.digits[digit].width + 1
        }
    }

    #drawHighscore(startX, startY) {
        const digits = this.maxScore.toString().split('')
        const zeroes = '0'.repeat(ScorePanel.config.MAX_DIGITS_NUMBER - digits.length).split('')
        digits.unshift(...zeroes)

        let x = startX
        let y = startY

        this.#drawDigit('HI', x, y)
        x += 25

        for (const digit of digits) {
            this.#drawDigit(digit, x, y)
            x += ScorePanel.digits[digit].width + 1
        }
    }
}
