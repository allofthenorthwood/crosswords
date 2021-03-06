import { useEffect, useMemo, useState, useRef } from 'react';
import styled from 'styled-components';
import { sortBy, uniq } from 'lodash';

import ClueList from './ClueList';
import { buildGridFromWordList } from './GridModel';
//import wordDictionary from './words';

function usePreventWindowUnload(preventDefault) {
  useEffect(() => {
    window.onbeforeunload = null;

    if (preventDefault) {
      window.onbeforeunload = function () {
        return true;
      };
    }
  }, [preventDefault]);
}

function handleShortcutKeys(draftDirection, setDraftDirection, setDraftWord) {
  let swapDraftDirection = () => {
    setDraftDirection(draftDirection === 'x' ? 'y' : 'x');
  };
  function handleKeyDown(e) {
    if (e.code === 'Enter') {
      e.preventDefault();
      swapDraftDirection();
    }
    if (setDraftWord) {
      if (e.code === 'Escape') {
        e.preventDefault();
        setDraftWord('');
      }
    }
  }
  document.body.addEventListener('keydown', handleKeyDown);
  return () => document.body.removeEventListener('keydown', handleKeyDown);
}

function DraftDirectionButtons({ draftDirection, setDraftDirection }) {
  return (
    <Buttons>
      <Button
        onClick={() => setDraftDirection('x')}
        selected={draftDirection === 'x'}
        leftMost={true}
        unclickable={draftDirection === 'x'}
      >
        Across {'\u2794'}
      </Button>
      <Button
        onClick={() => setDraftDirection('y')}
        rightMost={true}
        selected={draftDirection === 'y'}
        unclickable={draftDirection === 'y'}
      >
        Down <Rotate>{'\u2794'}</Rotate>
      </Button>
      <Hint>
        <HintText>Swap with Enter</HintText>
        <Key val={'enter'}>{'\u23CE'}</Key>
      </Hint>
    </Buttons>
  );
}

function SavedWordLists({
  selected,
  wordLists,
  select,
  remove,
  duplicate,
  children,
}) {
  return (
    <SavedLists>
      {wordLists.map((wordList, idx) => {
        return (
          <SavedListItem
            key={idx}
            onClick={() => {
              if (selected !== idx) {
                select(idx);
              }
            }}
            selected={selected === idx}
          >
            Crossword #{idx} ({wordList.length} word
            {wordList.length === 1 ? '' : 's'})
            {selected === idx && (
              <>
                <TextButton
                  onClick={(e) => {
                    e.stopPropagation();
                    let url = new URL(window.location.href);
                    url.hash = `#${btoa(JSON.stringify(wordList))}`;
                    navigator.clipboard.writeText(url);
                  }}
                >
                  (Copy URL)
                </TextButton>
                <TextButton
                  onClick={(e) => {
                    e.stopPropagation();
                    remove(idx);
                  }}
                >
                  (Delete)
                </TextButton>
                <TextButton
                  onClick={(e) => {
                    e.stopPropagation();
                    duplicate(idx);
                  }}
                >
                  (Duplicate)
                </TextButton>
              </>
            )}
          </SavedListItem>
        );
      })}
      {children}
    </SavedLists>
  );
}

function EditorToolbar({
  inputRef,
  gridSize,
  draftWord,
  setDraftWord,
  draftDirection,
  setDraftDirection,
  currentlySaved,
  saveWordList,
}) {
  let validateWordInput = (e) => {
    e.target.value = e.target.value
      .replace(/[^\w?]/g, '')
      .replace(/[_]/g, '')
      .toUpperCase();
    setDraftWord(e.target.value);
  };

  return (
    <Toolbar>
      <ToolbarSection>
        <WordInputWrapper>
          <WordInput
            value={draftWord}
            onChange={(e) => validateWordInput(e)}
            placeholder={'Enter a new word...'}
            ref={inputRef}
          />
          <WordInputCounter
            error={draftWord.length > gridSize}
            empty={draftWord.length === 0}
          >
            {draftWord.length}
          </WordInputCounter>
        </WordInputWrapper>
        <Hint>
          <HintText>Clear with Escape</HintText>
          <Key>ESC</Key>
        </Hint>
      </ToolbarSection>
      <DraftDirectionButtons
        setDraftDirection={setDraftDirection}
        draftDirection={draftDirection}
      />
      <Buttons minWidth={'100px'}>
        <Button
          onClick={saveWordList}
          fullWidth={true}
          unclickable={currentlySaved}
        >
          Save
        </Button>
        <Hint>
          <HintText>{currentlySaved ? '??? Saved' : '??? Unsaved'}</HintText>
        </Hint>
      </Buttons>
    </Toolbar>
  );
}

function EditableCrosswordGrid({
  draftWord,
  draftDirection,
  removeWord,
  commitWord,
  grid,
}) {
  let [candidatePosition, setCandidatePosition] = useState(null);

  // Is there a word starting here? (Preferably, one in the right direction.)
  let wordHere = null;
  if (candidatePosition) {
    let { x, y } = candidatePosition;
    let wordHereAcross = grid[y][x].wordHereAcross;
    let wordHereDown = grid[y][x].wordHereDown;
    wordHere =
      draftDirection === 'x'
        ? wordHereAcross ?? wordHereDown
        : wordHereDown ?? wordHereAcross;
  }

  let modifiableWordItem, canCommitDraftWord;
  if (draftWord) {
    // Making a new word. We can't commit if there's already a word here in the
    // same direction.
    modifiableWordItem = null;
    canCommitDraftWord = !wordHere || wordHere.direction !== draftDirection;
  } else {
    // If we're hovering over a word, we can edit it.
    modifiableWordItem = wordHere;
    canCommitDraftWord = false;
  }

  let handleMouseEnter = (x, y) => {
    setCandidatePosition({ x, y });
  };
  let handleMouseLeave = () => {
    setCandidatePosition(null);
  };
  return (
    <GridContainer>
      <Grid>
        {grid.map((row, y) => {
          return (
            <GridRow key={y}>
              {row.map((cell, x) => {
                let { chars, allWordsHere } = cell;

                function getCharFromWord({ word, direction, x: wx, y: wy }) {
                  let chars = [...word];
                  if (direction === 'x' && wy === y) {
                    return chars[x - wx];
                  } else if (direction === 'y' && wx === x) {
                    return chars[y - wy];
                  }
                }

                let modifiableIsHere = false;
                let draftChar = '';
                if (allWordsHere.has(modifiableWordItem)) {
                  modifiableIsHere = true;
                  draftChar = getCharFromWord(modifiableWordItem);
                }
                if (candidatePosition) {
                  draftChar =
                    getCharFromWord({
                      word: draftWord,
                      direction: draftDirection,
                      x: candidatePosition.x,
                      y: candidatePosition.y,
                    }) || '';
                }

                return (
                  <GridCell
                    key={x}
                    onMouseEnter={() => handleMouseEnter(x, y)}
                    onMouseLeave={() => handleMouseLeave(x, y)}
                    interactable={canCommitDraftWord || modifiableIsHere}
                    placeable={draftWord.length > 0 && canCommitDraftWord}
                    holdingWord={draftWord.length > 0}
                    modifiable={modifiableIsHere}
                    hover={modifiableIsHere && !draftWord.length}
                    hasLetter={chars.size || draftChar}
                    onClick={() => {
                      if (modifiableWordItem) {
                        removeWord(modifiableWordItem);
                      } else if (canCommitDraftWord) {
                        commitWord(x, y);
                      }
                    }}
                  >
                    <GridCellContents>
                      <GridCellNumber>{grid[y][x].cellNumber}</GridCellNumber>
                      {uniq([...sortBy([...chars]), ...draftChar]).map((c) => {
                        return (
                          <GridCellChar
                            error={
                              chars.size > 1 ||
                              (chars.size > 0 &&
                                c === draftChar &&
                                !chars.has(draftChar))
                            }
                            draft={c === draftChar}
                            key={c}
                          >
                            {c}
                          </GridCellChar>
                        );
                      })}
                    </GridCellContents>
                  </GridCell>
                );
              })}
            </GridRow>
          );
        })}
      </Grid>
    </GridContainer>
  );
}

function PlayableCrosswordGrid({
  draftDirection,
  grid,
  updateAssociatedClue,
  curCell,
  gridRef,
  showIncorrect,
  showAnswers,
}) {
  let [gridInputs, setGridInputs] = useState(
    Array.from({ length: 20 }, () => Array.from({ length: 20 }, () => ''))
  );
  let handleUnFocus = () => {
    updateAssociatedClue(null);
  };
  let handleFocus = (x, y, cell) => {
    handleUnFocus();
    if (cell) {
      updateAssociatedClue(cell);
    }
  };

  let updateGridInputs = (x, y, val) => {
    let copyGridInputs = [...gridInputs];
    copyGridInputs[x][y] = val;
    setGridInputs(copyGridInputs);
  };

  // get the FIRST word found for each direction. There can technically be more,
  // but that's not a valid crossword in the traditional sense.
  let wordHere = null;
  if (curCell) {
    for (const e of curCell.allWordsHere) {
      if (e.direction === draftDirection) {
        wordHere = e;
        break;
      }
    }
  }

  function handleChange(e, x, y) {
    const input = e.target;
    const { value, selectionStart } = input;

    // TODO: better unicode support
    let char = value.charAt(selectionStart - 1);
    if (/[\w]/.test(char)) {
      let newVal = char.toUpperCase();
      e.target.value = newVal;
      updateGridInputs(x, y, newVal);

      // Get the next input field
      let thisCell = grid[y][x];
      let nextCell =
        draftDirection === 'x'
          ? thisCell.nextCellAcross
          : thisCell.nextCellDown;
      let nextSibling = gridRef.current.querySelector(
        `[name="cellinput-${nextCell.x}-${nextCell.y}"]`
      );

      // If found, focus the next field
      if (nextSibling !== null) {
        nextSibling.focus();
        nextSibling.selectionStart = nextSibling.selectionEnd = 0;
      }
    } else {
      e.target.value = '';
      updateGridInputs(x, y, '');
    }
  }

  function handleKeyDown(e, x, y) {
    if (e.key === 'Backspace') {
      handleBackspace(e, x, y);
    }
    if (e.key === 'ArrowLeft') {
      moveOneCell(x, y, 'x', true);
    }
    if (e.key === 'ArrowRight') {
      moveOneCell(x, y, 'x', false);
    }
    if (e.key === 'ArrowUp') {
      moveOneCell(x, y, 'y', true);
    }
    if (e.key === 'ArrowDown') {
      moveOneCell(x, y, 'y', false);
    }
  }

  function moveOneCell(x, y, dir, backwards) {
    let thisCell = grid[y][x];
    let targetCell = null;

    if (backwards) {
      targetCell =
        dir === 'x' ? thisCell.previousCellAcross : thisCell.previousCellDown;
    } else {
      targetCell =
        dir === 'x' ? thisCell.nextCellAcross : thisCell.nextCellDown;
    }
    let targetSibling = gridRef.current.querySelector(
      `[name="cellinput-${targetCell.x}-${targetCell.y}"]`
    );

    if (targetSibling !== null) {
      targetSibling.focus();
    }
    return targetSibling;
  }

  function handleBackspace(e, x, y) {
    const { value } = e.target;
    if (value.length !== 0) {
      // Allow normal backspace
      e.target.value = '';
      updateGridInputs(x, y, '');
      return;
    }

    e.preventDefault();

    let prevSibling = moveOneCell(x, y, draftDirection, true);
    if (prevSibling) {
      prevSibling.value = prevSibling.value.slice(0, -1);
    }
  }

  return (
    <GridContainer>
      <Grid ref={gridRef}>
        {grid.map((row, y) => (
          <GridRow key={y}>
            {row.map((cell, x) => {
              let hasLetter = cell.chars.size > 0;
              let focusedWordHere = false;
              if (cell.allWordsHere.has(wordHere)) {
                focusedWordHere = true;
              }
              let cellVal = '';
              cell.chars.forEach((c) => (cellVal += c));
              return (
                <GridCell
                  key={x}
                  hasLetter={hasLetter}
                  inCurrentWord={focusedWordHere}
                >
                  <GridCellContents>
                    <GridCellNumber>{grid[y][x].cellNumber}</GridCellNumber>
                    {hasLetter > 0 && (
                      <GridCellInput
                        value={showAnswers ? cellVal : gridInputs[x][y]}
                        name={`cellinput-${x}-${y}`}
                        onChange={(e) => handleChange(e, x, y)}
                        onKeyDown={(e) => handleKeyDown(e, x, y)}
                        onFocus={() => handleFocus(x, y, cell)}
                        showAnswers={showIncorrect || showAnswers}
                        correct={gridInputs[x][y] === cellVal}
                        empty={gridInputs[x][y] === ''}
                      />
                    )}
                  </GridCellContents>
                </GridCell>
              );
            })}
          </GridRow>
        ))}
      </Grid>
    </GridContainer>
  );
}

function useLocalStorageState(key, defaultValue) {
  let [value, setValue] = useState(() => {
    const saved = localStorage.getItem(key);
    const initialValue = JSON.parse(saved);
    return initialValue || defaultValue;
  });
  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value));
  }, [key, value]);
  return [value, setValue];
}

function EditorApp() {
  let inputRef = useRef(null);

  let [currentlySaved, setCurrentlySaved] = useState(true);

  let [draftDirection, setDraftDirection] = useState('x');
  let [draftWord, setDraftWord] = useState('');
  let [draftClue, setDraftClue] = useState('');

  let [wordList, setWordList] = useLocalStorageState('wordList', []);

  // TODO: change wordlists to an object where the keys are unique timestamps etc,
  // instead of using an array, so you can have titles for each crossword and links
  // to them, etc
  let [currentWordListIdx, setCurrentWordListIdx] = useLocalStorageState(
    'currentWordListIdx',
    0
  );
  let [savedWordLists, setSavedWordLists] = useLocalStorageState(
    'savedWordLists',
    []
  );

  usePreventWindowUnload(!currentlySaved);

  let saveWordList = () => {
    setCurrentlySaved(true);
    setSavedWordLists((prevSavedWordLists) => {
      if (prevSavedWordLists[currentWordListIdx]) {
        return prevSavedWordLists.map((prevList, idx) => {
          return idx === currentWordListIdx ? wordList : prevList;
        });
      } else {
        return [...prevSavedWordLists, []];
      }
    });
  };

  useEffect(() => {
    return handleShortcutKeys(draftDirection, setDraftDirection, setDraftWord);
  }, [draftDirection]);

  useEffect(() => {
    if (!savedWordLists[currentWordListIdx]) {
      setCurrentlySaved(true);
      setSavedWordLists((prevSavedWordLists) => {
        return [...prevSavedWordLists, []];
      });
      setWordList([]);
    } else {
      setWordList(savedWordLists[currentWordListIdx]);
    }
  }, [savedWordLists, currentWordListIdx, setWordList, setSavedWordLists]);

  let updateClue = (wordItem, clue) => {
    updateWordList((prevWordList) => {
      return sortBy(
        prevWordList.map((item) =>
          item.word === wordItem.word &&
          item.x === wordItem.x &&
          item.y === wordItem.y
            ? { ...item, clue }
            : item
        ),
        (item) => item.y,
        (item) => item.x
      );
    });
  };

  let addWord = (x, y, direction, word, clue) => {
    updateWordList((prevWordList) => {
      return sortBy(
        [...prevWordList, { x, y, direction, word, clue }],
        (item) => item.y,
        (item) => item.x
      );
    });
  };

  let newWordList = () => {
    selectWordList(savedWordLists.length);
  };

  let selectWordList = (listIdx) => {
    if (!currentlySaved) {
      alert('You have unsaved changes');
    } else {
      setCurrentWordListIdx(listIdx);
    }
  };

  let removeWordList = (idx) => {
    if (currentWordListIdx === idx) {
      // Remove the current wordlist
      setCurrentWordListIdx(0);
      setSavedWordLists((prevWordLists) => {
        return [
          ...prevWordLists.slice(0, idx),
          ...prevWordLists.slice(idx + 1),
        ];
      });
    } else {
      if (!currentlySaved) {
        alert('Please save before making changes');
      }
      // BUG: removing other wordlists will erase your unsaved data
    }
  };

  let duplicateWordList = (idx) => {
    if (currentWordListIdx === idx) {
      // Remove the current wordlist
      setCurrentWordListIdx(0);
      setSavedWordLists((prevWordLists) => {
        return [
          ...prevWordLists.slice(0, idx),
          ...prevWordLists.slice(idx, idx + 1),
          ...prevWordLists.slice(idx),
        ];
      });
    } else {
      if (!currentlySaved) {
        alert('Please save before making changes');
      }
    }
  };

  let updateWordList = (func) => {
    setCurrentlySaved(false);
    setWordList(func);
  };

  let gridSize = 15;
  let grid = useMemo(
    () => buildGridFromWordList(wordList, gridSize),
    [wordList, gridSize]
  );

  let commitWord = (x, y) => {
    addWord(x, y, draftDirection, draftWord, draftClue);
    setDraftWord('');
    setDraftClue('');
    inputRef.current.focus();
  };
  let removeWord = (wordItem) => {
    updateWordList(wordList.filter((item) => item !== wordItem));
    setDraftWord(wordItem.word);
    setDraftClue(wordItem.clue);
    setDraftDirection(wordItem.direction);
  };
  /*return <div>
    {wordDictionary.sort((a, b) => {return a.length - b.length}).map(w => {
      return <div key={w}>"{w}",</div>
    })}
  </div>;*/

  return (
    <Body>
      <EditorToolbar
        inputRef={inputRef}
        gridSize={gridSize}
        draftWord={draftWord}
        setDraftWord={setDraftWord}
        draftDirection={draftDirection}
        setDraftDirection={setDraftDirection}
        currentlySaved={currentlySaved}
        saveWordList={saveWordList}
      />
      <GridClueContainer>
        <EditableCrosswordGrid
          draftWord={draftWord}
          draftDirection={draftDirection}
          removeWord={removeWord}
          commitWord={commitWord}
          grid={grid}
        />
        <ClueList
          wordList={wordList}
          grid={grid}
          updateClue={updateClue}
          editable={true}
        />
      </GridClueContainer>
      <SavedWordLists
        wordLists={savedWordLists}
        selected={currentWordListIdx}
        saved={currentlySaved}
        select={selectWordList}
        remove={removeWordList}
        duplicate={duplicateWordList}
      >
        <Button onClick={newWordList}>New Crossword</Button>
      </SavedWordLists>
    </Body>
  );
}

function PlayerApp({ wordList, gridSize }) {
  let [draftDirection, setDraftDirection] = useState('x');
  let [showIncorrect, setShowIncorrect] = useState(false);
  let [showAnswers, setShowAnswers] = useState(false);
  let [curCell, setCurCell] = useState(null);
  let gridRef = useRef(null);
  let grid = useMemo(
    () => buildGridFromWordList(wordList, gridSize),
    [wordList, gridSize]
  );
  let updateAssociatedClue = (cell) => {
    setCurCell(cell);
  };

  useEffect(() => {
    return handleShortcutKeys(draftDirection, setDraftDirection, null);
  }, [draftDirection]);

  let onClueClick = (word) => {
    let targetWord = gridRef.current.querySelector(
      `[name="cellinput-${word.x}-${word.y}"]`
    );

    if (targetWord !== null) {
      targetWord.focus();
      setDraftDirection(word.direction);
    }
  };

  return (
    <Body>
      <Toolbar>
        <DraftDirectionButtons
          setDraftDirection={setDraftDirection}
          draftDirection={draftDirection}
        />
        <Buttons>
          <ShowAnswersButtons>
            <Button
              selected={showIncorrect}
              onClick={() => {
                setShowIncorrect(!showIncorrect);
              }}
            >
              Show Incorrect
            </Button>
            <Button
              selected={showAnswers}
              onClick={() => {
                setShowAnswers(!showAnswers);
              }}
            >
              Show Answers
            </Button>
          </ShowAnswersButtons>
        </Buttons>
      </Toolbar>

      <GridClueContainer>
        <PlayableCrosswordGrid
          draftDirection={draftDirection}
          grid={grid}
          updateAssociatedClue={updateAssociatedClue}
          curCell={curCell}
          gridRef={gridRef}
          showIncorrect={showIncorrect}
          showAnswers={showAnswers}
        />
        <ClueList
          wordList={wordList}
          grid={grid}
          editable={false}
          curCell={curCell}
          draftDirection={draftDirection}
          onClueClick={onClueClick}
        />
      </GridClueContainer>
    </Body>
  );
}

function useLocationHash() {
  let [hash, setHash] = useState(window.location.hash);
  useEffect(() => {
    function handleHashChange() {
      setHash(window.location.hash);
    }
    window.addEventListener('hashchange', handleHashChange);
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  return hash;
}

function App() {
  let hash = useLocationHash();

  if (hash) {
    const wordList = JSON.parse(atob(hash.slice(1)));
    let gridSize = 15;
    return <PlayerApp wordList={wordList} gridSize={gridSize} />;
  } else {
    return <EditorApp />;
  }
}

let Body = styled.div`
  font-size: 16px;
`;

let Toolbar = styled.div`
  display: flex;
  padding: 5px;
`;
let ToolbarSection = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
  flex-grow: 1;
`;
let WordInputWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: stretch;
`;
let wordInputRadius = '3px';
let WordInputCounter = styled.div`
  font-weight: bold;
  padding: 4px;
  width: 2em;
  background: #eee;
  border: 1px solid #999;
  border-radius: 0 ${wordInputRadius} ${wordInputRadius} 0;
  border-left: none;
  color: ${(props) => (props.error ? 'red' : props.empty ? '#ddd' : '#555')};
  display: flex;
  align-items: center;
  justify-content: center;
`;
let WordInput = styled.input`
  flex-grow: 1;
  padding: 6px 7px;
  letter-spacing: 3px;
  border-radius: ${wordInputRadius} 0 0 ${wordInputRadius};
  border: 1px solid #999;
  font-family: inherit;
  z-index: 2;
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #ccc;
    letter-spacing: initial;
  }
  :focus {
    border: 1px solid #1a8fbf;
    box-shadow: 0 0 1px 2px #1a8fbf;
    outline: none;
  }
`;

let Buttons = styled.div`
  text-align: center;
  margin-left: 10px;
  min-width: ${(props) => props.minWidth || 'none'};
`;
let ShowAnswersButtons = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  & > button {
    margin-bottom: 5px;
  }
`;
let Rotate = styled.span`
  transform: rotate(90deg);
  display: inline-block;
`;
let Button = styled.button`
  background: ${(props) =>
    props.selected ? '#4cc7f9' : props.unclickable ? '#ccc' : '#eee'};
  color: ${(props) =>
    props.selected ? 'black' : props.unclickable ? '#888' : 'black'};
  border: 1px solid ${(props) => (props.selected ? '#1a8fbf' : '#ccc')};
  width: ${(props) => (props.fullWidth ? '100%' : 'inherit')};
  border-radius: ${(props) =>
    props.rightMost
      ? '0 10px 10px 0'
      : props.leftMost
      ? '10px 0 0 10px'
      : '10px'};
  padding: 7px;
  cursor: ${(props) => (props.unclickable ? 'default' : 'pointer')};
  :hover {
    background: ${(props) =>
      props.selected ? '#4cc7f9' : props.unclickable ? '#ccc' : '#ddd'};
  }
`;

let Hint = styled.div`
  font-color: #999;
  padding: 5px;
  font-size: 0.5em;
  display: flex;
  align-items: center;
  justify-content: center;
`;
let HintText = styled.span`
  margin-right: 5px;
`;
let Key = styled.span`
  font-color: #999;
  padding: 3px 5px 10px ${(props) => (props.val === 'enter' ? '10px' : '5px')};
  display: inline-block;
  background: #eee;

  height: 0.5em;
  border: 1px solid #999;
  font-size: 1em;
  border-radius: 3px;
  vertical-align: middle;
`;

let GridClueContainer = styled.div`
  display: flex;
  align-items: stretch;
  @media (max-width: 680px) {
    flex-direction: column;
  }
`;

let GridContainer = styled.div`
  display: flex;
  justify-content: center;
`;
let Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: #7b7a87;
  border: 1px solid #7b7a87;
`;

let GridRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 1px;
`;

let GridCell = styled.div`
  cursor: ${(props) =>
    props.holdingWord && !props.placeable
      ? 'not-allowed'
      : props.holdingWord
      ? 'grabbing'
      : props.interactable
      ? 'grab'
      : 'default'};
  background: ${(props) =>
    props.inCurrentWord
      ? '#b8ebff'
      : props.modifiable && props.hover
      ? '#eee'
      : props.hasLetter
      ? '#fff'
      : 'black'};
`;

let GridCellContents = styled.div`
  width: 1.5em;
  height: 1.5em;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  box-sizing: border-box;
  justify-content: center;
  text-transform: uppercase;
`;

let GridCellChar = styled.div`
  color: ${(props) => (props.error ? 'red' : null)};
  font-weight: ${(props) => (props.draft ? 'bold' : '')};
  padding-top: 5px;
  width: 100%;
  box-sizing: border-box;
`;
let GridCellInput = styled.input`
  width: 100%;
  position: absolute;
  background: transparent;
  text-align: center;
  box-sizing: border-box;
  font-family: inherit;
  top: 0;
  left: 0;
  border: 0px;
  font-size: 1em;
  padding: 0;
  padding-top: 6px;
  caret-color: transparent;
  color: ${(props) =>
    props.showAnswers
      ? props.empty
        ? '#999'
        : props.correct
        ? 'blue'
        : 'red'
      : '#333'};

  :focus {
    outline: none;
    background: #4cc7f9;
  }
`;

let GridCellNumber = styled.span`
  position: absolute;
  top: 0px;
  left: 1px;
  font-size: 0.5em;
  z-index: 2;
`;

let SavedLists = styled.div`
  padding: 10px;
`;
let SavedListItem = styled.div`
  padding: 10px;
  background: ${(props) => (props.selected ? '#4cc7f9' : '#eee')};
  color: ${(props) => (props.selected ? 'black' : 'black')};
  border: 1px solid ${(props) => (props.selected ? '#1a8fbf' : '#eee')};
  cursor: ${(props) => (props.selected ? 'default' : 'pointer')};
  :hover {
    background: ${(props) => (props.selected ? '#4cc7f9' : '#ddd')};
  }
`;
let TextButton = styled.button`
  background: none;
  border: none;
  color: #1a8fbf;
  text-decoration: underline;
  cursor: pointer;
  padding: 0px 10px;
  :hover {
    color: #fff;
  }
`;

export default App;
