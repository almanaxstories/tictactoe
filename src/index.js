import "./style.css";
import * as generateField from "./generateField.js";
import _ from "lodash";

window.addEventListener("load", () => {
  function bindAllCells() {
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      for (let b = 0; b < generateField.COLS_COUNT; b += 1) {
        let cell = document.getElementById(`c-${a}${b}`);
        cell.addEventListener("click", makeAMove);
      }
    }
  }

  function setTheField(){
    for(let a = 0; a < battleField.length; a++){
      let cell = document.getElementById(battleField[a]['cellId']);
      cell.className = battleField[a]['cellClassName'];
      //cell.removeEventListener('click', makeAMove);
    }
  }

  function unbindFreeCells() {
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      for (let b = 0; b < generateField.COLS_COUNT; b += 1) {
        let cell = document.getElementById(`c-${a}${b}`);
        if (cell.className === "cell") {
          cell.removeEventListener("click", makeAMove);
        }
      }
    }
  }

  function rightDiagonalWinCheck(currentTurn) {
    for (let a = 0; a < generateField.COLS_COUNT; a += 1) {
      const cell = document.getElementById(`c-${a}${a}`);
      if (cell.className !== currentTurn) {
        return false;
      }
    }

    for (let a = 0; a < generateField.COLS_COUNT; a += 1) {
      const cell = document.getElementById(`c-${a}${a}`);
      cell.classList.add("win", "diagonal-right");
    }

    unbindFreeCells();
    showWinningTitle(currentTurn);
    return true;
  }

  function leftDiagonalWinCheck(currentTurn) {
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      let cell = document.getElementById(
        `c-${a}${generateField.COLS_COUNT - 1 - a}`
      );
      if (cell.className !== currentTurn) {
        return false;
      }
    }

    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      let cell = document.getElementById(
        `c-${a}${generateField.COLS_COUNT - 1 - a}`
      );
      cell.classList.add("win", "diagonal-left");
    }
    showWinningTitle(currentTurn);
    unbindFreeCells();
    return true;
  }

  function rowsWinCheck(currentTurn) {
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      let winningRow = true;
      for (let b = 0; b < generateField.COLS_COUNT; b += 1) {
        if (document.getElementById(`c-${a}${b}`).className !== currentTurn) {
          winningRow = false;
          break;
        }
      }
      if (winningRow) {
        for (let b = 0; b < generateField.COLS_COUNT; b += 1) {
          let cell = document.getElementById(`c-${a}${b}`);
          cell.classList.add("win", "horizontal");
        }
        showWinningTitle(currentTurn);
        unbindFreeCells();
        return true;
      }
    }
    return false;
  }

  function colsWinCheck(currentTurn) {
    for (let a = 0; a < generateField.COLS_COUNT; a += 1) {
      let winningCol = true;
      for (let b = 0; b < generateField.ROWS_COUNT; b += 1) {
        if (document.getElementById(`c-${b}${a}`).className !== currentTurn) {
          winningCol = false;
          break;
        }
      }

      if (winningCol) {
        for (let b = 0; b < generateField.ROWS_COUNT; b += 1) {
          let cell = document.getElementById(`c-${b}${a}`);
          cell.classList.add("win", "vertical");
        }
        unbindFreeCells();
        showWinningTitle(currentTurn);
        return true;
      }
    }
    return false;
  }

  function showWinningTitle(winningRule) {
    const restartGameButton = document.getElementsByClassName("restart-btn");
    restartGameButton[0].addEventListener("click", restartGame);
    const wonTitleDiv = document.getElementsByClassName("won-title");
    wonTitleDiv[0].classList.toggle("hidden");
    const wonMessage = document.getElementsByClassName("won-message");
    if (winningRule === "draw") {
      wonMessage[0].textContent = `It's a draw!`;
      return;
    } else if (winningRule === "cell r") {
      wonMessage[0].textContent = `Toes won!`;
      return;
    } else if (winningRule === "cell ch") {
      wonMessage[0].textContent = `Crosses won!`;
      return;
    }
    return;
  }

  function drawCheck() {
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      for (let b = 0; b < generateField.COLS_COUNT; b += 1) {
        if (document.getElementById(`c-${a}${b}`).className === "cell") {
          return;
        }
      }
    }
    showWinningTitle("draw");
    return;
  }

  function winningConditionsCheck(currentTurn) {
    if (rightDiagonalWinCheck(currentTurn)) {
      return;
    } else if (leftDiagonalWinCheck(currentTurn)) {
      return;
    } else if (rowsWinCheck(currentTurn)) {
      return;
    } else if (colsWinCheck(currentTurn)) {
      return;
    } else if (drawCheck()) {
      return;
    }
    return;
  }

  function makeAMove() {
    currentMove++;
    if (turnOfCrosses) {
      this.classList.add("ch");
    } else {
      this.classList.add("r");
    }
    if(currentMove < battleField.length){
      let tempArr = [];
      for (let a = 0; a < currentMove; a+=1){
        tempArr.push(battleField[a]);
      }
      battleField = [];
      battleField = tempArr;
      tempArr = [];
    }
    //memoryButtonsController();
    console.log(this.id);
    console.log(this.className);
    battleField.push({'cellId': this.id, 'cellClassName': this.className});
    console.log(currentMove);
    //currentMove++;
    memoryButtonsController();
    turnOfCrosses = !turnOfCrosses;
    saveGameStateToLocalStorage();
    winningConditionsCheck(this.className);
  }

  function restartGame() {
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      for (let b = 0; b < generateField.COLS_COUNT; b += 1) {
        let cell = document.getElementById(`c-${a}${b}`);
        if (cell.className !== "cell") {
          cell.className = "cell";
          cell.addEventListener("click", makeAMove);
        } else {
          cell.addEventListener("click", makeAMove);
        }
      }
    }
    const wonTitleDiv = document.getElementsByClassName("won-title");
    wonTitleDiv[0].classList.toggle("hidden");
    localStorage.clear();
    turnOfCrosses = true;
  }

  function getGameStateFromLocalStorage() {
    let field = JSON.parse(localStorage.getItem('field'));
    if (!field){
      return;
    }
    battleField = field;
    let turn = JSON.parse(localStorage.getItem('turn'));
    let move = JSON.parse(localStorage.getItem('move'));
    turnOfCrosses = turn;
    currentMove = move;
      console.log(battleField);
      console.log(currentMove);
      console.log(turnOfCrosses);
    setTheField();
    memoryButtonsController();
    return;
  }

  function saveGameStateToLocalStorage() {
    localStorage.clear();
    localStorage.setItem("field", JSON.stringify(battleField));
    localStorage.setItem("turn", JSON.stringify(turnOfCrosses));
    localStorage.setItem('move', JSON.stringify(currentMove));
    return;
  }

  function undoMove(){
    currentMove -= 1;
    restartGame();
    for(let a = 0; a < currentMove; a+=1){
      let cell = document.getElementById(battleField[a]['cellId']);
      cell.className = battleField[a]['cellClassName']; 
    }
    saveGameStateToLocalStorage();
    turnOfCrosses = !turnOfCrosses;
    //currentMove -= 1;
  }

  function redoMove(){
    currentMove += 1;
    restartGame();
    for(let a = 0; a < currentMove; a+=1){
      let cell = document.getElementById(battleField[a]['cellId']);
      cell.className = battleField[a]['cellClassName']; 
    }
    saveGameStateToLocalStorage();
    turnOfCrosses = !turnOfCrosses;
  }

  function memoryButtonsController(){
    let undoButton = document.getElementsByClassName("undo-btn btn");
    let redoButton = document.getElementsByClassName("redo-btn btn");

    if(currentMove === 0){
      return;
    }else if(currentMove === 1){
      undoButton[0].addEventListener("click", undoMove);
      undoButton[0].toggleAttribute("disabled");
      return;
    }else if(currentMove < battleField.length-1){
      undoButton[0].addEventListener("click", undoMove);
      undoButton[0].toggleAttribute("disabled");
      redoButton[0].addEventListener("click", redoMove);
      redoButton[0].toggleAttribute("disabled");
      return;
    }else if(currentMove === battleField.length){
      undoButton[0].addEventListener("click", undoMove);
      undoButton[0].toggleAttribute("disabled");
      return;
    }
    return;
  }

 
    let turnOfCrosses = true;
    let battleField = [];
    let currentMove = 0;
    bindAllCells();
    getGameStateFromLocalStorage();
  
});
