export function buildGridFromWordList(wordList, gridSize) {
  let grid = [];
  for (let y = 0; y < gridSize; y++) {
    let row = [];
    for (let x = 0; x < gridSize; x++) {
      row.push({
        x,
        y,

        chars: new Set(),
        cellNumber: null,
        wordHereAcross: null,
        wordHereDown: null,
        allWordsHere: new Set(),

        nextCellAcross: null,
        nextCellDown: null,
        previousCellAcross: null,
        previousCellDown: null,
      });
    }
    grid.push(row);
  }

  for (let item of wordList) {
    let { x, y, direction, word } = item;
    let xs = direction === 'x' ? 1 : 0;
    let ys = direction === 'y' ? 1 : 0;

    for (let i = 0; i < word.length; i++) {
      let cell = grid[y + i * ys][x + i * xs];
      if (i === 0) {
        if (direction === 'x') {
          cell.wordHereAcross = item;
        } else {
          cell.wordHereDown = item;
        }
      }
      cell.chars.add(word[i]);
      cell.allWordsHere.add(item);
    }
  }

  let nextCellNumber = 1;
  let firstCellAcross = null;
  let previousCellAcross = null;
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      let cell = grid[y][x];
      if (cell.wordHereAcross || cell.wordHereDown) {
        cell.cellNumber = nextCellNumber++;
      }
      if (cell.chars.size) {
        if (previousCellAcross) {
          previousCellAcross.nextCellAcross = cell;
          cell.previousCellAcross = previousCellAcross;
        } else {
          firstCellAcross = cell;
        }
        previousCellAcross = cell;
      }
    }
  }
  if (firstCellAcross) {
    firstCellAcross.previousCellAcross = previousCellAcross;
    previousCellAcross.nextCellAcross = firstCellAcross;
  }

  let firstCellDown = null;
  let previousCellDown = null;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let cell = grid[y][x];
      if (cell.chars.size) {
        if (previousCellDown) {
          previousCellDown.nextCellDown = cell;
          cell.previousCellDown = previousCellDown;
        } else {
          firstCellDown = cell;
        }
        previousCellDown = cell;
      }
    }
  }
  if (firstCellDown) {
    firstCellDown.previousCellDown = previousCellDown;
    previousCellDown.nextCellDown = firstCellDown;
  }

  return grid;
}
