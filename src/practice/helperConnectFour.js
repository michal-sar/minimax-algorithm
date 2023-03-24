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

function getConnectFourEvaluation(n) {
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
      if (yellowTokens == redTokens) return -1;
      else return 1;
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
  )
    return 0;

  let tokens = 0;
  let tokenMask = 0;
  for (let i = 0; i < 7; i++) {
    let j = 0;
    while (n[i][j]) {
      if (n[i][j] == "y") {
        tokens |= 1 << (i * 7 + j);
        tokenMask |= tokens;
      } else tokenMask |= 1 << (i * 7 + j);
      j++;
    }
  }
  // console.log(tokens.toString(2));
  // console.log(tokenMask.toString(2));
  let h = 0;
  let patternMask = (tokens | (tokens >>> 1)) & 137412980756383;
  patternMask &= patternMask >>> 2;
  h += patternMask.toString(2).split("1").length - 1;
  patternMask = (tokens | (tokens >>> 7)) & 2181708111807;
  patternMask &= patternMask >>> 14;
  h += patternMask.toString(2).split("1").length - 1;
  patternMask = (tokens | (tokens >>> 8)) & 1073538912159;
  patternMask &= patternMask >>> 16;
  h += patternMask.toString(2).split("1").length - 1;
  patternMask = (tokens | (tokens >>> 6)) & 2147077824318;
  patternMask &= patternMask >>> 12;
  h += patternMask.toString(2).split("1").length - 1;
  patternMask = tokens & (tokens >>> 1);
  patternMask |= patternMask >>> 2;
  patternMask &= 31028737590151;
  h += patternMask.toString(2).split("1").length - 1;
  patternMask = tokens & (tokens >>> 7);
  patternMask |= patternMask >>> 14;
  patternMask &= 133160895;
  h += patternMask.toString(2).split("1").length - 1;
  patternMask = tokens & (tokens >>> 8);
  patternMask |= patternMask >>> 16;
  patternMask &= 14795655;
  h += patternMask.toString(2).split("1").length - 1;
  patternMask = tokens & (tokens >>> 6);
  patternMask |= patternMask >>> 12;
  patternMask &= 118365240;
  h += patternMask.toString(2).split("1").length - 1;
  tokens = ~tokens & tokenMask;
  patternMask = (tokens | (tokens >>> 1)) & 137412980756383;
  patternMask &= patternMask >>> 2;
  h -= patternMask.toString(2).split("1").length - 1;
  patternMask = (tokens | (tokens >>> 7)) & 2181708111807;
  patternMask &= patternMask >>> 14;
  h -= patternMask.toString(2).split("1").length - 1;
  patternMask = (tokens | (tokens >>> 8)) & 1073538912159;
  patternMask &= patternMask >>> 16;
  h -= patternMask.toString(2).split("1").length - 1;
  patternMask = (tokens | (tokens >>> 6)) & 2147077824318;
  patternMask &= patternMask >>> 12;
  h -= patternMask.toString(2).split("1").length - 1;
  patternMask = tokens & (tokens >>> 1);
  patternMask |= patternMask >>> 2;
  patternMask &= 31028737590151;
  h -= patternMask.toString(2).split("1").length - 1;
  patternMask = tokens & (tokens >>> 7);
  patternMask |= patternMask >>> 14;
  patternMask &= 133160895;
  h -= patternMask.toString(2).split("1").length - 1;
  patternMask = tokens & (tokens >>> 8);
  patternMask |= patternMask >>> 16;
  patternMask &= 14795655;
  h -= patternMask.toString(2).split("1").length - 1;
  patternMask = tokens & (tokens >>> 6);
  patternMask |= patternMask >>> 12;
  patternMask &= 118365240;
  h -= patternMask.toString(2).split("1").length - 1;
  return 0.01 * h;
}

export {
  checkConnectFourVictory,
  getRandomConnectFourState,
  getConnectFourEvaluation,
};
