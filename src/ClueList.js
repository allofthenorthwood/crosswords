import styled from 'styled-components';

export default function Clues({ wordList, grid, updateClue, editable, curCell, draftDirection }) {
  let acrossClues = wordList.filter((item) => item.direction === 'x');
  let downClues = wordList.filter((item) => item.direction === 'y');

  //This only handles having one word down and one word across, which isn't all
  // possibilities but kinda should be
  let wordAcross = null;
  let wordDown = null;
  if (curCell) {
    console.log(curCell)
    for (let word of curCell.allWordsHere) {
      if (word.direction === 'x') {
        wordAcross = word;
      } else {
        wordDown = word;
      }
    }
    console.log(wordAcross, wordDown)
  }

  return (
    <Container>
      <CluesInner>
        <DirectionClueList
          title="Across"
          clues={acrossClues}
          grid={grid}
          updateClue={updateClue}
          editable={editable}
          activeWord={wordAcross}
          primaryClue={wordAcross && wordAcross.direction === draftDirection}
        />
        <DirectionClueList
          title="Down"
          clues={downClues}
          grid={grid}
          updateClue={updateClue}
          editable={editable}
          activeWord={wordDown}
          primaryClue={wordDown && wordDown.direction === draftDirection}
        />
      </CluesInner>
    </Container>
  );
}

function DirectionClueList({ title, clues, grid, updateClue, editable, activeWord, primaryClue}) {
  return (
    <ClueListSection>
      <ClueListTitle>{title}</ClueListTitle>
      {clues.map((item, idx) => (
        <ClueListItem key={idx} current={activeWord && activeWord.x === item.x && activeWord.y === item.y} primaryClue={primaryClue}>
          <ClueNum>{grid[item.y][item.x].cellNumber}</ClueNum>
          {editable ? (
            <>
              <ClueAnswer>{item.word}</ClueAnswer>
              <ClueInput
                value={item.clue}
                placeholder="[Clue needed]"
                onChange={(e) => updateClue(item, e.target.value)}
              />
            </>
          ) : (
            <Clue>{item.clue}</Clue>
          )}
        </ClueListItem>
      ))}
    </ClueListSection>
  );
}

let Container = styled.div`
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
  ${props => props.current ? 'background-color: #9ce2ff' : ''}
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
let Clue = styled.div`
  font-size: 0.9em;
  display: inline;
`;
