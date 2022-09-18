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
        let cell = move(e.target, moveCounter);
        movesCounter = cell['currentMove'];
    });

    //pull from LS + field refill somewhere here
    //renderBattleField();

    function move(cell, currentMove){
        currentMove += 1;
        if(currentMove%2 !== 0 ){
        cell.className = 'cell ch';
        }else{
        cell.className = 'cell r'; 
        }
        gameState.push(cell);
        saveToLocalStorage(gameState, movesCounter);
        return {'cell':cell, 'currentMove':currentMove};
    };
  
});


function getWinner(field, cell){
    let rowCoordinate = parseInt(cell.id[2]), colCoordinate = parseInt(cell.id[3]);

    function leftDiagonalWin(field, cell){
        if(rowCoordinate !== colCoordinate){
            return {'isItVictory?': false,};
        }
            let winningCells = [];
            for(let a of generateField.ROWS_COUNT){
                if(field.getElementById(`c-${a}${a}`).className !== cell.className){
                    return {'isItVictory?': false,};
                }
                winningCells.push(field.getElementById(`c-${a}${a}`));
                }
                return {'isItVictory?': true, 'winningCells': winningCells,};                               
            };
    

    function rightDiagonalWin(field, cell){
        if(colCoordinate !== generateField.COLS_COUNT-rowCoordinate){
            return {'isItVictory?': false,};
        }
            let winningCells = [];
            for(let a of generateField.ROWS_COUNT){
                if(field.getElementById(`c-${a}${(generateField.COLS_COUNT-1)-a}`).className !== cell.className){
                    return {'isItVictory?': false,}; 
                }
                winningCells.push(field.getElementById(`c-${a}${(generateField.COLS_COUNT-1)-a}`));
            }
            return {'isItVictory?': true, 'winningCells': winningCells,}; 
        };

    function rowsWin(field, cell){
        let winningCells = [];
        for(let a of generateField.COLS_COUNT){
            if(field.getElementById(`c-${rowCoordinate}${a}`).className !== cell.className){
                return {'isItVictory?': false,};
            }
            winningCells.push(field.getElementById(`c-${rowCoordinate}${a}`));
        }
        return {'isItVictory?': true, 'winningCells': winningCells,};
    };

    function colsWin(field, cell){
        let winningCells = [];
        for(let a of generateField.ROWS_COUNT){
            if(field.getElementById(`c-${a}${colCoordinate}`)!== cell.className){
                return {'isItVictory?': false,};
            }
            winningCells.push(field.getElementById(`c-${a}${colCoordinate}`)!== cell.className);
        }
        return {'isItVictory?': true, 'winningCells': winningCells,};
    };

    let leftDiagonal = leftDiagonalWin(field, cell);
    let rightDiagonal = rightDiagonalWin(field, cell);
    let row = rowsWin(field, cell);
    let col = colsWin(field, cell);

    if(leftDiagonal["isItVictory?"] === true){
        return {'winner':'diagonal-left', 'cells':leftDiagonal['winningCells'],};
    }else if(rightDiagonal["isItVictory?"] === true) {
        return {'winner':'diagonal-right', 'cells':rightDiagonal['winningCells'],};
    }else if(row["isItVictory?"] === true) {
        return {'winner':'horizontal', 'cells':row['winningCells'],};
    }else if(col["isItVictory?"] === true) {
        return {'winner':'vertical', 'cells':col['winningCells'],};
    }else{
        return {'winner': false};
    }

};

function pullFromLocalStorage(){
    let moves = JSON.parse(localStorage.getItem('moves'));

    if(!moves){
        return false;
    }

    let movesCounter = JSON.parse(localStorage.getItem('movesCounter'));
    return {'moves' : moves, 'movesCounter' : movesCounter, 'successful?' : true,};
};

function saveToLocalStorage(moves, movesCounter){
    localStorage.setItem('moves', JSON.stringify(moves));
    localStorage.setItem('movesCounter', JSON.stringify(movesCounter));
};

function renderBattleField(pullFromStorageFunc,field,movesCounter){
    let pull = pullFromStorageFunc();

    if(!pull){
        return false;
    }

    for(let move of pull['moves']){
        let cell = field.getElementById(move.id);
        cell.className = move.className;
    }

    movesCounter = pull['movesCounter'];

    return movesCounter;
};
