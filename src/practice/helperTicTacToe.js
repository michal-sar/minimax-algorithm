function checkTicTacToeVictory(board) {
  return (
    (board[0] && board[0] == board[1] && board[1] == board[2]) ||
    (board[3] && board[3] == board[4] && board[4] == board[5]) ||
    (board[6] && board[6] == board[7] && board[7] == board[8]) ||
    (board[0] && board[0] == board[3] && board[3] == board[6]) ||
    (board[1] && board[1] == board[4] && board[4] == board[7]) ||
    (board[2] && board[2] == board[5] && board[5] == board[8]) ||
    (board[0] && board[0] == board[4] && board[4] == board[8]) ||
    (board[2] && board[2] == board[4] && board[4] == board[6])
  );
}

function getRandomTicTacToeState() {
  let randomBoard = new Array(9).fill(null);
  const limit = Math.ceil(Math.random() * 9);
  let moves = 0;
  while (moves < limit) {
    let move;
    do {
      move = Math.floor(Math.random() * 9);
    } while (randomBoard[move]);
    if (moves % 2) randomBoard[move] = "o";
    else randomBoard[move] = "x";
    moves++;
    if (checkTicTacToeVictory(randomBoard)) break;
  }
  return randomBoard;
}

async function getTicTacToeEstimation(ticTacToeEstimation, n) {
  if (checkTicTacToeVictory(n)) {
    if (
      n.filter((tile) => tile == "x").length ==
      n.filter((tile) => tile == "o").length
    ) {
      ticTacToeEstimation.textContent = "H(n) = -1";
      return;
    } else {
      ticTacToeEstimation.textContent = "H(n) = 1";
      return;
    }
  }

  if (!n.some((tile) => tile == null)) {
    ticTacToeEstimation.textContent = "H(n) = 0";
    return;
  }

  ticTacToeEstimation.textContent = "H(n) = ...";
  let h = 0;
  let state = "";
  for (let i = 0; i < 9; i++) {
    if (n[i]) {
      state += n[i];
    } else state += "_";
  }
  await fetch(
    `https://minimax-algorithm.pagekite.me/heuristic_function_tic_tac_toe/${state}`,
  )
    .then((response) => response.json())
    .then((data) => {
      h = data.estimation;
      ticTacToeEstimation.textContent = `H(n) = ${h.toFixed(2)}`;
    })
    .catch(() => {
      ticTacToeEstimation.textContent = "You're offline...";
    });
}

export {
  checkTicTacToeVictory,
  getRandomTicTacToeState,
  getTicTacToeEstimation,
};
