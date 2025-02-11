var readlineSync = require('readline-sync');
deletematrix=[]
console.log('Welcome to the Game')
const matrix = [
    [{value:0,region:'pink',isoccupied:'false'},{value:0,region:'pink',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'blue',isoccupied:'false'}],
    [{value:0,region:'pink',isoccupied:'false'},{value:0,region:'pink',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'blue',isoccupied:'false'}],
    [{value:0,region:'pink',isoccupied:'false'},{value:0,region:'red',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'},{value:0,region:'blue',isoccupied:'false'}],
    [{value:0,region:'red',isoccupied:'false'},{value:0,region:'red',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'}],
    [{value:0,region:'red',isoccupied:'false'},{value:0,region:'red',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'}],
    
];

console.table(matrix.map(row => row.map(cell => cell.value)));
console.table(matrix.map(row => row.map(cell => cell.region)));

while (true){
    let choice = readlineSync.question('choose 1 to add the star , choose 2 to delete , choose 3 to exit')
    if (choice==1){
    let row = readlineSync.question('enter the row number');
    let column = readlineSync.question('enter the column number');
    if (row<0 || row>5 || column<0 || column>5 ){
        console.log('invalid try again')
        continue
    }
    let checkstatus=check(row,column)
    console.log(checkstatus)
    if (checkstatus==true){
        deletematrix.push([row,column])
       matrix[row][column].value=1
       matrix[row][column].isoccupied=true
       setoccupied(row,column)
       setregion(row,column)
       setedge(row,column)
    }
    else
    {
        console.log('invalid')
    }
    console.table(matrix.map(row => row.map(cell => cell.value)));
    console.table(matrix.map(row => row.map(cell => cell.region)));
    console.table(matrix.map(row=>row.map(cell=>cell.isoccupied)))
    }
    else if(choice==3)
{
    break
}
else{
    console.log('delete kale')
}

}

function check(row,column){
    if (matrix[row][column].isoccupied==true){
        return false
    }
    else{
        console.log('check colum done ')
        return checkRegion(row,column)

    }
}
function checkRegion(row,column)
{
    reg=matrix[row][column].region
    for(i=0;i<5;i++){
       for(j=0;j<5;j++){
        if(matrix[i][j].region==reg){
            if(matrix[i][j].value==1){
                console.log('region false')
                return false
            }
       }
    }
    console.log('check region done')
    return checkedge(row,column)
    }}

function checkedge(row,column)
{
    var matrix1=[[-1,-1],[-1,1],[1,-1],[1,1]]
    for(i=0;i<4;i++){
        newrow=row-matrix1[i][0]
        newcolumn=column-matrix1[i][1]
        if(newrow>=0 &&newrow<5 &&newcolumn>=0&&newcolumn<5){
            if (matrix[newrow][newcolumn].value==1)
                {
                    return false
                }
                
        }
    }
    console.log('checkedge done')
    return true 
}
function setregion(row,colums){
    for(i=0;i<5;i++){
        for(j=0;j<5;j++){
            if(matrix[i][j].region==matrix[row][colums].region){
                matrix[i][j].isoccupied=true
            }
        }
    }
}
function setoccupied(row,column){
    for(i=0;i<5;i++){
        matrix[row][i].isoccupied=true
        matrix[i][column].isoccupied=true
    }
}

function setedge(row,column){
    var matrix1=[[-1,-1],[-1,1],[1,-1],[1,1]]
    for(i=0;i<4;i++){
        console.log(matrix1[i][0])
        newrow=row-matrix1[i][0]
        newcolumn=column-matrix1[i][1]
        if (newrow>=0 && newrow<5 && newcolumn>=0 && newcolumn<5){
            matrix[newrow][newcolumn].isoccupied=true
        }
}}
