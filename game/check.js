let region = [];
let row = [];
let column = [];
let edge = [];
let matrix = [
  [3, 3, 3, 3, 6, 6],
  [5, 5, 5, 6, 6, 6],
  [5, 1, 5, 6, 6, 6],
  [5, 1, 4, 2, 6, 6],
  [5, 5, 4, 2, 2, 6],
  [5, 4, 4, 2, 2, 2],
];

let colors = {
  1: "green",
  2: "yellow",
  3: "red",
  4: "blue",
  5: "lavender",
  6: "cyan",
  7: "teal",
};
for (let i = 0; i < 5; i++) {
  for (let j = 0; j < 5; j++) {
    matrix[i][j] = colors[matrix[i][j]];
  }
}
function checkValidityOfCell(color, loc) {
  // Checks if a queen can be placed at the given location
  return (
    region.includes(color) ||
    row.includes(loc[0]) ||
    column.includes(loc[2]) ||
    edge.includes(loc)
  );
}
function updateValidity(color, loc) {
  // Updates the game state after placing a queen
  region.push(color);
  row.push(loc[0]);
  column.push(loc[2]);
  let arr = [
    [loc[0] - 1, loc[2] - 1],
    [loc[0] - 1, parseInt(loc[2]) + 1],
    [parseInt(loc[0]) + 1, loc[2] - 1],
    [parseInt(loc[0]) + 1, parseInt(loc[2]) + 1],
  ];
  for ([x, y] of arr) {
    if (x != -1 && x != 5 && y != -1 && y != 5) {
      edge.push(`${x},${y}`);
    }
  }
}
console.log(matrix);
let count = 0;
for (let c1 = 0; c1 < 5; c1++) {
  let tempRegion0 = [...region];
  let tempRow0 = [...row];
  let tempCol0 = [...column];
  let tempEdge0 = [...edge];
  if (checkValidityOfCell(matrix[0][c1], `${0},${c1}`)) {
    continue;
  } else {
    updateValidity(matrix[0][c1], `${0},${c1}`);
  }
  for (let c2 = 0; c2 < 5; c2++) {
    let tempRegion1 = [...region];
    let tempRow1 = [...row];
    let tempCol1 = [...column];
    let tempEdge1 = [...edge];
    if (checkValidityOfCell(matrix[1][c2], `${1},${c2}`)) {
      continue;
    } else {
      updateValidity(matrix[1][c2], `${1},${c2}`);
    }
    for (let c3 = 0; c3 < 5; c3++) {
      let tempRegion2 = [...region];
      let tempRow2 = [...row];
      let tempCol2 = [...column];
      let tempEdge2 = [...edge];
      if (checkValidityOfCell(matrix[2][c3], `${2},${c3}`)) {
        continue;
      } else {
        updateValidity(matrix[2][c3], `${2},${c3}`);
      }
      for (let c4 = 0; c4 < 5; c4++) {
        let tempRegion3 = [...region];
        let tempRow3 = [...row];
        let tempCol3 = [...column];
        let tempEdge3 = [...edge];
        if (checkValidityOfCell(matrix[3][c4], `${3},${c4}`)) {
          continue;
        } else {
          updateValidity(matrix[3][c4], `${3},${c4}`);
        }
        for (let c5 = 0; c5 < 5; c5++) {
          let tempRegion4 = [...region];
          let tempRow4 = [...row];
          let tempCol4 = [...column];
          let tempEdge4 = [...edge];
          if (checkValidityOfCell(matrix[4][c5], `${4},${c5}`)) {
            continue;
          } else {
            updateValidity(matrix[4][c5], `${4},${c5}`);
            count++;
          }
          region = [...tempRegion4];
          row = [...tempRow4];
          column = [...tempCol4];
          edge = [...tempEdge4];
        }
        region = [...tempRegion3];
        row = [...tempRow3];
        column = [...tempCol3];
        edge = [...tempEdge3];
      }
      region = [...tempRegion2];
      row = [...tempRow2];
      column = [...tempCol2];
      edge = [...tempEdge2];
    }
    region = [...tempRegion1];
    row = [...tempRow1];
    column = [...tempCol1];
    edge = [...tempEdge1];
  }
  region = [...tempRegion0];
  row = [...tempRow0];
  column = [...tempCol0];
  edge = [...tempEdge0];
}
console.log(count);
