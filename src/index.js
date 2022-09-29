import "./style.css";
import * as generateField from "./generateField.js";

window.addEventListener("load", () => {
    let field = document.querySelector('.field');
    let undoButton = document.getElementsByClassName("undo-btn btn");
    //undoButton[0].addEventListener('click', undoMove);
    let redoButton = document.getElementsByClassName("redo-btn btn");
    //redoButton[0].addEventListener('click', redoMove);
    let wonTitle = document.getElementsByClassName('won-title');
    let restartButton = wonTitle[0].querySelector('.restart-btn');
   

    
    let gameState = loadGameState();
    renderBattleField(gameState, field);
    console.log(gameState.moves[gameState.moves.length - 1]);//point
    let previousCell = gameState.moves[gameState.moves.length - 1];

    if(previousCell){
        let winner = getWinner(field, previousCell, checkLeftDiagonal, checkRightDiagonal,
            checkCurrentRow, checkCurrentCol);
        renderWinner(winner, wonTitle);//pay attention
        buttonsController(gameState, undoButton[0], redoButton[0]);
    };

    field.addEventListener("click", e => {
        let cell = e.target;
        if (cell.className !== 'cell') {
            return;
        }

        gameState.movesCounter += 1;
        if (gameState.movesCounter % 2 !== 0) {
            cell.className = 'cell ch';
        } else {
            cell.className = 'cell r';
        }

        console.log(gameState.movesCounter);

        if(gameState.movesCounter !== gameState.moves.length){
            let tempArr = gameState.moves.slice(0, gameState.movesCounter-1);
            gameState.moves = tempArr;
            tempArr = [];
        }

        gameState.moves.push({
            cellId: cell.id,
            cellClassName: cell.className
        });
        console.log(gameState.moves[gameState.moves.length-1]);//point

        let winner = getWinner(field, {cellId: cell.id, cellClassName: cell.className}, 
            checkLeftDiagonal, checkRightDiagonal,
            checkCurrentRow, checkCurrentCol);
        renderWinner(winner, wonTitle);//pay attention
        buttonsController(gameState, undoButton[0], redoButton[0]);

        saveGameState(gameState);
    });

    restartButton.addEventListener('click', restartGame =>{
        localStorage.clear();
        wonTitle[0].classList.add('hidden');
        /*for(let row = 0; row < generateField.ROWS_COUNT; row+=1){
            for(let col = 0; col < generateField.COLS_COUNT; col+=1 ){
                let cell = field.querySelector(`#c-${row}${col}`);
                cell.className = 'cell';
            }
        }*/
        clearBattleField(generateField.ROWS_COUNT,generateField.COLS_COUNT, field);
        gameState.movesCounter = 0;
        buttonsController(gameState, undoButton[0], redoButton[0]);
    })

    undoButton[0].addEventListener('click', undoMove =>{
        wonTitle[0].classList.add('hidden');
        clearBattleField(generateField.ROWS_COUNT, generateField.COLS_COUNT, field);
        gameState.movesCounter -= 1;
        renderBattleField(gameState, field);
        let lastCell = gameState.moves[gameState.moves.length - 1];
        let winner = getWinner(field, lastCell, checkLeftDiagonal, checkRightDiagonal,
            checkCurrentRow, checkCurrentCol);
        renderWinner(winner, wonTitle);//pay attention
        buttonsController(gameState, undoButton[0], redoButton[0]);
        saveGameState(gameState);
    });

    redoButton[0].addEventListener('click', redoMove =>{
        wonTitle[0].classList.add('hidden');
        clearBattleField(generateField.ROWS_COUNT, generateField.COLS_COUNT, field);
        gameState.movesCounter += 1;
        renderBattleField(gameState, field);
        let lastCell = gameState.moves[gameState.moves.length - 1];
        let winner = getWinner(field, lastCell, checkLeftDiagonal, checkRightDiagonal,
            checkCurrentRow, checkCurrentCol);
        renderWinner(winner, wonTitle);//pay attention
        buttonsController(gameState, undoButton[0], redoButton[0]);
        saveGameState(gameState);
    });
});


function getWinner(field, cell, leftDiagonalCheckFunction, rightDiagonalCheckFunction,
                    rowCheckFunction, colCheckFunction) {
    let leftDiagonalWin = leftDiagonalCheckFunction(field,cell);
    let rightDiagonalWin = rightDiagonalCheckFunction(field,cell);
    let rowWin = rowCheckFunction(field,cell);
    let colWin = colCheckFunction(field,cell);

    if (leftDiagonalWin.winner) {
        return {winner: leftDiagonalWin.winner, cells: leftDiagonalWin.cells,};
    } else if (rightDiagonalWin.winner) {
        return {winner: rightDiagonalWin.winner, cells: rightDiagonalWin.cells,};
    } else if (rowWin.winner) {
        return {winner: rowWin.winner, cells: rowWin.cells,};
    } else if (colWin.winner) {
        return {winner: colWin.winner, cells: colWin.cells,};
    } else {
        return {winner: '',};
    }
};

function checkLeftDiagonal(field,cell){
    let rowCoordinate = parseInt(cell.cellId[2]), colCoordinate = parseInt(cell.cellId[3]);

    if(rowCoordinate !== colCoordinate){
        return {winner : '',};
    }

    let winningCells = [];

        for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
            let iterableCell = field.querySelector(`#c-${a}${a}`);

            if (iterableCell.className !== cell.cellClassName) {
                return {winner : '',};   
            }
            winningCells.push(iterableCell);
        }
        return {winner: 'diagonal-right', cells: winningCells,};
};

function checkRightDiagonal(field, cell){
    let rowCoordinate = parseInt(cell.cellId[2]), colCoordinate = parseInt(cell.cellId[3]);

    if (colCoordinate !== (generateField.COLS_COUNT -1) - rowCoordinate) {
        return {victory: false,};
    }

    let winningCells = [];

    for(let a = 0; a < generateField.COLS_COUNT; a+=1){
        let iterableCell = field.querySelector(`#c-${a}${(generateField.COLS_COUNT -1) - a}`);
        if(iterableCell.className !== cell.cellClassName){
            return {winner : '',}; 
        }
        winningCells.push(iterableCell);
    }
    return {winner : 'diagonal-left', cells : winningCells,};
};

function checkCurrentRow(field, cell){
    let rowCoordinate = parseInt(cell.cellId[2]), winningCells = [];

        for (let a = 0; a < generateField.COLS_COUNT; a += 1) {
            let iterableCell = field.querySelector(`#c-${rowCoordinate}${a}`);
            if (iterableCell.className !== cell.cellClassName) {
                return {winner: '',};
            }
            winningCells.push(iterableCell);
        }
        return {winner: 'horizontal', cells: winningCells,};
}

function checkCurrentCol(field, cell){
    let colCoordinate = parseInt(cell.cellId[3]), winningCells = [];

    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
        let iterableCell = field.querySelector(`#c-${a}${colCoordinate}`);

        if (iterableCell.className !== cell.cellClassName) {
            return {winner: '',};
        }
        winningCells.push(iterableCell);
    }
    return {winner: 'vertical', cells: winningCells,};
};

function loadGameState() {
    let moves = JSON.parse(localStorage.getItem('moves'));

    if (!moves) {
        moves = [];
    }

    let movesCounter = JSON.parse(localStorage.getItem('movesCounter'));
    if (!movesCounter) {
        movesCounter = 0;
    }
    return {
        moves: moves,
        movesCounter: movesCounter
    };
};

function saveGameState(gameState) {
    localStorage.setItem('moves', JSON.stringify(gameState.moves));
    localStorage.setItem('movesCounter', JSON.stringify(gameState.movesCounter));
};

/*function renderBattleField(gameState) {
    for (let move of gameState.moves) {
        let cell = document.getElementById(move.cellId);
        cell.className = move.cellClassName;
    }
};*/

/*function renderBattleField(gameState, field) {
    for (let move of gameState.moves) {
        let cell = field.querySelector(`#${move.cellId}`);
        cell.className = move.cellClassName;
    }
};*/

function renderBattleField(gameState, field) {
    for (let move = 0; move < gameState.movesCounter; move+=1) {
        let cell = field.querySelector(`#${gameState.moves[move].cellId}`);
        cell.className = gameState.moves[move].cellClassName;
    }
};

function renderWinner(object, wonTitle) {
    if (!object.winner) {
        return;
    }
    console.log(object.cells[0]);//point
    let wonMessage = wonTitle[0].querySelector('.won-message');
    let restartButton = wonTitle[0].querySelector('.restart-btn');
    object.cells[0].className === 'cell ch' ? wonMessage.innerText = 'Crosses won!' : wonMessage.innerText = 'Toes won!';

    for (let cell of object.cells) {
        cell.classList.add('win', object.winner);
        
    }
    
    wonTitle[0].classList.remove('hidden');
};

function buttonsController(gameState, undoButton, redoButton){
    if(gameState.movesCounter === 0){
        undoButton.disabled = true;
    }else if(gameState.movesCounter === gameState.moves.length){
        undoButton.disabled = false;
        redoButton.disabled = true;
    }else if(gameState.movesCounter < gameState.moves.length && gameState.movesCounter > 0){
        undoButton.disabled = false;
        redoButton.disabled = false;
    }
};

/*function undoMove(clearField, rowsCount, colsCount, field, gameState){
    clearField(rowsCount, colsCount, field);
    gameState.movesCounter-=1;
    renderBattleField(gameState, field);
    console.log('touchdown! undo');
};*/

/*function redoMove(){
    console.log('touchdown! redo');
};*/

/*function restartGameFunction(rowsCount, colsCount, movesCounter){
    field.innerHTML = '';
    //gameState.movesCounter = 0;
    generateRows(rowsCount,colsCount);
    wonTitle[0].classList.add('hidden');
};*/

function clearBattleField(rowsCount, colsCount, field){
    for(let row = 0; row < rowsCount; row+=1){
        for(let col = 0; col < colsCount; col+=1 ){
            let cell = field.querySelector(`#c-${row}${col}`);
            cell.className = 'cell';
        }
    }
};

/*function unbindEmptyCells(rowsCount, colsCount, field){

};*/