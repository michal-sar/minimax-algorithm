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

function getTicTacToeEvaluation(n) {
  if (checkTicTacToeVictory(n)) {
    if (
      n.filter((tile) => tile == "x").length ==
      n.filter((tile) => tile == "o").length
    )
      return -1;
    else return 1;
  }

  if (!n.some((tile) => tile == null)) return 0;

  const winningPatterns = [
    [n[0], n[1], n[2]],
    [n[3], n[4], n[5]],
    [n[6], n[7], n[8]],
    [n[0], n[3], n[6]],
    [n[1], n[4], n[7]],
    [n[2], n[5], n[8]],
    [n[0], n[4], n[8]],
    [n[2], n[4], n[6]],
  ];
  let h = 0;
  for (const pattern of winningPatterns) {
    if (
      (pattern[0] == "x" && pattern[0] == pattern[1]) ||
      (pattern[0] == "x" && pattern[0] == pattern[2]) ||
      (pattern[1] == "x" && pattern[1] == pattern[2])
    )
      h += 0.15;
    if (
      (pattern[0] == "o" && pattern[0] == pattern[1]) ||
      (pattern[0] == "o" && pattern[0] == pattern[2]) ||
      (pattern[1] == "o" && pattern[1] == pattern[2])
    )
      h -= 0.15;
  }
  return h == 0 ? h : h.toFixed(2);
}

export {
  checkTicTacToeVictory,
  getRandomTicTacToeState,
  getTicTacToeEvaluation,
};
