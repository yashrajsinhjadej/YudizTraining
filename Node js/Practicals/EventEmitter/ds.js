    matrix=[[0,1,2,0],[3,4,5,2],[1,3,1,5]]
        size=matrix[0].length

        // undefined set karva mate che 
        for(let row=0;row<matrix.length;row++){
            for(let col=0;col<size;col++){
                if(matrix[row][col]==0){
                    matrix[row][0]=undefined
                    // console.log(matrix)
                    matrix[0][col]='@'
                    // console.log(matrix)
                    // console.log(matrix[0][col])
                }
            }

        }
        console.log(matrix)
        // 0 set karva mate che
        for(let i=0;i<matrix.length;i++){
            if(matrix[i][0]===undefined){
                for(let j= 0;j<size;j++){
                    if(matrix[i][j]!==undefined && matrix[i][j]!=='@'){
                        matrix[i][j]=0
                    }
                }
            }
        }
    console.log(matrix)
    //column 0 set karva mate che
        for(let i=0;i<size;i++)
        {
            if(matrix[0][i]==='@'){
                // 0 i 
                for(let j=1;j<matrix.length;j++){
                    if(matrix[j][i]!=='@'){
                    matrix[j][i]=0}
                }
            }
        }
        // console.log(matrix)
        // first row and first column set karva mate che
        for(let i=0 ;i<matrix.length;i++){
            if(matrix[i][0]===undefined){
                matrix[i][0]=0
            }
        }
        for(let i=0;i<matrix[0].length;i++){
            if(matrix[0][i]==='@'){
                matrix[0][i]=0
            }
        }
console.log(matrix)