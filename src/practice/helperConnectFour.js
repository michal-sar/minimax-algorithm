function checkConnectFourVictory(board, col) {
  const row = board[col].length - 1;

  const colRangeStart = Math.max(0, col - 3);
  const colRangeEnd = Math.min(6, col + 3);
  const rowRangeStart = Math.max(0, row - 3);
  const rowRangeEnd = Math.min(5, row + 3);

  let rowTemp, colTemp;

  if (
    row >= 3 &&
    board[col][row] == board[col][row - 1] &&
    board[col][row] == board[col][row - 2] &&
    board[col][row] == board[col][row - 3]
  )
    return true;

  let count = 0;
  for (colTemp = colRangeStart; colTemp <= colRangeEnd; colTemp++) {
    if (board[col][row] == board[colTemp][row]) {
      count++;
      if (count == 4) return true;
    } else count = 0;
  }

  count = 0;
  colTemp = col;
  rowTemp = row;
  while (colTemp > colRangeStart && rowTemp < rowRangeEnd) {
    colTemp--;
    rowTemp++;
  }
  while (colTemp <= colRangeEnd && rowTemp >= rowRangeStart) {
    if (board[colTemp][rowTemp] == board[col][row]) {
      count++;
      if (count == 4) {
        return true;
      }
    } else {
      count = 0;
    }
    colTemp++;
    rowTemp--;
  }

  count = 0;
  colTemp = col;
  rowTemp = row;
  while (colTemp < colRangeEnd && rowTemp < rowRangeEnd) {
    colTemp++;
    rowTemp++;
  }
  while (colTemp >= colRangeStart && rowTemp >= rowRangeStart) {
    if (board[colTemp][rowTemp] == board[col][row]) {
      count++;
      if (count == 4) {
        return true;
      }
    } else {
      count = 0;
    }
    colTemp--;
    rowTemp--;
  }

  return false;
}

function getRandomConnectFourState() {
  let randomBoard = new Array(7);
  for (let i = 0; i < randomBoard.length; i++) {
    randomBoard[i] = new Array();
  }
  const limit = Math.ceil(Math.random() * 42);
  let moves = 0;
  while (moves < limit) {
    let move;
    do {
      move = Math.floor(Math.random() * 7);
    } while (randomBoard[move].length == 6);
    if (moves % 2)
      randomBoard[move][randomBoard[move].filter((tile) => tile).length] = "r";
    else
      randomBoard[move][randomBoard[move].filter((tile) => tile).length] = "y";
    moves++;
    if (checkConnectFourVictory(randomBoard, move)) break;
  }
  return randomBoard;
}

async function getConnectFourEstimation(connectFourEstimation, n) {
  for (let i = 0; i < 7; i++) {
    if (n[i][0] && checkConnectFourVictory(n, i)) {
      let yellowTokens = 0;
      let redTokens = 0;
      for (let j = 0; j < 7; j++) {
        let k = 0;
        while (n[j][k]) {
          if (n[j][k] == "y") yellowTokens++;
          else redTokens++;
          k++;
        }
      }
      if (yellowTokens == redTokens) {
        connectFourEstimation.textContent = "H(n) = -1";
        return;
      } else {
        connectFourEstimation.textContent = "H(n) = 1";
        return;
      }
    }
  }

  if (
    !(
      !n[0][5] ||
      !n[1][5] ||
      !n[2][5] ||
      !n[3][5] ||
      !n[4][5] ||
      !n[5][5] ||
      !n[6][5]
    )
  ) {
    connectFourEstimation.textContent = "H(n) = 0";
    return;
  }

  connectFourEstimation.textContent = "H(n) = ...";
  let h = 0;
  let state = "";
  for (let i = 0; i < 7; i++) {
    let j = 0;
    while (n[i][j]) {
      state += n[i][j];
      j++;
    }
    if (i < 6) state += ",";
  }
  await fetch(
    `https://minimax-algorithm.pagekite.me/heuristic_function_connect_four/${state}`,
  )
    .then((response) => response.json())
    .then((data) => {
      h = data.estimation;
      connectFourEstimation.textContent = `H(n) = ${h.toFixed(2)}`;
    })
    .catch(() => {
      connectFourEstimation.textContent = "You're offline...";
    });
}

export {
  checkConnectFourVictory,
  getRandomConnectFourState,
  getConnectFourEstimation,
};
