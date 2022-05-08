const chai = require("chai");
const chaiHttp = require('chai-http');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let input = "1.5..2.84..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let inputInvalidCharaters = "1.5..2.8e..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.";
let inputInvalidLength = "1.5..2.81..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....926914.37.1";
let inputCannotBeSolved = "1.5..2.81..63.12.7.2..5.....9..1....8.2.3674.3.7.2..9.47...8..1..16....111111.37.";
const output = "135762984946381257728459613694517832812936745357824196473298561581673429269145378";

suite('Functional Tests', () => {
  test("Solve a puzzle with valid puzzle string: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({
        puzzle: input
      })
      .end(function(err, res) {
        assert.equal(res.status, 200, "Response status is always 200");
        assert.equal(res.body.solution, output);
      });
    done();
  });

  test("Solve a puzzle with missing puzzle string: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({})
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {error: "Required field missing"});
      });
    done();
  });

  test("Solve a puzzle with invalid characters: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({
        puzzle: inputInvalidCharaters
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {error: "Invalid characters in puzzle"});
      });
    done();
  });

  test("Solve a puzzle with incorrect length: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({
        puzzle: inputInvalidLength
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {error: "Expected puzzle to be 81 characters long"});
      });
    done();
  });

  test("Solve a puzzle that cannot be solved: POST request to /api/solve", function(done) {
    chai
      .request(server)
      .post("/api/solve")
      .type("form")
      .send({
        puzzle: inputCannotBeSolved
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {error: "Puzzle cannot be solved"});
      });
    done();
  });

  test("Check a puzzle placement with all fields: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: input,
        value: 3,
        coordinate: "A2"
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {valid: true});
      });
    done();
  });

  test("Check a puzzle placement with single placement conflict: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: input,
        value: 3,
        coordinate: "B2"
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.equal(res.body.conflict[0], "row");
      });
    done();
  });

  test("Check a puzzle placement with multiple placement conflicts: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: input,
        value: 7,
        coordinate: "B2"
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.include(res.body.conflict, "row");
        assert.include(res.body.conflict, "column");
      });
    done();
  });

  test("Check a puzzle placement with all placement conflicts: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: input,
        value: 2,
        coordinate: "B2"
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.property(res.body, "valid");
        assert.property(res.body, "conflict");
        assert.include(res.body.conflict, "row");
        assert.include(res.body.conflict, "column");
        assert.include(res.body.conflict, "region");
      });
    done();
  });

  test("Check a puzzle placement with missing required fields: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: input,
        // value: 2,
        coordinate: "B2"
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {error: "Required field(s) missing"});
      });
    done();
  });

  test("Check a puzzle placement with invalid characters: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: inputInvalidCharaters,
        value: 2,
        coordinate: "B2"
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {error: "Invalid characters in puzzle"});
      });
    done();
  });

  test("Check a puzzle placement with incorrect length: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: inputInvalidLength,
        value: 2,
        coordinate: "B2"
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {error: "Expected puzzle to be 81 characters long"});
      });
    done();
  });

  test("Check a puzzle placement with invalid placement coordinate: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: input,
        value: 2,
        coordinate: "BD"
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {error: "Invalid coordinate"});
      });
    done();
  });

  test("Check a puzzle placement with invalid placement value: POST request to /api/check", function(done) {
    chai
      .request(server)
      .post("/api/check")
      .type("form")
      .send({
        puzzle: input,
        value: 10,
        coordinate: "B2"
      })
      .end(function(err, res) {
        // console.log(res.body)
        assert.equal(res.status, 200, "Response status is always 200");
        assert.include(res.body, {error: "Invalid value"});
      });
    done();
  });
});

