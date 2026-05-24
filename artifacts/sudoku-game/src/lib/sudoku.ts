export type Difficulty = 'easy' | 'normal' | 'hard';

export interface CellData {
  value: number | null;
  isGiven: boolean;
  notes: Set<number>;
}

export type BoardState = CellData[][];

// Basic Sudoku solver to check uniqueness
function solveSudoku(board: number[][]): { solutions: number; solvedBoard: number[][] | null } {
  let solutions = 0;
  let solvedBoard: number[][] | null = null;

  function isValid(r: number, c: number, val: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === val) return false;
      if (board[i][c] === val) return false;
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[br + i][bc + j] === val) return false;
      }
    }
    return true;
  }

  function solve(r: number, c: number) {
    if (r === 9) {
      solutions++;
      if (solutions === 1) {
        solvedBoard = board.map(row => [...row]);
      }
      return;
    }
    if (solutions > 1) return; // Stop if multiple solutions found

    let nextR = c === 8 ? r + 1 : r;
    let nextC = c === 8 ? 0 : c + 1;

    if (board[r][c] !== 0) {
      solve(nextR, nextC);
    } else {
      for (let v = 1; v <= 9; v++) {
        if (isValid(r, c, v)) {
          board[r][c] = v;
          solve(nextR, nextC);
          board[r][c] = 0;
        }
      }
    }
  }

  solve(0, 0);
  return { solutions, solvedBoard };
}

function generateFullBoard(): number[][] {
  const board = Array(9).fill(0).map(() => Array(9).fill(0));
  
  function isValid(r: number, c: number, val: number): boolean {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === val) return false;
      if (board[i][c] === val) return false;
    }
    const br = Math.floor(r / 3) * 3;
    const bc = Math.floor(c / 3) * 3;
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        if (board[br + i][bc + j] === val) return false;
      }
    }
    return true;
  }

  function fill(): boolean {
    for (let r = 0; r < 9; r++) {
      for (let c = 0; c < 9; c++) {
        if (board[r][c] === 0) {
          const nums = [1, 2, 3, 4, 5, 6, 7, 8, 9].sort(() => Math.random() - 0.5);
          for (let v of nums) {
            if (isValid(r, c, v)) {
              board[r][c] = v;
              if (fill()) return true;
              board[r][c] = 0;
            }
          }
          return false;
        }
      }
    }
    return true;
  }

  fill();
  return board;
}

export function generatePuzzle(difficulty: Difficulty): { board: BoardState; solution: number[][] } {
  const solution = generateFullBoard();
  const puzzle = solution.map(row => [...row]);
  
  let cellsToRemove = 0;
  if (difficulty === 'easy') cellsToRemove = 36;
  else if (difficulty === 'normal') cellsToRemove = 46;
  else cellsToRemove = 54;

  let removed = 0;
  let attempts = 0;
  while (removed < cellsToRemove && attempts < 200) {
    const r = Math.floor(Math.random() * 9);
    const c = Math.floor(Math.random() * 9);
    if (puzzle[r][c] !== 0) {
      const temp = puzzle[r][c];
      puzzle[r][c] = 0;
      
      const { solutions } = solveSudoku(puzzle.map(row => [...row]));
      if (solutions === 1) {
        removed++;
      } else {
        puzzle[r][c] = temp; // Revert
      }
    }
    attempts++;
  }

  const boardState: BoardState = puzzle.map((row) => 
    row.map(val => ({
      value: val === 0 ? null : val,
      isGiven: val !== 0,
      notes: new Set<number>()
    }))
  );

  return { board: boardState, solution };
}

export function checkBoard(board: BoardState): { r: number, c: number }[] {
  const errors: { r: number, c: number }[] = [];
  
  for (let r = 0; r < 9; r++) {
    for (let c = 0; c < 9; c++) {
      const val = board[r][c].value;
      if (val === null) continue;
      
      let isError = false;
      
      // Check row
      for (let i = 0; i < 9; i++) {
        if (i !== c && board[r][i].value === val) isError = true;
      }
      // Check col
      for (let i = 0; i < 9; i++) {
        if (i !== r && board[i][c].value === val) isError = true;
      }
      // Check box
      const br = Math.floor(r / 3) * 3;
      const bc = Math.floor(c / 3) * 3;
      for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++) {
          if ((br + i !== r || bc + j !== c) && board[br + i][bc + j].value === val) isError = true;
        }
      }
      
      if (isError) errors.push({ r, c });
    }
  }
  
  return errors;
}

export function isBoardFull(board: BoardState): boolean {
  return board.every(row => row.every(cell => cell.value !== null));
}
