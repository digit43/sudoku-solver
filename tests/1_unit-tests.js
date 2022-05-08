const chai = require('chai');
const assert = chai.assert;
const Solver = require('../controllers/sudoku-solver.js');
let solver = new Solver();
let input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
const output = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

suite('UnitTests', () => {
  test("Logic handles a valid puzzle string of 81 characters", function(done) {
    const solved = solver.concatenate2DArray(solver.solve(input));
    assert.equal(solved, output);
    done();
  });
  
  test("Logic handles a puzzle string with invalid characters (not 1-9 or .", function(done) {

    const solved = solver.solve("e.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.");
    
    assert.isNaN(solved[0][0], "Converts character to NaN");
    done();
  });

  test("Logic handles a puzzle string that is not 81 characters in length", function(done) {
    let input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.212312";
    const solved = solver.solve(input);
    assert.isFalse(solved, "False if string not equal to 81")
    done();
  });

  test("Logic handles a valid row placement", function(done) {
    let rowPlacement = solver.checkRowPlacement(input, "A", 2, 3);
    assert.isTrue(rowPlacement, "Row value placed correctly");
    done();
  });

  test("Logic handles a invalid row placement", function(done) {
    let rowPlacement = solver.checkRowPlacement(input, "B", 2, 2);
    assert.isFalse(rowPlacement, "Row value is incorrect");
    done();
  });

  test("Logic handles a valid column placement", function(done) {
    let colPlacement = solver.checkColPlacement(input, "A", 2, 3);
    assert.isTrue(colPlacement, "Column value placed correctly");
    done();
  });

  test("Logic handles an invalid column placement", function(done) {
    let colPlacement = solver.checkColPlacement(input, "B", 2, 2);
    assert.isFalse(colPlacement, "Column value is incorrect");
    done();
  });

  test("Logic handles a valid region (3x3 grid) placement", function(done) {
    let regionPlacement = solver.checkRegionPlacement(input, "A", 2, 3);
    assert.isTrue(regionPlacement, "Region value placed correctly");
    done();
  });

  test("Logic handles an invalid region (3x3 grid) placement", function(done) {
    let regionPlacement = solver.checkRegionPlacement(input, "B", 2, 2);
    assert.isFalse(regionPlacement, "Region value is incorrect");
    done();
  });

  test("Valid puzzle strings pass the solver", function(done) {
    const solved = solver.concatenate2DArray(solver.solve(input));
    assert.equal(solved, output);
    done();
  });

  test("Invalid puzzle strings fail the solver", function(done) {
    let input = "1.1..2.14..63.12.1.2..5.....9..1....8.2.1111.3.7.2..9.47...8..1..16....926914.37.";
    const solved = solver.solve(input);
    assert.isFalse(solved, "Region value is incorrect");
    done();
  });

  test("Solver returns the expected solution for an incomplete puzzle", function(done) {
    const solved = solver.concatenate2DArray(solver.solve(input));
    assert.equal(solved, output);
    done();
  });
});
