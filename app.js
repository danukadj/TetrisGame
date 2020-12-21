document.addEventListener('DOMContentLoaded', () => {
    const grid = document.querySelector('.grid')
    let squares = Array.from(document.querySelectorAll('.grid div'))
    const ScoreDisplay = document.querySelector('#score')
    const StartBtn = document.querySelector('#start-button')
    const width = 10

    //the tetrominoes
    const lTetromino = [
        [1, width+1, width*2+1, 2],
        [width, width+1, width+2, width*2+2],
        [width*2,1,width+1,width*2+1],
        [width,width*2,width*2+1,width*2+2]
    ]
    const zTetromino = [
        [width*2,width+1,width*2+1,width+2],
        [0,width,width+1,width*2+1],
        [width*2,width+1,width*2+1,width+2],
        [0,width,width+1,width*2+1]
    ]
    const tTetromino = [
        [width,1,width+1,width+2],
        [1,width+1,width*2+1,width+2],
        [width,width+1,width*2+1,width+2],
        [width,1,width+1,width*2+1]
    ]
    const oTetromino = [
        [0,width,1,width+1],
        [0,width,1,width+1],
        [0,width,1,width+1],
        [0,width,1,width+1]
    ]
    const iTetromino = [
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3],
        [1,width+1,width*2+1,width*3+1],
        [width,width+1,width+2,width+3]
    ]





    
})