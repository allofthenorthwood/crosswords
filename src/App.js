import './App.css';
import { useEffect, useState, useRef } from 'react';
import styled from 'styled-components';
import { range, sortBy, uniq } from 'lodash';

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
            onChange={(e) => updateClue(item.word, e.target.value)}
          />
        </ClueListItem>
      ))}
    </ClueListSection>
  );
}

function App() {
  let inputRef = useRef(null);
  let [draftDirection, setDraftDirection] = useState('x');
  let [candidatePosition, setCandidatePosition] = useState(null);

  let [draftWord, setDraftWord] = useState('word');
  let [draftClue, setDraftClue] = useState('');
  let [wordList, setWordList] = useState([]);

  let swapDraftDirection = () => {
    setDraftDirection(draftDirection === 'x' ? 'y' : 'x');
  };

  let handleMouseEnter = (x, y) => {
    setCandidatePosition({ x, y });
  };
  let handleMouseLeave = () => {
    setCandidatePosition(null);
  };

  useEffect(() => {
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
  });

  let updateClue = (word, clue) => {
    setWordList((prevWordList) => {
      return sortBy(
        prevWordList.map((item) =>
          item.word === word ? { ...item, clue } : item
        ),
        (item) => item.y,
        (item) => item.x
      );
    });
  };

  let addWord = (x, y, direction, word, clue) => {
    setWordList((prevWordList) => {
      return sortBy(
        [...prevWordList, { x, y, direction, word, clue }],
        (item) => item.y,
        (item) => item.x
      );
    });
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

  let removeWord = (modifiableWordItem) => {
    setWordList(wordList.filter((item) => item !== modifiableWordItem));
    setDraftWord(modifiableWordItem.word);
    setDraftClue(modifiableWordItem.clue);
    setDraftDirection(modifiableWordItem.direction);
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
    <div className="App">
      <UI>
        <WordUI>
          <WordInputPrompt>
            <div>New Word:</div>
          </WordInputPrompt>
          <WordInput
            value={draftWord}
            onChange={(e) => setDraftWord(e.target.value)}
            ref={inputRef}
          />
        </WordUI>
        <Buttons>
          <Button
            onClick={() => setDraftDirection('x')}
            selected={draftDirection === 'x'}
          >
            Across {'\u2794'}
          </Button>
          <Button
            onClick={() => setDraftDirection('y')}
            down={true}
            selected={draftDirection === 'y'}
          >
            Down <Rotate>{'\u2794'}</Rotate>
          </Button>
          <Hint>
            <HintText>Swap with Enter</HintText>
            <EnterKey>{'\u23CE'}</EnterKey>
          </Hint>
        </Buttons>
      </UI>
      <Container>
        <Grid>
          {range(gridSize).map((y) => {
            return (
              <GridRow key={y}>
                {range(gridSize).map((x) => {
                  function getCharFromWord({ word, direction, x: wx, y: wy }) {
                    if (direction === 'x' && wy === y) {
                      return word[x - wx];
                    } else if (direction === 'y' && wx === x) {
                      return word[y - wy];
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
        <Clues>
          <ClueList
            title="Across"
            clues={acrossClues}
            cellNumbers={cellNumbers}
            updateClue={updateClue}
          />
          <ClueList title="Down" clues={downClues} cellNumbers={cellNumbers} />
        </Clues>
      </Container>
    </div>
  );
}
let UI = styled.div`
  display: flex;
  padding: 5px;
`;
let Container = styled.div`
  display: flex;
  align-items: start;
  font-size: 16px;
`;

let WordUI = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;
`;
let WordInputPrompt = styled.div`
  flex-grow: 1;
  justify-content: flex-end;
  display: flex;
  flex-direction: column;
`;
let WordInput = styled.input`
  padding: 5px;
  margin: 5px;
`;

let Buttons = styled.div`
  text-align: center;
  margin-left: 10px;
`;
let Button = styled.button`
  background: ${(props) => (props.selected ? '#4cc7f9' : '#eee')};
  border: 1px solid ${(props) => (props.selected ? '#1a8fbf' : '#ccc')};
  border-radius: ${(props) => (props.down ? '0 10px 10px 0' : '10px 0 0 10px')};
  padding: 5px;
  padding: 7px;
  cursor: ${(props) => (props.selected ? 'default' : 'pointer')};
  :hover {
    background: ${(props) => (props.selected ? '#4cc7f9' : '#ddd')};
  }
`;
let Rotate = styled.span`
  transform: rotate(90deg);
  display: inline-block;
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
let EnterKey = styled.span`
  font-color: #999;
  padding: 5px 10px 10px;
  display: inline-block;
  background: #eee;
  width: 0.5em;
  height: 0.5em;
  border: 1px solid #999;
  font-size: 1em;
  border-radius: 3px;
  vertical-align: middle;
`;

let Clues = styled.div`
  width: 100%;
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
  padding-top: 0.25em;
  box-sizing: border-box;
  justify-content: center;
  text-transform: uppercase;
`;

let GridCellChar = styled.div`
  color: ${(props) => (props.error ? 'red' : null)};
  font-weight: ${(props) => (props.draft ? 'bold' : '')};
`;

let GridCellNumber = styled.span`
  position: absolute;
  top: 0px;
  left: 1px;
  font-size: 0.5em;
`;

export default App;
