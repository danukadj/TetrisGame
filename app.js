document.addEventListener('DOMContentLoaded', () => {
    alert("use keyboard arrows to play")

    const grid_width = 10
    const grid_height = 20
    const grid_size = grid_width * grid_height

    const grid = createGrid();
    let squares = Array.from(grid.querySelectorAll('div'))
    const startBtn = document.querySelector('.button')



    const scoreDisplay = document.querySelector('.score-display')
    const linesDisplay = document.querySelector('.lines-score')
    
    let currentIndex = 0
    let currentRotation = 0
    // const width = 10
    let score = 0
    let lines = 0
    let timerId
    let nextRandom = 0
    const colors = [
        'url(./images/blue_block.png)',
        'url(./images/pink_block.png)',
        'url(./images/purple_block.png)',
        'url(./images/peach_block.png)',
        'url(./images/yellow_block.png)'
    ]

    function createGrid() {
        //main grid
        let grid = document.querySelector(".grid")
        for (let i = 0; i < grid_size; i++) {
            let gridElement = document.createElement("div")
            grid.appendChild(gridElement)
        }
        
        //set base of grid
        for (let i = 0; i < grid_width; i++) {
            let gridElement = document.createElement("div")
            gridElement.setAttribute("class","block3")
            grid.appendChild(gridElement)
        }
        
        //preview
        let previewGrid = document.querySelector(".preview-grid")
        for (let i = 0; i < 16; i++) {
            let gridElement = document.createElement("div")
            previewGrid.appendChild(gridElement);
        }

        return grid;
    }

    //assign functions to keycodes
    function control(e) {
        if(e.keyCode === 37) {
            moveLeft()
        } else if (e.keyCode === 38) {
            rotate()
        } else if (e.keyCode === 39) {
            moveRight()
        } else if (e.keyCode === 40) {
            moveDown()
        }
    }

    // the classical behavior is to speed up the block if down button is kept pressed so doing that
    document.addEventListener('keydown',control)
    
    //the tetrominoes
    const lTetromino = [
        [1, grid_width+1, grid_width*2+1, 2],
        [grid_width, grid_width+1, grid_width+2, grid_width*2+2],
        [grid_width*2,1,grid_width+1,grid_width*2+1],
        [grid_width,grid_width*2,grid_width*2+1,grid_width*2+2]
    ]

    const zTetromino = [
        [0,grid_width,grid_width+1,grid_width*2+1],
        [grid_width*2,grid_width+1,grid_width*2+1,grid_width+2],
        [0,grid_width,grid_width+1,grid_width*2+1],
        [grid_width*2,grid_width+1,grid_width*2+1,grid_width+2]        
    ]
    
    const tTetromino = [
        [grid_width,1,grid_width+1,grid_width+2],
        [1,grid_width+1,grid_width*2+1,grid_width+2],
        [grid_width,grid_width+1,grid_width*2+1,grid_width+2],
        [grid_width,1,grid_width+1,grid_width*2+1]
    ]
    
    const oTetromino = [
        [0,grid_width,1,grid_width+1],
        [0,grid_width,1,grid_width+1],
        [0,grid_width,1,grid_width+1],
        [0,grid_width,1,grid_width+1]
    ]
    
    const iTetromino = [
        [1,grid_width+1,grid_width*2+1,grid_width*3+1],
        [grid_width,grid_width+1,grid_width+2,grid_width+3],
        [1,grid_width+1,grid_width*2+1,grid_width*3+1],
        [grid_width,grid_width+1,grid_width+2,grid_width+3]
    ]
    
    const theTetrominoes = [lTetromino,zTetromino,tTetromino,oTetromino,iTetromino]

    //randomly select a Tetromino
    let random = Math.floor(Math.random()*theTetrominoes.length)
    let current = theTetrominoes[random][currentRotation]

    //
    let currentPosition = 4
    //draw the tetromino
    function draw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.add('block')
            squares[currentPosition + index].style.backgroundImage = colors[random]
        })
    }

    //undraw the tetromino
    function undraw() {
        current.forEach(index => {
            squares[currentPosition + index].classList.remove('block')
            squares[currentPosition + index].style.backgroundImage = 'none'
        })
    }

    //move down function
    function moveDown() {
        freeze()
        undraw()
        currentPosition += grid_width
        draw()
    }

    //move left and prevent collisions with shapes moving left
    function moveLeft() {
        undraw()
        const isAtLeftEdge = current.some(index => (currentPosition + index) % grid_width === 0)
        if(!isAtLeftEdge) currentPosition -= 1
        if(current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition += 1
        }
        draw()
    }
    
    //move right and prevent collisions with shapes moving right
    function moveRight() {
        undraw()
        const isAtRightEdge = current.some(index => (currentPosition + index) % grid_width === grid_width-1)
        if(!isAtRightEdge) currentPosition += 1
        if(current.some(index => squares[currentPosition + index].classList.contains('block2'))) {
            currentPosition -= 1
        }
        draw()
    }
    
    //freeze function
    function freeze() {
        // if block has settled
        if(current.some(index => squares[currentPosition + index + grid_width].classList.contains('block3') || squares[currentPosition + index + grid_width].classList.contains('block2'))) {
            //make it block2
            current.forEach(index => squares[currentPosition + index].classList.add('block2'))

            addScore()
            //start a new tetromino falling
            random = nextRandom
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            current = theTetrominoes[random][currentRotation]
            currentPosition = 4
            draw()
            displayShape()
            gameOver()
        }
    }
    freeze()

    //check for rotation
    function isGoRight() {
        return current.some(index=> (currentPosition + index) % grid_width === grid_width-1)
    }
    function isGoLeft() {
        return current.some(index => (currentPosition + index) % grid_width === 0)
    }
    function checkRotatedPosition() {
        if ((currentPosition+1) % grid_width < 3) {
            if (isGoRight()) {
                currentPosition += 1
            }
        } else if (currentPosition % grid_width > 6) {
            if (isGoLeft()) {
                currentPosition -= 1
                checkRotatedPosition()
            }
        }
    }

    //rotate the tetromino
    function rotate() {
        undraw()
        currentRotation ++
        if(currentRotation === current.length) {
            currentRotation = 0
        }
        current = theTetrominoes[random][currentRotation]
        checkRotatedPosition()
        draw()
    }

    //start/pause
    startBtn.addEventListener('click', () => {
        if(timerId) {
            clearInterval(timerId)
            timerId = null
        } else {
            draw()
            //make the tetromino move down every second
            timerId = setInterval(moveDown, 1000)
            nextRandom = Math.floor(Math.random()*theTetrominoes.length)
            displayShape()
        }
    })
    
    //game over
    function gameOver() {
        if(current.some(index => squares[currentPosition+index].classList.contains('block2'))) {
            scoreDisplay.innerHTML = 'end'
            clearInterval(timerId)
            document.removeEventListener("keydown",control)
        }
    }
    
    //show preview
    const displayWidth = 4
    const displaySquares = document.querySelectorAll('.preview-grid div')
    let displayIndex = 0
    
    const upNextTetrominoes = [
        [1, displayWidth+1, displayWidth*2+1, 2], //lTetromino
        [0,displayWidth,displayWidth+1,displayWidth*2+1], //zTetromino
        [displayWidth,1,displayWidth+1,displayWidth+2], //tTetromino
        [0,displayWidth,1,displayWidth+1], //oTetromino
        [1,displayWidth+1,displayWidth*2+1,displayWidth*3+1] //iTetromino
    ]

    function displayShape() {
        //remove any trace of a tetromino form the entire grid
        displaySquares.forEach(square => {
            square.classList.remove('block')
            square.style.backgroundImage = 'none'
        })
        upNextTetrominoes[nextRandom].forEach(index => {
            displaySquares[displayIndex + index].classList.add('block')
            displaySquares[displayIndex + index].style.backgroundImage = colors[nextRandom]
        })
    }
    
    //add score
    function addScore() {
        for (let i=0; i < grid_size; i+=grid_width) {
            const row = [i,i+1,i+2,i+3,i+4,i+5,i+6,i+7,i+8,i+9]
            if(row.every(index => squares[index].classList.contains('block2'))) {
                score += 10
                lines += 1
                scoreDisplay.innerHTML = score
                linesDisplay.innerHTML = lines
                // undraw()
                row.forEach(index => {
                    squares[index].style.backgroundImage = 'none'
                    squares[index].classList.remove('block2') || squares[index].classList.remove('block')
                })
                //splice array
                const squaresRemoved = squares.splice(i,grid_width)
                squares = squaresRemoved.concat(squares)
                squares.forEach(cell => grid.appendChild(cell))
                // draw()
            }
        }
    }

})