var readlineSync = require('readline-sync');


class checkvalue{
    
    constructor(matrix){
        this.matrix=matrix
    }


    printmatrix(){
        console.table(this.matrix.map(row => 
            row.map(cell => `V:${cell.value} | R:${cell.region}`)
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
        if(flag){
            this.printmatrix()
            console.log('game over you cant win')
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
                if (this.matrix[i][j].isoccupied==false){
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
            let newrow=row-matrix1[i][0]
            let newcolumn=column-matrix1[i][1]
            if (newrow>=0 && newrow<5 && newcolumn>=0 && newcolumn<5){
                this.matrix[newrow][newcolumn].isoccupied=true
            }
    }}
}





class MakeGame {
    constructor(){
        this.matrix = [
            [{ value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }],
            [{ value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }],
            [{ value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }],
            [{ value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }],
            [{ value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }, { value: 0, region: ' ', isoccupied: 0 }],
        ];
        this.tempmatrix=this.matrix
        this.color=['red','yellow','green','blue','orange']
        this.matrixlist=[]
    }
    printmatrix(){
        console.table(this.matrix.map(row => 
            row.map(cell => `V:${cell.value} | R:${cell.region}`)
        ));
        
    }

    findspot(){
        for(let i=0;i<5;i++){
            var temparr=[]
            var counter=0
            for (let j =0;j<5;j++){
                if(this.matrix[j][i].isoccupied==0){
                    if (this.findedge(j,i)){
                    temparr.push([j,i])
                }
                else{
                    counter+=1
                }
            }
            }
            if(counter==5){
                return false
            }
            if(temparr.length<=0){
                return false}
            this.assignspot(temparr)
        }
        this.assigncolor()

        return true 
    }

    assigncolor(){
        var temp=0
        while(this.matrixlist.length>0){
            var random=Math.floor(Math.random() * this.matrixlist.length);
            var [row,column]=this.matrixlist[random]
            var plus=[]
            var tomakeplus=[[-1,0],[0,1],[1,0],[0,-1]]
            for(let i=0;i<4;i++)
            {
                var [k,p]=tomakeplus[i]
                var [newRow, newCol] = [row + k, column + p];
                if(newRow >= 0 && newRow < 5 && newCol >= 0 && newCol < 5){
                    if(this.matrix[newRow][newCol].region==' '){
                        
                    plus.push([newRow,newCol])
                }
                }
                else{
                    continue
                }
            }
            if(plus.length===0){  
                this.matrixlist = this.matrixlist.filter(([r, c]) => !(r === row && c === column));
            }
            else{
                var random2=Math.floor(Math.random() * plus.length);
                var [newrow1,newcolumn1]=plus[random2]
                this.matrix[newrow1][newcolumn1].region=this.matrix[row][column].region
                this.matrixlist.push([newrow1, newcolumn1]);
            }
            }
        }


    findedge(row,column){
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
        return true
    }

    assignspot(temparr){
        var max=temparr.length
        var outcomes=Math.floor(Math.random() * max); 
        this.setvalue(temparr[outcomes])
        
    }

    setvalue([row,column]){
        this.matrixlist.push([row,column])
        this.matrix[row][column].value=1
        this.matrix[row][column].region=this.color.pop()
        for(let i=0;i<5;i++){
            this.matrix[row][i].isoccupied+=1
            this.matrix[i][column].isoccupied+=1
        }
    }
    
    getmatix()
    {return this.matrix}
}


while (true){
    var makegame=new MakeGame()
    if(makegame.findspot()){
        break
    }
}
console.log('solution to the game')
makegame.printmatrix()

const matrix = makegame.getmatix()

for(let i=0;i<5;i++){
    for(let j=0;j<5;j++){
        matrix[i][j].isoccupied=false
        if(matrix[i][j].value==1){
            matrix[i][j].value=0
        }
    }
}

console.log('startgame')
var start = new checkvalue(matrix)
start.startgame()
