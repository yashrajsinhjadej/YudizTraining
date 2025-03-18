var maxSubArray = function(nums) {
    let maxending=nums[0];
    let res=nums[0]
    i=1
    counter=0
    let maxnegative=-Infinity
    if(nums[0]<0){counter+=1,maxnegative=nums[0]}
    // maxnegative=-Infinity
    while(i<nums.length){
        
       maxending+=nums[i]
       res=Math.max(res,maxending)
       if(nums[i]>maxending){
        res=nums[i]
        maxending=nums[i]
        // console.log(maxending)
       }
       
       if(nums[i]<0){
           counter++
           maxnegative=Math.max(maxnegative,nums[i])
       }
       i++
    }
    if(counter==nums.length){
        return maxnegative
    }
    return res
};

console.log(
    maxSubArray([0,-2,-3]) )