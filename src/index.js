import "./style.css";
import * as generateField from "./generateField.js";

window.addEventListener("load", () => {
    let undoButton = document.getElementsByClassName("undo-btn btn");
    let redoButton = document.getElementsByClassName("redo-btn btn");
    let wonTitle = document.getElementsByClassName('won-title');
    let wonMessage = document.getElementsByClassName('won-message');

    let field = document.querySelector('.field');
    let gameState = loadGameState();
    renderBattleField(gameState);
    console.log(gameState.moves[gameState.moves.length - 1]);
    let previousCell = gameState.moves[gameState.moves.length - 1];

    if(previousCell){
        let winner = getWinner(field, previousCell, checkLeftDiagonal, checkRightDiagonal,
            checkCurrentRow, checkCurrentCol);
        renderWinner(winner, wonTitle, wonMessage);
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

        if(gameState.movesCounter-1 !== gameState.moves.length){
            let tempArr = gameState.moves.slice(0, gameState.movesCounter-1);
            gameState.movesCounter = tempArr;
            tempArr = [];
        }

        gameState.moves.push({
            cellId: cell.id,
            cellClassName: cell.className
        });
        console.log(gameState[gameState.moves.length - 1]);

        let winner = getWinner(field, {cellId: cell.id, cellClassName: cell.className}, 
            checkLeftDiagonal, checkRightDiagonal,
            checkCurrentRow, checkCurrentCol);
        renderWinner(winner, wonTitle, wonMessage);

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
}

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
}

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
}

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
}

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
}

function saveGameState(gameState) {
    localStorage.setItem('moves', JSON.stringify(gameState.moves));
    localStorage.setItem('movesCounter', JSON.stringify(gameState.movesCounter));
}

function renderBattleField(gameState) {
    for (let move of gameState.moves) {
        let cell = document.getElementById(move.cellId);
        cell.className = move.cellClassName;
    }
}

function renderWinner(object, wonTitle, wonMessage) {
    if (!object.winner) {
        return;
    }
    console.log(object.cells[0]);
    object.cells[0].className === 'cell ch' ? wonMessage[0].innerText = 'Crosses won!' : wonMessage[0].innerText = 'Toes won!';

    for (let cell of object.cells) {
        cell.classList.add('win', object.winner);
        
    }
    
    wonTitle[0].classList.toggle('hidden');
   
    
};