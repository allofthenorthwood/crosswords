import './App.css';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { range, sortBy, uniq } from 'lodash';

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

function SavedWordLists({ selected, wordLists, select, remove, children }) {
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
              <TextButton
                onClick={(e) => {
                  e.stopPropagation();
                  remove(idx);
                }}
              >
                (Delete)
              </TextButton>
            )}
          </SavedListItem>
        );
      })}
      {children}
    </SavedLists>
  );
}
function ClueList({ title, clues, cellNumbers, updateClue }) {
  return (
    <ClueListSection>
      <ClueListTitle>{title}</ClueListTitle>
      {clues.map((item, idx) => (
        <ClueListItem key={idx}>
          <ClueNum>{cellNumbers.get(item.x + '-' + item.y)}</ClueNum>
          <ClueAnswer>{item.word}</ClueAnswer>
          <ClueInput
            value={item.clue}
            placeholder="[Clue needed]"
            onChange={(e) => updateClue(item, e.target.value)}
          />
        </ClueListItem>
      ))}
    </ClueListSection>
  );
}

function EditUI({
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
    e.target.value = e.target.value.replace(/[^\w]/g, '').toUpperCase();
    setDraftWord(e.target.value);
  };

  return (
    <UI>
      <WordUI>
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
      </WordUI>
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
      <Buttons minWidth={'100px'}>
        <Button
          onClick={saveWordList}
          fullWidth={true}
          unclickable={currentlySaved}
        >
          Save
        </Button>
        <Hint>
          <HintText>{currentlySaved ? '✔ Saved' : '✖ Unsaved'}</HintText>
        </Hint>
      </Buttons>
    </UI>
  );
}

function EditableCrossWordGrid({
  gridSize,
  wordList,
  modifiableWordItem,
  candidatePosition,
  draftWord,
  draftDirection,
  setCandidatePosition,
  canCommit,
  removeWord,
  commitWord,
  cellNumbers,
}) {
  let handleMouseEnter = (x, y) => {
    setCandidatePosition({ x, y });
  };
  let handleMouseLeave = () => {
    setCandidatePosition(null);
  };
  return (
    <Grid>
      {range(gridSize).map((y) => {
        return (
          <GridRow key={y}>
            {range(gridSize).map((x) => {
              function getCharFromWord({ word, direction, x: wx, y: wy }) {
                let chars = [...word];
                if (direction === 'x' && wy === y) {
                  return chars[x - wx];
                } else if (direction === 'y' && wx === x) {
                  return chars[y - wy];
                }
              }

              let chars = [];
              let draftChar = '';
              let modifiableIsHere = false;

              for (let wordInfo of wordList) {
                let char = getCharFromWord(wordInfo);
                if (char) {
                  if (wordInfo === modifiableWordItem) {
                    modifiableIsHere = true;
                    draftChar = char;
                  }
                  chars.push(char);
                }
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
                  interactable={canCommit || modifiableIsHere}
                  placeable={draftWord.length > 0 && canCommit}
                  holdingWord={draftWord.length > 0}
                  modifiable={modifiableIsHere}
                  hover={modifiableIsHere && !draftWord.length}
                  hasLetter={chars.length || draftChar}
                  onClick={() => {
                    if (modifiableWordItem) {
                      removeWord(modifiableWordItem);
                    } else {
                      commitWord(x, y);
                    }
                  }}
                >
                  <GridCellContents>
                    <GridCellNumber>
                      {cellNumbers.get(x + '-' + y)}
                    </GridCellNumber>
                    {uniq([...sortBy(chars), ...draftChar]).map((c) => {
                      return (
                        <GridCellChar
                          error={
                            uniq(chars).length > 1 ||
                            (chars.length &&
                              c === draftChar &&
                              !chars.includes(draftChar))
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
  );
}

function PlayableCrossWordGrid({
  gridSize,
  wordList,
  draftDirection,
  cellNumbers,
}) {
  let handleMouseEnter = (x, y) => {
    //
  };
  let handleMouseLeave = () => {
    //
  };
  return (
    <Grid>
      {range(gridSize).map((y) => {
        return (
          <GridRow key={y}>
            {range(gridSize).map((x) => {
              function getCharFromWord({ word, direction, x: wx, y: wy }) {
                let chars = [...word];
                if (direction === 'x' && wy === y) {
                  return chars[x - wx];
                } else if (direction === 'y' && wx === x) {
                  return chars[y - wy];
                }
              }

              let chars = [];
              let modifiableIsHere = false;

              for (let wordInfo of wordList) {
                let char = getCharFromWord(wordInfo);
                if (char) {
                  chars.push(char);
                }
              }

              return (
                <GridCell
                  key={x}
                  onMouseEnter={() => handleMouseEnter(x, y)}
                  onMouseLeave={() => handleMouseLeave(x, y)}
                  hasLetter={chars.length}
                  onClick={() => {}}
                >
                  <GridCellContents>
                    <GridCellNumber>
                      {cellNumbers.get(x + '-' + y)}
                    </GridCellNumber>
                    {chars.length > 0 && <GridCellInput />}
                  </GridCellContents>
                </GridCell>
              );
            })}
          </GridRow>
        );
      })}
    </Grid>
  );
}

function App() {
  let inputRef = useRef(null);
  let [candidatePosition, setCandidatePosition] = useState(null);

  let [currentlySaved, setCurrentlySaved] = useState(true);

  let [draftDirection, setDraftDirection] = useState('x');
  let [draftWord, setDraftWord] = useState('');
  let [draftClue, setDraftClue] = useState('');

  let [wordList, setWordList] = useState(() => {
    // getting stored value
    const saved = localStorage.getItem('wordList');
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });

  // TODO: change wordlists to an object where the keys are unique timestamps etc,
  // instead of using an array, so you can have titles for each crossword and links
  // to them, etc
  let [currentWordListIdx, setCurrentWordListIdx] = useState(() => {
    const saved = localStorage.getItem('currentWordListIdx');
    const initialValue = JSON.parse(saved);
    return initialValue || 0;
  });

  let [savedWordLists, setSavedWordLists] = useState(() => {
    const saved = localStorage.getItem('savedWordLists');
    const initialValue = JSON.parse(saved);
    return initialValue || [];
  });

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
    localStorage.setItem('savedWordLists', JSON.stringify(savedWordLists));
  }, [savedWordLists]);
  useEffect(() => {
    localStorage.setItem('wordList', JSON.stringify(wordList));
  }, [wordList]);
  useEffect(() => {
    localStorage.setItem(
      'currentWordListIdx',
      JSON.stringify(currentWordListIdx)
    );
  }, [currentWordListIdx]);

  useEffect(() => {
    let swapDraftDirection = () => {
      setDraftDirection(draftDirection === 'x' ? 'y' : 'x');
    };
    function handleKeyDown(e) {
      if (e.code === 'Enter') {
        e.preventDefault();
        swapDraftDirection();
      }
      if (e.code === 'Escape') {
        e.preventDefault();
        setDraftWord('');
      }
    }
    document.body.addEventListener('keydown', handleKeyDown);
    return () => document.body.removeEventListener('keydown', handleKeyDown);
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
  }, [savedWordLists, currentWordListIdx]);

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
      // BUG: removing wordlists will erase your unsaved data
    }
  };

  let updateWordList = (func) => {
    setCurrentlySaved(false);
    setWordList(func);
  };

  let wordHereMatchingDirection = candidatePosition
    ? wordList.find((item) => {
        return (
          item.x === candidatePosition.x &&
          item.y === candidatePosition.y &&
          item.direction === draftDirection
        );
      })
    : null;
  let wordHere =
    wordHereMatchingDirection ??
    (candidatePosition
      ? wordList.find((item) => {
          return (
            item.x === candidatePosition.x && item.y === candidatePosition.y
          );
        })
      : null);

  let modifiableWordItem = !draftWord ? wordHere : null;

  let canCommit = !!draftWord && !wordHereMatchingDirection;
  let commitWord = (x, y) => {
    if (draftWord && canCommit) {
      addWord(x, y, draftDirection, draftWord, draftClue);
      setDraftWord('');
      setDraftClue('');
      inputRef.current.focus();
    }
  };

  let removeWord = (wordItem) => {
    updateWordList(wordList.filter((item) => item !== wordItem));
    setDraftWord(wordItem.word);
    setDraftClue(wordItem.clue);
    setDraftDirection(wordItem.direction);
  };

  let cellNumbers = new Map();
  let cellNum = 1;
  for (let info of wordList) {
    let key = info.x + '-' + info.y;
    if (!cellNumbers.has(key)) {
      cellNumbers.set(key, cellNum++);
    }
  }

  let acrossClues = wordList.filter((item) => item.direction === 'x');
  let downClues = wordList.filter((item) => item.direction === 'y');

  let gridSize = 15;

  return (
    <Body>
      <PlayableCrossWordGrid
        gridSize={gridSize}
        wordList={wordList}
        draftDirection={draftDirection}
        cellNumbers={cellNumbers}
      />
      <EditUI
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
        <EditableCrossWordGrid
          gridSize={gridSize}
          wordList={wordList}
          modifiableWordItem={modifiableWordItem}
          candidatePosition={candidatePosition}
          draftWord={draftWord}
          draftDirection={draftDirection}
          setCandidatePosition={setCandidatePosition}
          canCommit={canCommit}
          removeWord={removeWord}
          commitWord={commitWord}
          cellNumbers={cellNumbers}
        />
        <Clues>
          <CluesInner>
            <ClueList
              title="Across"
              clues={acrossClues}
              cellNumbers={cellNumbers}
              updateClue={updateClue}
            />
            <ClueList
              title="Down"
              clues={downClues}
              cellNumbers={cellNumbers}
            />
          </CluesInner>
        </Clues>
      </GridClueContainer>
      <SavedWordLists
        wordLists={savedWordLists}
        selected={currentWordListIdx}
        saved={currentlySaved}
        select={selectWordList}
        remove={removeWordList}
      >
        <Button onClick={newWordList}>New Crossword</Button>
      </SavedWordLists>
    </Body>
  );
}

let Body = styled.div`
  font-size: 16px;
`;

let UI = styled.div`
  display: flex;
  padding: 5px;
`;
let WordUI = styled.div`
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
  width: 100%;
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
`;

let Clues = styled.div`
  width: 100%;
  overflow-y: scroll;
`;
let CluesInner = styled.div`
  width: 100%;
  height: 100px;
`;
let ClueListSection = styled.div`
  padding: 5px;
  border-top: 1px solid #eee;
`;
let ClueListTitle = styled.h1`
  font-size: 0.75em;
  text-transform: uppercase;
  margin: 0;
  margin-bottom: 5px;
`;
let ClueInput = styled.input`
  padding: 5px;
  margin: 2px;
  display: block;
  ::placeholder,
  ::-webkit-input-placeholder {
    color: #ccc;
  }
`;

let ClueListItem = styled.div`
  margin-bottom: 10px;
`;

let ClueNum = styled.span`
  font-weight: bold;
  font-size: 0.75em;
  display: inline-block;
  vertical-align: top;
  margin-right: 0.25em;
`;
let ClueAnswer = styled.span`
  text-transform: uppercase;
  font-size: 0.9em;
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
    props.modifiable && props.hover
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
  padding-top: 0.4em;
  width: 100%;
  box-sizing: border-box;
`;
let GridCellInput = styled.input`
  width: 100%;
  position: absolute;
  background: rgba(255, 255, 255, 0.2);
  text-align: center;
  box-sizing: border-box;
  top: 0;
  left: 0;
  border: 0px;
  font-size: 1em;
  padding: 0;
  padding-top: 0.4em;

  :focus {
    border: 0px;
    box-shadow: 0 0 1px 1px #1a8fbf;
    outline: none;
  }
`;

let GridCellNumber = styled.span`
  position: absolute;
  top: 0px;
  left: 1px;
  font-size: 0.5em;
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
