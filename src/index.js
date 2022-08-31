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
    if (turnOfCrosses) {
      this.classList.add("ch");
    } else {
      this.classList.add("r");
    }
    saveGameStateToLocalStorage();
    turnOfCrosses = !turnOfCrosses;
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

  function setGameStateOnTheFirstRun() {
    if (getGameStateFromLocalStorage()) {
      if (turnOfCrosses) {
        winningConditionsCheck("cell ch");
      } else if (!turnOfCrosses) {
        winningConditionsCheck("cell r");
      }
      turnOfCrosses = !turnOfCrosses;
      undoRedoButtonsController();
      return;
    }
    bindAllCells();
    turnOfCrosses = true;
    movesMade = 0;
    currentMove = 0;
    undoRedoButtonsController();
  }

  function getGameStateFromLocalStorage() {
    let field = JSON.parse(localStorage.getItem("field"));
    let turn = JSON.parse(localStorage.getItem("turn"));
    let gameDB = JSON.parse(localStorage.getItem('gameStorage'));
        let movesCounter = JSON.parse(localStorage.getItem('movesMade'));
        let move = JSON.parse(localStorage.getItem('currentMove'));
    if (!field) {
      return false;
    }
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      for (let b = 0; b < generateField.COLS_COUNT; b += 1) {
        let cell = document.getElementById(`c-${a}${b}`);
        cell.className = field[`c-${a}${b}`];
        if (cell.className === "cell") {
          cell.addEventListener("click", makeAMove);
        }
      }
    }
    turnOfCrosses = turn;
    gameStorage = gameDB;
        movesMade = movesCounter;
        currentTurn = move;
    return true;
  }

  function saveGameStateToLocalStorage() {
    let field = {};
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      for (let b = 0; b < generateField.COLS_COUNT; b += 1) {
        let cell = document.getElementById(`c-${a}${b}`);
        field[`c-${a}${b}`] = cell.className;
      }
    }
    localStorage.setItem("field", JSON.stringify(field));
    localStorage.setItem("turn", JSON.stringify(turnOfCrosses));
    gameStorage[currentMove] = field;
        localStorage.setItem('gameStorage',JSON.stringify(gameStorage));
        localStorage.setItem('movesMade', JSON.stringify(movesMade));
        localStorage.setItem('currentMove', JSON.stringify(currentMove));
  }

  function undoMove() {
    currentMove -= 1;
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      for (b = 0; b < generateField.COLS_COUNT; b += 1) {
        let cell = document.getElementById(`c-${a}${b}`);
        cell.className = gameStorage[currentMove][`c-${a}${b}`];
        if (cell.className === "cell") {
          cell.addEventListener("click", makeAMove);
        }
      }
    }
  }

  function redoMove() {
    currentMove += 1;
    for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
      for (b = 0; b < generateField.COLS_COUNT; b += 1) {
        let cell = document.getElementById(`c-${a}${b}`);
        cell.className = gameStorage[currentMove][`c-${a}${b}`];
        if (cell.className === "cell") {
          cell.addEventListener("click", makeAMove);
        }
      }
    }
  }

  function undoRedoButtonsController() {
    if (movesMade === 0 && currentMove === 0) {
      return;
    } else if (movesMade === currentMove) {
      let undoButton = document.getElementsByClassName("undo-btn btn");
      undoButton[0].toggleAttribute("disabled");
      undoButton.addEventListener("click", undoMove);
    } else if (currentMove < movesMade) {
      let undoButton = document.getElementsByClassName("undo-btn btn");
      let redoButton = document.getElementsByClassName("redo-btn btn");
      undoButton[0].toggleAttribute("disabled");
      redoButton[0].toggleAttribute("disabled");
      undoButton.addEventListener("click", undoMove);
      redoButton.addEventListener("click", redoMove);
    }
  }

  let turnOfCrosses,
    gameStorage = {},
    movesMade,
    currentMove;
  setGameStateOnTheFirstRun();
});
