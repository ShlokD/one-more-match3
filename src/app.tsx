import { useState } from "preact/hooks";
const colors = ["blue", "green", "orange", "purple", "red", "yellow", "gray"];

const BG_MAP: Record<string, string> = {
  blue: "bg-blue-200",
  green: "bg-green-600",
  orange: "bg-orange-600",
  purple: "bg-purple-600",
  red: "bg-red-600",
  yellow: "bg-yellow-400",
  gray: "bg-gray-600",
};

const getRandomColor = () => {
  const index = Math.floor(Math.random() * colors.length);
  return colors[index];
};

const copyGrid = (grid: string[][]) => {
  const newGrid = [];
  for (let i = 0; i < grid.length; ++i) {
    newGrid[i] = grid[i].slice();
  }
  return newGrid;
};

const shuffle = (grid: string[][]) => {
  const newGrid = copyGrid(grid);
  for (let i = 0; i < newGrid.length; i++) {
    for (let j = 0; j < newGrid[i].length; j++) {
      const val = newGrid[i][j];
      if (newGrid?.[i + 1]?.[j] === val && newGrid?.[i - 1]?.[j] === val) {
        let color = getRandomColor();
        while (color === newGrid[i][j]) {
          color = getRandomColor();
        }
        newGrid[i][j] = color;
      }
      if (newGrid?.[i]?.[j + 1] === val && newGrid?.[i]?.[j - 1] === val) {
        let color = getRandomColor();
        while (color === newGrid[i][j]) {
          color = getRandomColor();
        }
        newGrid[i][j] = color;
      }
      if (
        newGrid?.[i + 1]?.[j + 1] === val &&
        newGrid?.[i - 1]?.[j - 1] === val
      ) {
        let color = getRandomColor();
        while (color === newGrid[i][j]) {
          color = getRandomColor();
        }
        newGrid[i][j] = color;
      }
      if (
        newGrid?.[i - 1]?.[j + 1] === val &&
        newGrid?.[i + 1]?.[j - 1] === val
      ) {
        let color = getRandomColor();
        while (color === newGrid[i][j]) {
          color = getRandomColor();
        }
        newGrid[i][j] = color;
      }
    }
  }
  return newGrid;
};

const createGrid = (gridSize: number) => {
  const grid = new Array(gridSize).fill(0).map(() => {
    return new Array(gridSize).fill(0).map(() => getRandomColor());
  });
  return shuffle(grid);
};

const checkMatches = (grid: string[][]) => {
  let matches = 0;
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const val = grid[i][j];
      if (grid?.[i + 1]?.[j] === val && grid?.[i - 1]?.[j] === val) {
        matches++;
      }
      if (grid?.[i]?.[j + 1] === val && grid?.[i]?.[j - 1] === val) {
        matches++;
      }
      if (grid?.[i + 1]?.[j + 1] === val && grid?.[i - 1]?.[j - 1] === val) {
        matches++;
      }
      if (grid?.[i - 1]?.[j + 1] === val && grid?.[i + 1]?.[j - 1] === val) {
        matches++;
      }
    }
  }

  return matches;
};

const addNewItems = (oldGrid: string[][]) => {
  const grid = copyGrid(oldGrid);
  for (let i = 0; i < grid.length; i++) {
    for (let j = 0; j < grid[i].length; j++) {
      const val = grid[i][j];
      if (grid?.[i + 1]?.[j] === val && grid?.[i - 1]?.[j] === val) {
        grid[i][j] = getRandomColor();
        grid[i + 1][j] = getRandomColor();
        grid[i - 1][j] = getRandomColor();
      }
      if (grid?.[i]?.[j + 1] === val && grid?.[i]?.[j - 1] === val) {
        grid[i][j] = getRandomColor();
        grid[i][j + 1] = getRandomColor();
        grid[i][j - 1] = getRandomColor();
      }
      if (grid?.[i + 1]?.[j + 1] === val && grid?.[i - 1]?.[j - 1] === val) {
        grid[i][j] = getRandomColor();
        grid[i + 1][j + 1] = getRandomColor();
        grid[i - 1][j - 1] = getRandomColor();
      }
      if (grid?.[i - 1]?.[j + 1] === val && grid?.[i + 1]?.[j - 1] === val) {
        grid[i][j] = getRandomColor();
        grid[i - 1][j + 1] = getRandomColor();
        grid[i + 1][j - 1] = getRandomColor();
      }
    }
  }

  return grid;
};

type Selected = {
  row: number;
  column: number;
};
export function App() {
  const [gridSize, setGridSize] = useState(5);
  const [selected, setSelected] = useState<Selected | null>(null);
  const [score, setScore] = useState(0);
  const [grid, setGrid] = useState<string[][]>(createGrid(gridSize));

  const handleSelect = (row: number, column: number) => {
    if (selected === null) {
      setSelected({
        row,
        column,
      });
    } else if (selected.row === row && selected.column === column) {
      setSelected(null);
    } else {
      setGrid((prev) => {
        let newGrid = copyGrid(prev);
        const temp = newGrid[selected.row][selected.column];
        newGrid[selected.row][selected.column] = newGrid[row][column];
        newGrid[row][column] = temp;

        let matches = checkMatches(newGrid);

        while (matches > 0) {
          setScore((prev) => prev + matches);
          newGrid = addNewItems(newGrid);
          matches = checkMatches(newGrid);
        }

        return newGrid;
      });

      setSelected(null);
    }
  };

  const isNeighbour = (row: number, column: number) => {
    if (selected === null) {
      return true;
    }
    return (
      (row === selected.row - 1 && column === selected.column) ||
      (row === selected.row + 1 && column === selected.column) ||
      (row === selected.row - 1 && column === selected.column + 1) ||
      (row === selected.row + 1 && column === selected.column + 1) ||
      (row === selected.row - 1 && column === selected.column - 1) ||
      (row === selected.row + 1 && column === selected.column - 1) ||
      (row === selected.row && column === selected.column - 1) ||
      (row === selected.row && column === selected.column + 1)
    );
  };

  const changeGrid = (value: number) => {
    setGridSize(value);
    setGrid(createGrid(value));
    setScore(0);
  };
  return (
    <main className="flex flex-col min-h-screen w-full p-8 gap-4">
      <h1 className="text-2xl font-bold self-center">One More Match3</h1>
      <h2 className="text-xl font-bold self-center">Score {score * 10}</h2>
      <div className="flex self-center gap-2 ">
        <label htmlFor="grid-size">Size</label>
        <input
          type="range"
          min={4}
          max={12}
          value={gridSize}
          id="grid-size"
          className="w-2/3"
          onChange={(ev) =>
            changeGrid(Number((ev?.target as HTMLInputElement)?.value))
          }
        />
      </div>
      <div
        className="grid self-center place-items-center gap-1 my-4"
        style={{
          gridTemplateColumns: `repeat(${gridSize}, 1fr)`,
        }}
      >
        {grid.map((row, i) => {
          return row.map((item, j) => {
            const neighbour = isNeighbour(i, j);
            const isSelected = selected?.row === i && selected?.column === j;
            return (
              <button
                className={`rounded-full ${BG_MAP[item]} h-20 w-20 ${
                  isSelected ? "border-4 border-pink-600" : ""
                } ${
                  neighbour && selected !== null ? "border-4 border-black" : ""
                }`}
                aria-label={`Button-${i}-${j}`}
                key={`button-${i}-${j}`}
                onClick={() => handleSelect(i, j)}
                disabled={!neighbour && !isSelected}
                style={{
                  transition: "background-color 300ms linear",
                }}
              />
            );
          });
        })}
      </div>
    </main>
  );
}
