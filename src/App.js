import './App.css';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { range, sortBy, uniq, remove } from 'lodash';

function ClueList({ title, clues, cellNumbers, updateClue }) {
  return (
    <div>
      <h3>{title}</h3>
      {clues.map((item, idx) => (
        <ClueListItem key={idx}>
          {cellNumbers.get(item.x + '-' + item.y)}.{' '}
          <ClueAnswer>({item.word})</ClueAnswer>
          <ClueInput
            value={item.clue}
            placeholder="[Clue needed]"
            onChange={(e) => updateClue(item.word, e.target.value)}
          />
        </ClueListItem>
      ))}
    </div>
  );
}

function App() {
  let [draftDirection, setDraftDirection] = useState('x');
  let [candidatePosition, setCandidatePosition] = useState(null);

  let [draftWord, setDraftWord] = useState('word');
  let [draftClue, setDraftClue] = useState('');
  let [wordList, setWordList] = useState([]);

  let changeDraftDirection = () => {
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
      if (e.code === 'Backquote') {
        e.preventDefault();
        changeDraftDirection();
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

  let wordHere = candidatePosition
    ? wordList.find((item) => {
        return (
          item.x === candidatePosition.x &&
          item.y === candidatePosition.y &&
          item.direction === draftDirection
        );
      })
    : null;

  let modifiableWordItem = !draftWord ? wordHere : null;

  let canCommit = !!draftWord && !wordHere;
  let commitWord = (x, y) => {
    if (draftWord && canCommit) {
      addWord(x, y, draftDirection, draftWord, draftClue);
      setDraftWord('');
      setDraftClue('');
    }
  };

  let removeWord = (modifiableWordItem) => {
    setWordList(wordList.filter((item) => item !== modifiableWordItem));
    setDraftWord(modifiableWordItem.word);
    setDraftClue(modifiableWordItem.clue);
  };

  let cellNumbers = new Map();
  let cellNum = 1;
  for (let info of wordList) {
    let key = info.x + '-' + info.y;
    if (!cellNumbers.has(key)) {
      cellNumbers.set(key, cellNum++);
    }
  }

  let acrossClues = 
    wordList.filter((item) => item.direction === 'x');

  let downClues =
    wordList.filter((item) => item.direction === 'y');

  let gridSize = 10;
  return (
    <div className="App">
      <UI>
        <WordInput
          value={draftWord}
          onChange={(e) => setDraftWord(e.target.value)}
        />
        <div>
          direction: {draftDirection === 'x' ? 'across' : 'down'}{' '}
          <Button onClick={changeDraftDirection}>swap (`)</Button>
        </div>
      </UI>
      <Container>
        <Grid>
            {range(gridSize).map((y) => {
              return (
                <GridRow key={y}>
                  {range(gridSize).map((x) => {
                    function getCharFromWord({
                      word,
                      direction,
                      x: wx,
                      y: wy,
                    }) {
                      if (direction === 'x' && wy === y) {
                        return word[x - wx];
                      } else if (direction === 'y' && wx === x) {
                        return word[y - wy];
                      }
                    }

                    let chars = [];
                    let draftChar = null;
                    let modifiableIsHere = false;

                    for (let wordInfo of wordList) {
                      let char = getCharFromWord(wordInfo);
                      if (char) {
                        chars.push(char);
                        if (wordInfo === modifiableWordItem) {
                          modifiableIsHere = true;
                        }
                      }
                    }
                    if (candidatePosition) {
                      draftChar = getCharFromWord({
                        word: draftWord,
                        direction: draftDirection,
                        x: candidatePosition.x,
                        y: candidatePosition.y,
                      });
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
                          <GridCellChar
                            error={uniq(chars).length > 1 || draftChar}
                          >
                            {uniq(
                              remove(chars, (c) => {
                                return c !== draftChar;
                              })
                            ).join('')}
                          </GridCellChar>
                          <GridCellChar draft={true}>{draftChar}</GridCellChar>
                        </GridCellContents>
                      </GridCell>
                    );
                  })}
                </GridRow>
              );
            })}
        </Grid>
        <div>
          <ClueList
            title="Across"
            clues={acrossClues}
            cellNumbers={cellNumbers}
            updateClue={updateClue}
          />
          <ClueList title="Down" clues={downClues} cellNumbers={cellNumbers} />
        </div>
      </Container>
    </div>
  );
}
let UI = styled.div``;
let Container = styled.div`
  display: flex;
  align-items: start;
`;

let WordInput = styled.input`
  padding: 10px;
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
  padding: 10px;
`;

let ClueAnswer = styled.span`
  color: #bbb;
`;

let Button = styled.button`
  background: #eee;
  padding: 5px;
`;

let Grid = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1px;
  background: black;
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
      : '#aaa'};
`;

let GridCellContents = styled.div`
  width: 30px;
  height: 30px;
  text-align: center;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;

let GridCellChar = styled.div`
  color: ${(props) => (props.error ? 'red' : null)};
  font-weight: ${(props) => (props.draft ? 'bold' : '')};
`;

let GridCellNumber = styled.span`
  position: absolute;
  top: 1px;
  left: 1px;
  font-size: 9px;
`;

export default App;
