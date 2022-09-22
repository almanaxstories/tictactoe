import "./style.css";
import * as generateField from "./generateField.js";
import _ from "lodash";

window.addEventListener("load", () => {
    let undoButton = document.getElementsByClassName("undo-btn btn");
    let redoButton = document.getElementsByClassName("redo-btn btn");
    let movesCounter = 0;
    let field = document.querySelector('.field');
    let gameState = [];

    field.addEventListener("click", e => {
        let cellObj = move(e.target, movesCounter);
        movesCounter = cellObj.currentMove;
        console.log(movesCounter);
        gameState.push(cellObj.cell);
        console.log(gameState[gameState.length-1]);
        saveToLocalStorage(gameState, movesCounter);
        renderWinner(getWinner, cellObj.cell);
    });

    //pull from LS + field refill somewhere here
    if (renderBattleField(pullFromLocalStorage, movesCounter)){
        movesCounter = renderBattleField.pulledMovesCounter;
    };

    function move(cell, currentMove){
        if(cell.className !== 'cell'){
            return;
        }
        currentMove += 1;
        if(currentMove%2 !== 0 ){
        cell.className = 'cell ch';
        }else{
        cell.className = 'cell r'; 
        }
    
        return {cell:cell, currentMove:currentMove};
    };
  
});


function getWinner(cell){
    let rowCoordinate = parseInt(cell.id[2]), colCoordinate = parseInt(cell.id[3]);

    function leftDiagonalWin(cell){
        if(rowCoordinate !== colCoordinate){
            return {victory: false,};
        }
            let winningCells = [];
            for(let a = 0; a < generateField.ROWS_COUNT; a+=1){
                if(document.getElementById(`c-${a}${a}`).className !== cell.className){
                    return {victory: false,};
                }
                winningCells.push(document.getElementById(`c-${a}${a}`));
                }
                return {victory: true, winningCells: winningCells,};                               
            };
    

    function rightDiagonalWin(cell){
        if(colCoordinate !== generateField.COLS_COUNT-rowCoordinate){
            return {victory: false,};
        }
            let winningCells = [];
            for(let a = 0; a < generateField.ROWS_COUNT; a+=1){
                if(document.getElementById(`c-${a}${(generateField.COLS_COUNT-1)-a}`).className !== cell.className){
                    return {victory: false,}; 
                }
                winningCells.push(document.getElementById(`c-${a}${(generateField.COLS_COUNT-1)-a}`));
            }
            return {victory: true, winningCells: winningCells,}; 
        };

    function rowsWin(cell){
        let winningCells = [];
        for(let a = 0; a < generateField.COLS_COUNT; a+=1){
            if(document.getElementById(`c-${rowCoordinate}${a}`).className !== cell.className){
                return {victory: false,};
            }
            winningCells.push(document.getElementById(`c-${rowCoordinate}${a}`));
        }
        return {victory: true, winningCells: winningCells,};
    };

    function colsWin(cell){
        let winningCells = [];
        for(a = 0; a < generateField.ROWS_COUNT; a+=1){
            if(document.getElementById(`c-${a}${colCoordinate}`)!== cell.className){
                return {victory: false,};
            }
            winningCells.push(document.getElementById(`c-${a}${colCoordinate}`)!== cell.className);
        }
        return {victory: true, winningCells: winningCells,};
    };

    let leftDiagonal = leftDiagonalWin(cell);
    let rightDiagonal = rightDiagonalWin(cell);
    let row = rowsWin(cell);
    let col = colsWin(cell);

    if(leftDiagonal.victory === true){
        return {winner : 'diagonal-left', cells : leftDiagonal.winningCells,};
    }else if(rightDiagonal.victory === true) {
        return {winner : 'diagonal-right', cells : rightDiagonal.winningCells,};
    }else if(row.victory === true) {
        return {winner : 'horizontal', cells : row.winningCells,};
    }else if(col.victory === true) {
        return {winner : 'vertical', cells : col.winningCells,};
    }else{
        return {winner: false};
    }

};

function pullFromLocalStorage(){
    let moves = JSON.parse(localStorage.getItem('moves'));

    if(!moves){
        return false;
    }

    let movesCounter = JSON.parse(localStorage.getItem('movesCounter'));
    return {moves : moves, movesCounter : movesCounter, successful : true,};
};

function saveToLocalStorage(moves, movesCounter){
    localStorage.setItem('moves', JSON.stringify(moves));
    localStorage.setItem('movesCounter', JSON.stringify(movesCounter));
};

function renderBattleField(pullFromStorageFunc,movesCounter){
    let pull = pullFromStorageFunc();

    if(!pull){
        return false;
    }

    for(let move of pull.moves){
        let cell = document.getElementById(move.id); 
        cell.className = move.className;
    }

    movesCounter = pull.movesCounter;

    return {pulledMovesCounter : movesCounter};
};

function renderWinner(getWinnerFunc, cell){
    let winningCells = getWinnerFunc(cell);

    if(!winningCells.winner){
        return;
    }

    for(let a of winningCells.cells){
        a.classList.add(winningCells.winner);
    }
    return true;
}
