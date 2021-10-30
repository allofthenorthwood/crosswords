import './App.css';
import { useEffect, useState } from 'react';
import styled from 'styled-components';
import { range, sortBy, uniq, remove } from 'lodash';

function App() {
  const [draftDirection, setDraftDirection] = useState('x');
  const [candidatePosition, setCandidatePosition] = useState(null);

  const [draftWord, setDraftWord] = useState('test');
  const [wordList, setWordList] = useState([]);

  const changeDraftDirection = () => {
    setDraftDirection(draftDirection === 'x' ? 'y' : 'x');
  };

  const handleMouseEnter = (x, y) => {
    setCandidatePosition({ x, y });
  };
  const handleMouseLeave = () => {
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

  const addWord = (x, y, direction, word) => {
    setWordList((prevWordList) => {
      return sortBy(
        [...prevWordList, { x, y, direction, word }],
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
  const commitWord = (x, y) => {
    if (draftWord && canCommit) {
      addWord(x, y, draftDirection, draftWord);
      setDraftWord('');
    }
  };

  const removeWord = (modifiableWordItem) => {
    setWordList(wordList.filter((item) => item !== modifiableWordItem));
    setDraftWord(modifiableWordItem.word);
  };

  let cellNumbers = new Map();
  let cellNum = 1;
  for (let info of wordList) {
    let key = info.x + '-' + info.y;
    if (!cellNumbers.has(key)) {
      cellNumbers.set(key, cellNum++);
    }
  }

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
          <tbody>
            {range(gridSize).map((y) => {
              return (
                <tr key={y}>
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
                        <GridCellNumber>
                          {cellNumbers.get(x + '-' + y)}
                        </GridCellNumber>
                        <GridCellChar error={uniq(chars).length > 1 || draftChar}>
                          {uniq(remove(chars, c => {return c !== draftChar})).join('')}
                        </GridCellChar>
                        <GridCellChar draft={true}>{draftChar}</GridCellChar>
                      </GridCell>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Grid>
        <div>
          <h3>Across</h3>
          {sortBy(
            wordList.filter((item) => item.direction === 'x'),
            (item) => item.y
          ).map((item, idx) => (
            <Clue key={idx}>
              {cellNumbers.get(item.x + '-' + item.y)}. {item.word}
            </Clue>
          ))}
          <h3>Down</h3>
          {sortBy(
            wordList.filter((item) => item.direction === 'y'),
            (item) => item.x
          ).map((item, idx) => (
            <Clue key={idx}>
              {cellNumbers.get(item.x + '-' + item.y)}. {item.word}
            </Clue>
          ))}
        </div>
      </Container>
    </div>
  );
}
let UI = styled.div``;
let Container = styled.div`
  display: flex;
`;

let WordInput = styled.input`
  padding: 10px;
`;

let Clue = styled.div`
  padding: 10px;
`;

let Button = styled.button`
  background: #eee;
  padding: 5px;
`;

let Grid = styled.table`
  border-collapse: collapse;
  border-spacing: 0;
  table-layout: fixed;
`;

let GridCell = styled.td`
  border: 1px solid black;
  width: 30px;
  height: 30px;
  cursor: ${(props) => (props.holdingWord && !props.placeable ? 'not-allowed' :props.holdingWord ? 'grabbing' : props.interactable ? 'grab' :  'default')};
  background: ${(props) => (props.modifiable && props.hover ? '#eee' : props.hasLetter ? '#fff' : '#aaa')};
  text-align: center;
  position: relative;
`;

let GridCellChar = styled.span`
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
