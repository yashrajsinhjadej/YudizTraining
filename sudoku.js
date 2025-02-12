var readlineSync = require('readline-sync');


class checkvalue{
    constructor(matrix){
        this.matrix=matrix
    }


    printmatrix(){
        console.table(this.matrix.map(row => 
            row.map(cell => `V:${cell.value} | R:${cell.region} | P:${cell.isoccupied}`)
        ));
        
    }

    startgame(){
        var counter =0
        while (true){
        this.printmatrix()
        let choice = readlineSync.question('choose 1 to add the star , choose 2 to delete , choose 3 to exit')
        if (choice==1){
        let row = readlineSync.question('enter the row number');
        let column = readlineSync.question('enter the column number');
        if (row<0 || row>5 || column<0 || column>5 ){
            console.log('invalid try again')
            continue
        }
        let checkstatus=this.check(row,column)
        console.log(checkstatus)
        if (checkstatus==true){
            counter+=1
            this.matrix[row][column].value=1
            this.matrix[row][column].isoccupied=true
            this.setoccupied(row,column)
            this.setregion(row,column)
            this.setedge(row,column)
        if(counter==5){ 
            console.log('congratulations you won the game')
            this.printmatrix()
            break
        }
        let flag=this.checkgameover()
        console.log('flag',flag)
        if(flag){
                console.log('game over you cant win')
                this.printmatrix()
                break     
            }
        }
        else
        {
            console.log('invalid')
        }
        }
        else if(choice==3){
        break
        }
        else{
        continue
        }

    }}

    checkgameover(){
        for(let i=0;i<5;i++){
            for (let j=0;j<5;j++){
                if (this.matrix[i][j].isoccupied=="false"){
                    return false
                }
            }
        }
        return true
    }
    check(row,column){
        if (this.matrix[row][column].isoccupied==true){
            return false
        }
        else{
            console.log('check colum done ')
            return this.checkRegion(row,column)

        }
    }
    checkRegion(row,column)
    {
        var reg=this.matrix[row][column].region
        for(let i=0;i<5;i++){
        for(let j=0;j<5;j++){
            if(this.matrix[i][j].region==reg){
                if(this.matrix[i][j].value==1){
                
                    return false
                }
        }
        }
        
        return this.checkedge(row,column)
        }}

    checkedge(row,column)
    {
        var matrix1=[[-1,-1],[-1,1],[1,-1],[1,1]]
        for(let i=0;i<4;i++){
            let  newrow=row-matrix1[i][0]
        let  newcolumn=column-matrix1[i][1]
            if(newrow>=0 &&newrow<5 &&newcolumn>=0&&newcolumn<5){
                if (this.matrix[newrow][newcolumn].value==1)
                    {
                        return false
                    }
                    
            }
        }
        console.log('checkedge done')
        return true 
    }
    setregion(row,colums){
        for(let i=0;i<5;i++){
            for(let j=0;j<5;j++){
                if(this.matrix[i][j].region==this.matrix[row][colums].region){
                    this.matrix[i][j].isoccupied=true
                }
            }
        }
    } setoccupied(row,column){
        for(let i=0;i<5;i++){
            this.matrix[row][i].isoccupied=true
            this.matrix[i][column].isoccupied=true
        }
    }

    setedge(row,column){
        var matrix1=[[-1,-1],[-1,1],[1,-1],[1,1]]
        for(let i=0;i<4;i++){
            console.log(matrix1[i][0])
            let newrow=row-matrix1[i][0]
            let newcolumn=column-matrix1[i][1]
            if (newrow>=0 && newrow<5 && newcolumn>=0 && newcolumn<5){
                this.matrix[newrow][newcolumn].isoccupied=true
            }
    }}
}



console.log('Welcome to the Game')
const matrix = [
    [{value:0,region:'pink',isoccupied:'false'},{value:0,region:'pink',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'blue',isoccupied:'false'}],
    [{value:0,region:'pink',isoccupied:'false'},{value:0,region:'pink',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'blue',isoccupied:'false'}],
    [{value:0,region:'pink',isoccupied:'false'},{value:0,region:'red',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'},{value:0,region:'blue',isoccupied:'false'}],
    [{value:0,region:'red',isoccupied:'false'},{value:0,region:'red',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'}],
    [{value:0,region:'red',isoccupied:'false'},{value:0,region:'red',isoccupied:'false'},{value:0,region:'grey',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'},{value:0,region:'yellow',isoccupied:'false'}],
    
];

class MakeGame {
    constructor(){
        this.matrix=[]
    }
}




var start = new checkvalue(matrix)
start.startgame()
