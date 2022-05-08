'use strict';

const SudokuSolver = require('../controllers/sudoku-solver.js');

module.exports = function (app) {
  
  let solver = new SudokuSolver();

  app.route('/api/check')
    .post((req, res) => {
      const sudokuSolver = new SudokuSolver();
      const { coordinate, puzzle, value } = req.body;

      if (value && !/^[1-9]$/.test(value)) {
        res.json({
          error: "Invalid value",
        });
      } else if (coordinate && !/^[A-I][1-9]$/.test(coordinate)) {
        res.json({
          error: "Invalid coordinate",
        });
      } else if (!coordinate || !puzzle || !value) {
        res.json({
          error: "Required field(s) missing"
        });
      } else if (!sudokuSolver.validate(puzzle)) {
        if (puzzle.length !== 81) {
          res.json({ error: 'Expected puzzle to be 81 characters long' })
        } else {
          res.json({
            error: "Invalid characters in puzzle"
          });
        }

      } else {
        
        const row = coordinate.replace(/^(\w)\d$/, "$1");
        const col = coordinate.replace(/^\w(\d)$/, "$1");
        
        const checkRowPlacement = sudokuSolver.checkRowPlacement(puzzle, row, col, value);
        const checkColPlacement = sudokuSolver.checkColPlacement(puzzle, row, col, value);
        const checkRegionPlacement = sudokuSolver.checkRegionPlacement(puzzle, row, col, value);
        
        const valueAlreadyPlaced = sudokuSolver.checkValue(puzzle, row, col, value);
        
        if (checkRowPlacement && checkColPlacement && checkRegionPlacement || valueAlreadyPlaced) {
          res.json({ valid: true });
        } else {
          const conflict = [];
          if (!checkRowPlacement) {
            conflict.push("row");
          }
  
          if (!checkColPlacement) {
            conflict.push("column");
          }
  
          if (!checkRegionPlacement) {
            conflict.push("region");
          }
          
          res.json({
            valid: false, 
            conflict,
          })       
        }
      }
    });
    
  app.route('/api/solve') 
    .post((req, res) => { 
      const sudokuSolver = new SudokuSolver();
      const { puzzle } = req.body;
      
      if (!puzzle) {
        res.json({error: "Required field missing"});
      } else {
        if (sudokuSolver.validate(puzzle)) {
          const solvedPuzzle = sudokuSolver.solve(puzzle);
          if (!solvedPuzzle) {
            res.json({
              error: "Puzzle cannot be solved"
            })
          } else {
            const solution = sudokuSolver.concatenate2DArray(solvedPuzzle);
            res.json({
              solution
            });
          }
        } else if (puzzle.length != 81) { 
          res.json({
            error: "Expected puzzle to be 81 characters long"
          });
        } else {
          res.json({
            error: "Invalid characters in puzzle"
          });
        }
      }
    });
};
