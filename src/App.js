import "./App.css";
import { useState } from "react";
import { StyleSheet, css } from "aphrodite";

const createInitialGrid = () => {
  const gridSize = 10;
  const grid = [];
  for (let i = 0; i < gridSize; i++) {
    const ar = [];
    for (let j = 0; j < gridSize; j++) {
      ar.push({
        id: `${i},${j}`,
        text: `${i}-${j}`,
        tempText: null,
      });
    }
    grid.push(ar);
  }

  return grid;
};

function App() {
  const [grid, setGrid] = useState(() => createInitialGrid());

  function updateCell(r, c, newText) {
    setGrid((prevGrid) => {
      return grid.map((row, rowIdx) => {
        return row.map((cell, colIdx) => {
          if (rowIdx === r && colIdx === c) {
            return { ...cell, tempText: newText };
          } else {
            return { ...cell, tempText: null };
          }
        });
      });
    });
  }

  const handleMouseEnter = (i, j) => {
    updateCell(i, j, "A/C");
  };
  const handleMouseLeave = (i, j) => {
    updateCell(i, j, null);
  };

  return (
    <div className="App">
      <table className={css(styles.table)}>
        <tbody>
          {grid.map((ar, i) => {
            return (
              <tr key={i}>
                {ar.map((cell, j) => {
                  return (
                    <td
                      key={cell.id}
                      className={css(
                        styles.cell,
                        cell.tempText && styles.changed
                      )}
                      onMouseEnter={() => handleMouseEnter(i, j)}
                      onMouseLeave={() => handleMouseLeave(i, j)}
                    >
                      {cell.tempText || cell.text}
                    </td>
                  );
                })}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

const styles = StyleSheet.create({
  table: {
    borderCollapse: "collapse",
    borderSpacing: 0,
  },

  cell: {
    border: "1px solid black",
    width: "30px",
    height: "30px",
    cursor: "pointer",
    color: "#eee",
    textAlign: "center",
  },

  changed: {
    color: "black",
  },
});

export default App;
