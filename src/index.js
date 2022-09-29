import "./style.css";
import * as generateField from "./generateField.js";

window.addEventListener("load", () => {
  let field = document.querySelector(".field");
  let undoButton = document.getElementsByClassName("undo-btn btn");
  let redoButton = document.getElementsByClassName("redo-btn btn");
  let wonTitle = document.getElementsByClassName("won-title");
  let restartButton = wonTitle[0].querySelector(".restart-btn");

  let gameState = loadGameState();
  renderBattleField(gameState, field);
  let previousCell = gameState.moves[gameState.moves.length - 1];

  if (previousCell) {
    let winner = getWinner(
      field,
      previousCell,
      checkLeftDiagonal,
      checkRightDiagonal,
      checkCurrentRow,
      checkCurrentCol,
      checkDraw,
      generateField.ROWS_COUNT,
      generateField.COLS_COUNT
    );
    renderWinner(winner, wonTitle);
    buttonsController(gameState, undoButton[0], redoButton[0]);
  }

  field.addEventListener("click", (e) => {
    let cell = e.target;
    if (cell.className !== "cell" || wonTitle[0].className === "won-title") {
      return;
    }

    gameState.movesCounter += 1;
    if (gameState.movesCounter % 2 !== 0) {
      cell.className = "cell ch";
    } else {
      cell.className = "cell r";
    }

    if (gameState.movesCounter <= gameState.moves.length) {
      let tempArr = gameState.moves.slice(0, gameState.movesCounter - 1);
      gameState.moves = tempArr;
      tempArr = [];
    }

    gameState.moves.push({
      cellId: cell.id,
      cellClassName: cell.className,
    });

    let winner = getWinner(
      field,
      { cellId: cell.id, cellClassName: cell.className },
      checkLeftDiagonal,
      checkRightDiagonal,
      checkCurrentRow,
      checkCurrentCol,
      checkDraw,
      generateField.ROWS_COUNT,
      generateField.COLS_COUNT
    );
    renderWinner(winner, wonTitle);
    buttonsController(gameState, undoButton[0], redoButton[0]);
    saveGameState(gameState);
  });

  restartButton.addEventListener("click", (restartGame) => {
    wonTitle[0].classList.add("hidden");
    clearBattleField(generateField.ROWS_COUNT, generateField.COLS_COUNT, field);
    gameState.movesCounter = 0;
    gameState.moves = [];
    saveGameState(gameState);
    buttonsController(gameState, undoButton[0], redoButton[0]);
  });

  undoButton[0].addEventListener("click", (undoMove) => {
    wonTitle[0].classList.add("hidden");
    clearBattleField(generateField.ROWS_COUNT, generateField.COLS_COUNT, field);
    gameState.movesCounter -= 1;
    renderBattleField(gameState, field);
    let lastCell = gameState.moves[gameState.moves.length - 1];
    let winner = getWinner(
      field,
      lastCell,
      checkLeftDiagonal,
      checkRightDiagonal,
      checkCurrentRow,
      checkCurrentCol,
      checkDraw,
      generateField.ROWS_COUNT,
      generateField.COLS_COUNT
    );
    renderWinner(winner, wonTitle);
    buttonsController(gameState, undoButton[0], redoButton[0]);
    saveGameState(gameState);
  });

  redoButton[0].addEventListener("click", (redoMove) => {
    wonTitle[0].classList.add("hidden");
    clearBattleField(generateField.ROWS_COUNT, generateField.COLS_COUNT, field);
    gameState.movesCounter += 1;
    renderBattleField(gameState, field);
    let lastCell = gameState.moves[gameState.moves.length - 1];
    let winner = getWinner(
      field,
      lastCell,
      checkLeftDiagonal,
      checkRightDiagonal,
      checkCurrentRow,
      checkCurrentCol,
      checkDraw,
      generateField.ROWS_COUNT,
      generateField.COLS_COUNT
    );
    renderWinner(winner, wonTitle);
    buttonsController(gameState, undoButton[0], redoButton[0]);
    saveGameState(gameState);
  });
});

function getWinner(
  field,
  cell,
  leftDiagonalCheckFunction,
  rightDiagonalCheckFunction,
  rowCheckFunction,
  colCheckFunction,
  drawCheckFunction,
  rowsCount,
  colsCount
) {
  let leftDiagonalWin = leftDiagonalCheckFunction(field, cell);
  let rightDiagonalWin = rightDiagonalCheckFunction(field, cell);
  let rowWin = rowCheckFunction(field, cell);
  let colWin = colCheckFunction(field, cell);
  let draw = drawCheckFunction(field, rowsCount, colsCount);

  if (leftDiagonalWin.winner) {
    return { winner: leftDiagonalWin.winner, cells: leftDiagonalWin.cells };
  } else if (rightDiagonalWin.winner) {
    return { winner: rightDiagonalWin.winner, cells: rightDiagonalWin.cells };
  } else if (rowWin.winner) {
    return { winner: rowWin.winner, cells: rowWin.cells };
  } else if (colWin.winner) {
    return { winner: colWin.winner, cells: colWin.cells };
  } else if (draw.winner) {
    return { winner: draw.winner };
  } else {
    return { winner: "" };
  }
}

function checkLeftDiagonal(field, cell) {
  let rowCoordinate = parseInt(cell.cellId[2]),
    colCoordinate = parseInt(cell.cellId[3]);

  if (rowCoordinate !== colCoordinate) {
    return { winner: "" };
  }

  let winningCells = [];

  for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
    let iterableCell = field.querySelector(`#c-${a}${a}`);

    if (iterableCell.className !== cell.cellClassName) {
      return { winner: "" };
    }
    winningCells.push(iterableCell);
  }
  return { winner: "diagonal-right", cells: winningCells };
}

function checkRightDiagonal(field, cell) {
  let rowCoordinate = parseInt(cell.cellId[2]),
    colCoordinate = parseInt(cell.cellId[3]);

  if (colCoordinate !== generateField.COLS_COUNT - 1 - rowCoordinate) {
    return { victory: false };
  }

  let winningCells = [];

  for (let a = 0; a < generateField.COLS_COUNT; a += 1) {
    let iterableCell = field.querySelector(
      `#c-${a}${generateField.COLS_COUNT - 1 - a}`
    );
    if (iterableCell.className !== cell.cellClassName) {
      return { winner: "" };
    }
    winningCells.push(iterableCell);
  }
  return { winner: "diagonal-left", cells: winningCells };
}

function checkCurrentRow(field, cell) {
  let rowCoordinate = parseInt(cell.cellId[2]),
    winningCells = [];

  for (let a = 0; a < generateField.COLS_COUNT; a += 1) {
    let iterableCell = field.querySelector(`#c-${rowCoordinate}${a}`);
    if (iterableCell.className !== cell.cellClassName) {
      return { winner: "" };
    }
    winningCells.push(iterableCell);
  }
  return { winner: "horizontal", cells: winningCells };
}

function checkCurrentCol(field, cell) {
  let colCoordinate = parseInt(cell.cellId[3]),
    winningCells = [];

  for (let a = 0; a < generateField.ROWS_COUNT; a += 1) {
    let iterableCell = field.querySelector(`#c-${a}${colCoordinate}`);

    if (iterableCell.className !== cell.cellClassName) {
      return { winner: "" };
    }
    winningCells.push(iterableCell);
  }
  return { winner: "vertical", cells: winningCells };
}

function checkDraw(field, rowsCount, colsCount) {
  for (let row = 0; row < rowsCount; row += 1) {
    for (let col = 0; col < colsCount; col += 1) {
      let cell = field.querySelector(`#c-${row}${col}`);
      if (cell.className === "cell") {
        return { winner: "" };
      }
    }
  }
  return { winner: "draw" };
}

function loadGameState() {
  let moves = JSON.parse(localStorage.getItem("moves"));

  if (!moves) {
    moves = [];
  }

  let movesCounter = JSON.parse(localStorage.getItem("movesCounter"));
  if (!movesCounter) {
    movesCounter = 0;
  }
  return {
    moves: moves,
    movesCounter: movesCounter,
  };
}

function saveGameState(gameState) {
  localStorage.setItem("moves", JSON.stringify(gameState.moves));
  localStorage.setItem("movesCounter", JSON.stringify(gameState.movesCounter));
}

function renderBattleField(gameState, field) {
  for (let move = 0; move < gameState.movesCounter; move += 1) {
    let cell = field.querySelector(`#${gameState.moves[move].cellId}`);
    cell.className = gameState.moves[move].cellClassName;
  }
}

function renderWinner(object, wonTitle) {
  if (!object.winner) {
    return;
  }

  let wonMessage = wonTitle[0].querySelector(".won-message");

  if (object.winner === "draw") {
    wonMessage.innerText = `It's a draw!`;
    wonTitle[0].classList.remove("hidden");
    return;
  }
  object.cells[0].className === "cell ch"
    ? (wonMessage.innerText = "Crosses won!")
    : (wonMessage.innerText = "Toes won!");

  for (let cell of object.cells) {
    cell.classList.add("win", object.winner);
  }

  wonTitle[0].classList.remove("hidden");
}

function buttonsController(gameState, undoButton, redoButton) {
  if (gameState.movesCounter === 0 && gameState.moves.length === 0) {
    undoButton.disabled = true;
    redoButton.disabled = true;
  } else if (gameState.movesCounter === gameState.moves.length) {
    undoButton.disabled = false;
    redoButton.disabled = true;
  } else if (
    gameState.movesCounter < gameState.moves.length &&
    gameState.movesCounter > 0
  ) {
    undoButton.disabled = false;
    redoButton.disabled = false;
  } else if (
    gameState.movesCounter < gameState.moves.length &&
    gameState.movesCounter === 0
  ) {
    undoButton.disabled = true;
    redoButton.disabled = false;
  }
}

function clearBattleField(rowsCount, colsCount, field) {
  for (let row = 0; row < rowsCount; row += 1) {
    for (let col = 0; col < colsCount; col += 1) {
      let cell = field.querySelector(`#c-${row}${col}`);
      cell.className = "cell";
    }
  }
}
