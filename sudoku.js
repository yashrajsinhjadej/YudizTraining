    let sizeofmatrix = 0
    let counter=0
    let form1=document.getElementById('myform')

    form1.addEventListener('submit',function(){
            event.preventDefault()//stops form from refreshing the page'
            let size=document.getElementById('size').value
            sizeofmatrix=size
            let message=document.getElementById('message')
            if(size>4 && size<10){
                let matrix1=game(size)  //creating the game with random color and random solution 
                message.innerHTML=' '
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
            else{
            text='Enter Valid Number'
                message.innerHTML=' '
                let textcontent = document.createTextNode(text)
                message.appendChild(textcontent)
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
            this.size=grid  //size of the matrix
            this.matrix = Array.from({ length: this.size }, () =>//creating a matrix of dynamic size  
                Array.from({ length: this.size }, () => ({ value: 0,region: ' '}))
            );
            this.tempmatrix=this.matrix //copy of the matrix
            this.color=this.color=['indigo','yellow','green','blue','orange','purple','aqua','lavender'] //colors to be assigned to the regions
            this.matrixlist=[]
        }
        printmatrix(){
            console.table(this.matrix.map(row => 
                row.map(cell => `V:${cell.value} | R:${cell.region}`)
            ));
            
        }
        checkrowcol(row,col)
        {
            for(let i=0;i<this.size;i++){
                if(this.matrix[row][i].value==1 || this.matrix[i][col].value==1){
                    return false
                }
            }
            return true
        }

        findspot(){
            for(let i=0;i<this.size;i++){
                var temparr=[]
                var counter=0
                for (let j =0;j<this.size;j++){
                    if(this.checkrowcol(j,i)){
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
        
        check(row,column){
            for(let i=0;i<this.size;i++){
                if(this.matrix[row][i].value==1||this.matrix[i][column].value==1){
                    return false
                }
            }
            return this.checkRegion(row,column)
        }
        checkRegion(row,column)
        {
            let reg=this.matrix[row][column].region
            // console.log(this.matrix)
            let counter1=0
            for(let i=0;i<this.size;i++){
                for(let j=0;j<this.size;j++){
                if(this.matrix[j][i].region===reg){
                    if(this.matrix[j][i].value===1){
                        return false
                    }
                    
                }
                }
            }
            return this.checkedge(row,column)
            }

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
        }



        function handleClick (event) {
            let text=document.createTextNode('♛')
            let message=document.getElementById('message')
            message.innerHTML=' '
            let box=event.target 


            if(box.className=='box'){
                if(box.textContent){
                    counter-=1
                    let deletestring=box.id
                    let [delrow,delcol]=deletestring.split(' ')
                    startobj.matrix[delrow][delcol].value=0
                    box.textContent=""
                }else{
                let rowcolumn=box.id
                let [row,col]=rowcolumn.split(' ')
                let checkstatus=startobj.check(row,col)
                if(checkstatus)
                    {
                        
                        counter+=1
                        startobj.matrix[row][col].value=1
                        box.appendChild(text)
                        // startobj.printmatrix()
                        if(counter==sizeofmatrix){
                            let queen=document.getElementById('container1')
                            text='You Won'
                            textcontent=document.createTextNode(text)
                            message.appendChild(textcontent)
                            queen.removeEventListener('click',handleClick)
                        }
                        // startobj.printmatrix()
                }
                else{
                    let originalColor = box.style.backgroundColor;
                    box.style.backgroundColor = "red";
                    setTimeout(() => {
                        box.style.backgroundColor = originalColor;
                        
                    }, 500);
                }

            }}
        }



