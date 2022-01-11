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
      let row = grid[y + i * ys];
      if (row != null && row[x + i * xs] != null) {
        let cell = row[x + i * xs];
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

  // Set up the basics of next- and prev-cell
  // TODO: this isn't quite right. we should go to the next cell in the word,
  // not just the next cell down, but that means we have to handle not being in a
  // down-word
  let previousCellDown = null;
  for (let x = 0; x < gridSize; x++) {
    for (let y = 0; y < gridSize; y++) {
      let cell = grid[y][x];
      if (cell.chars.size) {
        if (previousCellDown) {
          previousCellDown.nextCellDown = cell;
          cell.previousCellDown = previousCellDown;
        }
        previousCellDown = cell;
      }
    }
  }

  // if this is the first cell down in a word, the previous cell isn't the one
  // right before it! it's the last cell of the previous word in the wordlist.
  // the next cell down after the last cell in a word is also the next word
  let prevWordDown = null;
  let firstWordDown = null;
  wordList.forEach((item) => {
    if (item.direction === 'y') {
      let cell = grid[item.y][item.x];
      if (prevWordDown) {
        let lastCellOfPrevWord =
          grid[prevWordDown.y + prevWordDown.word.length - 1][prevWordDown.x];
        cell.previousCellDown = lastCellOfPrevWord;

        // last cell of the prev word links to the first cell of this word
        lastCellOfPrevWord.nextCellDown = grid[item.y][item.x];
      } else {
        firstWordDown = item;
      }
      prevWordDown = item;
    }
  });

  // tie up the ends:
  if (firstWordDown) {
    let firstCellDown = grid[firstWordDown.y][firstWordDown.x];
    let lastCellDown =
      grid[prevWordDown.y + prevWordDown.word.length - 1][prevWordDown.x];
    // set the first cell's prev to wrap around to the last word
    firstCellDown.previousCellDown = lastCellDown;
    // set the last cell's next to wrap around to the first word
    lastCellDown.nextCellDown = firstCellDown;
  }

  return grid;
}
