let matrix = [
    [1, 1, 1, 3, 1],
    [1, 1, 1, 1, 1],
    [4, 5, 1, 1, 1],
    [1, 1, 1, 5, 1],
    [1, 1, 1, 2, 1]
  ]
let hello =[]
const colors = ['red','yellow','blue','green','purple','orange','pink'];
for (let i=0;i<matrix.length;i++){
  for (let j=0;j<matrix.length;j++){
    matrix[i][j] = {'region':colors[matrix[i][j]]}
  }
}
size=matrix.length
// /console.log(matrix)
// console.log(findspot(matrix))
console.log(matrix)

console.log(checkMatrix(matrix))
function checkMatrix(matrix){
    let result = []
    

}