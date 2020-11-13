import { Game } from './main/Game.js' 

window.addEventListener('load', () => {

    const canvas = document.getElementById('game-canvas')


    Game.sprite = document.getElementById('sprite')

    const game = new Game(canvas)
    game.start()


    window.addEventListener('keypress', (e) => {
        // console.log(e.keyCode)
        switch(e.keyCode) {
            case 49: game.onEvent(Game.keycodes.JUMP); break;
            case 50: game.onEvent(Game.keycodes.CROUCH); break;
        }
        // if (e.keyCode === 32) {
        //     game.onKeyDown(Game.keycodes.JUMP)
        // }

    })
    window.addEventListener('keyup', (e) => {
        // console.log(e.keyCode)
        switch(e.keyCode) {
            // case 49: game.onKeyDown(Game.keycodes.JUMP); break;
            case 50: game.onEvent(Game.keycodes.UNCROUCH); break;
        }
        // if (e.keyCode === 32) {
        //     game.onKeyDown(Game.keycodes.JUMP)
        // }

    })

})
