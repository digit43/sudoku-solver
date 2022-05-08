class SudokuSolver {
  
  constructor() {
    this.rowToNum = {
      A: 1,
      B: 2,
      C: 3,
      D: 4, 
      E: 5,
      F: 6,
      G: 7,
      H: 8,
      I: 9
    }
    
    this.regions = {
      "ABC123": "R1",
      "ABC456": "R2",
      "ABC789": "R3",
      "DFG123": "R4",
      "DFG456": "R5",
      "DFG789": "R6",
      "GHI123": "R7",
      "GHI456": "R8",
      "GHI789": "R9",
    }
  }
  
  validate(puzzleString) {
    if (/^[1-9\.]{81}$/g.test(puzzleString)) {
      return true;
    } else {
      return false
    }
  }

  checkValue(puzzleString, row, column, value) {
    let rowNum = this.rowToNum[row];
    let colNum = parseInt(column);
    value = parseInt(value);
    let matrix = this.retrieveDimentionalMatrix(puzzleString);
    if (matrix[rowNum - 1][colNum - 1] === value) {
      return true;
    } 
    return false;
  }
  
  checkRowPlacement(puzzleString, row, column, value) {
    let rowNum = this.rowToNum[row];
    let rowCount = 1;
    const rowArray = [];
    
    for (let i = 1; i <= puzzleString.length; i++) {

      if (rowNum === rowCount) {
        if (puzzleString[i - 1] !== ".") {
          rowArray.push(parseInt(puzzleString[i-1]));
        } else {
          rowArray.push(0);
        }
      }
      
      if (i%9 === 0) {
        rowCount++;
      }
    }
    // console.log(rowArray);
    // console.log(value, typeof value)
    if (rowArray.indexOf(parseInt(value)) > -1) {
      return false;
    }
    return true;
  }

  checkColPlacement(puzzleString, row, column, value) {
    let colCount = 1;
    const colArray = [];
    column = parseInt(column);
    
    for (let i = 1; i <= puzzleString.length; i++) {
      if (colCount === column) {
        if (puzzleString[i - 1] !== ".") {
          colArray.push(parseInt(puzzleString[i-1]));
        } else {
          colArray.push(0);
        }
      }
      
      if (i%9 === 0) {
        colCount = 1;
      } else {
        colCount++;
      }
    }

    // console.log(colArray);
    if (colArray.indexOf(parseInt(value)) > -1) {
      return false;
    }
    return true;
  }

  checkRegionPlacement(puzzleString, row, column, value) {
    let colStart, colEnd, rowStart, rowEnd;
    
    for (let key in this.regions) {
      if (key.indexOf(row) > -1 && key.indexOf(String(column)) > -1) {
        rowStart = this.rowToNum[key[0]];
        rowEnd = this.rowToNum[key[2]];
        colStart = parseInt(key[3]);
        colEnd = parseInt(key[5]);
      }
    }

    let rowCount = 1, colCount = 1;
    const regionArray = [];
    for (let i = 1; i <= puzzleString.length; i++) {
      if (rowCount >= rowStart && 
          rowCount <= rowEnd &&
          colCount >= colStart &&
          colCount <= colEnd) {

          if (puzzleString[i - 1] != ".") {
            regionArray.push(parseInt(puzzleString[i - 1]))
          } else {
            regionArray.push(0);          
          }
      
      }

      // iterate throught columns
      colCount++;

      // set columns count to starting point and increase row counter by 1 at grid border
      if (i%9 === 0) {
        colCount = 1;
        rowCount++;
      }
    }

    // console.log(regionArray);
    if (regionArray.indexOf(parseInt(value)) > -1) {
      return false;
    }
    return true;
    
  }

  solve(puzzleString) {
    /* Sudocu solver algoritm */
    function sudokuSolver(matrix) {
        if (solveSudoku(matrix) === true) {
            return matrix;
        }
        return 'NO SOLUTION';
    }
    
    const UNASSIGNED = 0;
    
    function solveSudoku(matrix) {
        let row = 0;
        let col = 0;
        let checkBlankSpaces = false;
    
        /* verify if sudoku is already solved and if not solved,
        get next "blank" space position */ 
        for (row = 0; row < matrix.length; row++) {
            for (col = 0; col < matrix[row].length; col++) {
                if (matrix[row][col] === UNASSIGNED) {
                    checkBlankSpaces = true;
                    break;
                }
            }
            if (checkBlankSpaces === true) {
                break;
            }
        }
        // no more "blank" spaces means the puzzle is solved
        if (checkBlankSpaces === false) {
            return true;
        }
    
        // try to fill "blank" space with correct num
        for (let num = 1; num <= 9; num++) {
            /* isSafe checks that num isn't already present 
            in the row, column, or 3x3 box (see below) */ 
            if (isSafe(matrix, row, col, num)) {
                matrix[row][col] = num;
    
                if (solveSudoku(matrix)) {
                    return true;
                }
    
                /* if num is placed in incorrect position, 
                mark as "blank" again then backtrack with 
                a different num */ 
                matrix[row][col] = UNASSIGNED;
            }
        }
        return false;
    }
    
    function isSafe(matrix, row, col, num) {
        return (
            !usedInRow(matrix, row, num) && 
            !usedInCol(matrix, col, num) && 
            !usedInBox(matrix, row - (row % 3), col - (col % 3), num)
        );
    }
    
    function usedInRow(matrix, row, num) {
        for (let col = 0; col < matrix.length; col++) {
            if (matrix[row][col] === num) {
                return true;
            }
        }
        return false;
    }
    
    function usedInCol(matrix, col, num) {
        for (let row = 0; row < matrix.length; row++) {
            if (matrix[row][col] === num) {
                return true;
            }
        }
        return false;
    }
    
    function usedInBox(matrix, boxStartRow, boxStartCol, num) {
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                if (matrix[row + boxStartRow][col + boxStartCol] === num) {
                    return true;
                }
            }
        }
        return false;
    }

    if (puzzleString.length != 81) {
      return false;
    } else {
      const sudokuGrid = this.retrieveDimentionalMatrix(puzzleString)
      
      const solved = sudokuSolver(sudokuGrid);
  
      if (solved === "NO SOLUTION") {
        return false;
      }
  
      return solved;
    }
    

  }

  concatenate2DArray(inputArray) {
    return inputArray.map(row => row.join("")).join("");
  }

  retrieveDimentionalMatrix(puzzle) {
    const matrix = [];
    let row = [];
    
    for (let i = 1; i<=puzzle.length; i++) {
      if (puzzle[i - 1] != ".") {
        row.push(parseInt(puzzle[i - 1]))
      } else {
        row.push(0);          
      }

      if (i%9 === 0) {
        matrix.push(row);
        row = [];
      } 
      
    }

    return matrix;
  }
}

module.exports = SudokuSolver;

