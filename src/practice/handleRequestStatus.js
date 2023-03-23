async function handleWaiting(requestStatusIndicator, instructionInterval) {
  requestStatusIndicator.classList.remove("fadeIn");
  requestStatusIndicator.classList.add("fadeOut");
  if (instructionInterval) clearInterval(instructionInterval);
  instructionInterval = setInterval(() => {
    if (requestStatusIndicator) {
      requestStatusIndicator.classList.remove("fadeOut");
      requestStatusIndicator.classList.add("fadeIn");
      requestStatusIndicator.textContent =
        "Requested calculation is pending... Please wait...";
      requestStatusIndicator.setAttribute("fill", "#fff");
      clearInterval(instructionInterval);
    }
  }, 312.5);
}

async function handleRunning(
  requestStatusIndicator,
  instructionInterval,
  turn,
  maximizerColor,
  minimizerColor,
) {
  if (instructionInterval) clearInterval(instructionInterval);
  if (
    requestStatusIndicator.textContent ==
      "Requested calculation is too computationally expensive!" ||
    requestStatusIndicator.textContent ==
      "Requested calculation is pending... Please wait..."
  ) {
    requestStatusIndicator.classList.remove("fadeIn");
    requestStatusIndicator.classList.add("fadeOut");
    if (turn == "Maximizer") {
      instructionInterval = setInterval(() => {
        if (requestStatusIndicator) {
          requestStatusIndicator.classList.remove("fadeOut");
          requestStatusIndicator.classList.add("fadeIn");
          requestStatusIndicator.textContent = "Maximizer's turn";
          requestStatusIndicator.setAttribute("fill", maximizerColor);
          clearInterval(instructionInterval);
        }
      }, 312.5);
    }
    if (turn == "Minimizer") {
      instructionInterval = setInterval(() => {
        if (requestStatusIndicator) {
          requestStatusIndicator.classList.remove("fadeOut");
          requestStatusIndicator.classList.add("fadeIn");
          requestStatusIndicator.textContent = "Minimizer's turn";
          requestStatusIndicator.setAttribute("fill", minimizerColor);
          clearInterval(instructionInterval);
        }
      }, 312.5);
    }
  } else {
    instructionInterval = setInterval(() => {
      if (requestStatusIndicator) {
        requestStatusIndicator.classList.remove("fadeOut");
        requestStatusIndicator.classList.add("fadeIn");
        clearInterval(instructionInterval);
      }
    }, 312.5);
  }
}

async function handleTimeout(
  requestStatusIndicator,
  instructionInterval,
  waitingIndicator,
  evaluatedNodesIndicator,
) {
  waitingIndicator.classList.remove("fadeIn");
  waitingIndicator.classList.add("fadeOut");

  evaluatedNodesIndicator.classList.remove("fadeOut");
  evaluatedNodesIndicator.classList.add("fadeIn");
  evaluatedNodesIndicator.textContent = "Evaluated nodes: ...";

  requestStatusIndicator.classList.remove("fadeIn");
  requestStatusIndicator.classList.add("fadeOut");
  if (instructionInterval) clearInterval(instructionInterval);
  instructionInterval = setInterval(() => {
    if (requestStatusIndicator) {
      requestStatusIndicator.classList.remove("fadeOut");
      requestStatusIndicator.classList.add("fadeIn");
      requestStatusIndicator.textContent =
        "Requested calculation is too computationally expensive!";
      requestStatusIndicator.setAttribute("fill", "#fff");
      clearInterval(instructionInterval);
    }
  }, 312.5);
}

async function handleComplete(
  requestStatusIndicator,
  instructionInterval,
  waitingIndicator,
  evaluatedNodesIndicator,
  turn,
  message,
  getEvaluationsPromiseResolve,
  maximizerColor,
  minimizerColor,
) {
  waitingIndicator.classList.remove("fadeIn");
  waitingIndicator.classList.add("fadeOut");

  if (instructionInterval) clearInterval(instructionInterval);
  if (
    requestStatusIndicator.textContent ==
      "Requested calculation is too computationally expensive!" ||
    requestStatusIndicator.textContent ==
      "Requested calculation is pending... Please wait..."
  ) {
    requestStatusIndicator.classList.remove("fadeIn");
    requestStatusIndicator.classList.add("fadeOut");
    if (turn == "Maximizer") {
      instructionInterval = setInterval(() => {
        if (requestStatusIndicator) {
          requestStatusIndicator.classList.remove("fadeOut");
          requestStatusIndicator.classList.add("fadeIn");
          requestStatusIndicator.textContent = "Maximizer's turn";
          requestStatusIndicator.setAttribute("fill", maximizerColor);
          clearInterval(instructionInterval);
        }
      }, 312.5);
    }
    if (turn == "Minimizer") {
      instructionInterval = setInterval(() => {
        if (requestStatusIndicator) {
          requestStatusIndicator.classList.remove("fadeOut");
          requestStatusIndicator.classList.add("fadeIn");
          requestStatusIndicator.textContent = "Minimizer's turn";
          requestStatusIndicator.setAttribute("fill", minimizerColor);
          clearInterval(instructionInterval);
        }
      }, 312.5);
    }
  } else {
    instructionInterval = setInterval(() => {
      if (requestStatusIndicator) {
        requestStatusIndicator.classList.remove("fadeOut");
        requestStatusIndicator.classList.add("fadeIn");
        clearInterval(instructionInterval);
      }
    }, 312.5);
  }

  const evaluationNodes = document.getElementsByClassName("evaluationNode");
  const evaluations = message.evaluations;
  let i = evaluationNodes.length;
  let j = 1;
  while (evaluations.length - j >= 0) {
    i--;
    evaluationNodes[i].textContent = evaluations[evaluations.length - j];
    j++;
  }

  evaluatedNodesIndicator.classList.remove("fadeOut");
  evaluatedNodesIndicator.classList.add("fadeIn");
  evaluatedNodesIndicator.textContent = `Evaluated nodes: ${message.evaluated_nodes.toLocaleString()}`;

  getEvaluationsPromiseResolve(evaluations);
}

export { handleWaiting, handleRunning, handleTimeout, handleComplete };
