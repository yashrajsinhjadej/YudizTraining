let sizeofmatrix = 0
let counter=0
let form1=document.getElementById('myform')
form1.addEventListener('submit',function(){
        event.preventDefault()//stops form from refreshing the page'
        let size=document.getElementById('size').value
        sizeofmatrix=size
        if(size>4 && size<10){
            let matrix1=game(size)  //creating the game with random color and random solution 
            
            
            // displaying this matrix in frontend 
            let container=document.getElementById('container1')
            container.innerHTML='  '
            container.style.border='1px solid black'
            container.style.height=size*50
            container.style.width=size*50
            for(let i=0;i<size;i++){
                divinsidecontainer=document.createElement('div')
                divinsidecontainer.setAttribute('id',`${i}`)
                for(let j=0;j<size;j++){
                    box=document.createElement('div')
                    box.setAttribute("id",`${j} ${i}`)
                    box.setAttribute('class','box')
                    box.style.backgroundColor=matrix1[j][i].region
                    box.style.border="1px solid black"
                    box.style.height="50px"
                    box.style.width='50px'
                    divinsidecontainer.appendChild(box)
                }
                container.appendChild(divinsidecontainer)
            }


            //removing the queen position from the solution
            let matrix=removequeen(matrix1,size)

            //starting the game 
            start(matrix,size)
            let queen=document.getElementById('container1')
            counter=0
            queen.addEventListener('click',handleClick)
        
        }
})

function start(matrix,size){
    startobj=new checkvalue(matrix,size)
}


function game(size){
while (true){
    var makegame=new MakeGame(size)
    if(makegame.findspot()){
        break
    }
}
console.log('solution to the game')
makegame.printmatrix()
let matrix=makegame.getmatix()

return matrix
}
function removequeen(matrix,grid){
    for(let i=0;i<grid;i++){
        for(let j=0;j<grid;j++){
            matrix[i][j].isoccupied=false
            if(matrix[i][j].value==1){
                matrix[i][j].value=0
            }
        }
    }
    return matrix
}

class MakeGame {
    constructor(grid){
        console.log(grid)
        this.size=grid  //size of the matrix
        this.matrix = Array.from({ length: this.size }, () =>//creating a matrix of dynamic size  
            Array.from({ length: this.size }, () => ({ value: 0, region: ' ', isoccupied: false }))
        );
        this.tempmatrix=this.matrix //copy of the matrix
        this.color=this.color=['red','yellow','green','blue','orange','purple','aqua','lavender'] //colors to be assigned to the regions
        this.matrixlist=[]
    }
    printmatrix(){
        console.table(this.matrix.map(row => 
            row.map(cell => `V:${cell.value} | R:${cell.region}`)
        ));
        
    }

    findspot(){
        for(let i=0;i<this.size;i++){
            var temparr=[]
            var counter=0
            for (let j =0;j<this.size;j++){
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
                if(newRow >= 0 && newRow < this.size && newCol >= 0 && newCol < this.size){
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
            if(newrow>=0 &&newrow<this.size &&newcolumn>=0&&newcolumn<this.size){
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
        for(let i=0;i<this.size;i++){
            this.matrix[row][i].isoccupied+=1
            this.matrix[i][column].isoccupied+=1
        }
    }
    
    getmatix()
    {return this.matrix}
}




class checkvalue{
    
    constructor(matrix,grid){
        this.matrix=matrix
        this.size=grid
    }


    printmatrix(){
        console.table(this.matrix.map(row => 
            row.map(cell => `V:${cell.value} | R:${cell.region}`)
        ));
        
    }

    

    checkgameover(){
        for(let i=0;i<this.size;i++){
            for (let j=0;j<this.size;j++){
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
        for(let i=0;i<this.size;i++){
        for(let j=0;j<this.size;j++){
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
            if(newrow>=0 &&newrow<this.size &&newcolumn>=0&&newcolumn<this.size){
                if (this.matrix[newrow][newcolumn].value==1)
                    {
                        return false
                    }
                    
            }
        }
        
        return true 
    }
    setregion(row,colums){
        for(let i=0;i<this.size;i++){
            for(let j=0;j<this.size;j++){
                if(this.matrix[i][j].region==this.matrix[row][colums].region){
                    this.matrix[i][j].isoccupied=true
                }
            }
        }
    } setoccupied(row,column){
        for(let i=0;i<this.size;i++){
            this.matrix[row][i].isoccupied=true
            this.matrix[i][column].isoccupied=true
        }
    }

    setedge(row,column){
        var matrix1=[[-1,-1],[-1,1],[1,-1],[1,1]]
        for(let i=0;i<4;i++){
            let newrow=row-matrix1[i][0]
            let newcolumn=column-matrix1[i][1]
            if (newrow>=0 && newrow<this.size && newcolumn>=0 && newcolumn<this.size){
                this.matrix[newrow][newcolumn].isoccupied=true
            }
    }}

    }



    function handleClick (event) {
        let text=document.createTextNode('👑')
        //  console.log(event.target)
         let box=event.target 
         if(box.className=='box'){
            let rowcolumn=box.id
            let [row,col]=rowcolumn.split(' ')
            console.log(row,col)
         
            let checkstatus=startobj.check(row,col)
            if(checkstatus==true)
                {
                    counter+=1
                    console.log(counter)
                    startobj.matrix[row][col].value=1
                    startobj.matrix[row][col].isoccupied=true
                    startobj.setoccupied(row,col)
                    startobj.setregion(row,col)
                    startobj.setedge(row,col)
                    box.appendChild(text)
                    if(counter==sizeofmatrix){
                        console.log('congratulation you won the game')
                    }
                    startobj.printmatrix()
            }
            else{
                console.log('invalid')
            }
            let flag=startobj.checkgameover()
            if(flag && counter!=5){
                console.log(counter)
                console.log('game over')
                queen=document.getElementById('container1')
                console.log(queen)
                queen.removeEventListener('click',handleClick)
            }
    
         }
    }



