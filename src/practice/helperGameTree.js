async function refocusGameTree(treeCanvas, currentX, currentY, gainX, gainY) {
  let newX = currentX;
  let newY = currentY;

  gainX /= 25;
  gainY /= 25;

  for (let i = 0; i < 25; i++) {
    if (!treeCanvas) return;
    newX -= gainX;
    newY -= gainY;
    treeCanvas.setAttribute("transform", `translate(${newX}, ${newY})`);
    await new Promise((r) => setTimeout(r, 25));
  }
}

export { refocusGameTree };
