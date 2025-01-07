def threesome(nums):
    list=[]
    for i in range(len(nums)):
        for j in range(i+1,len(nums)):
            for k in range(j+1,len(nums)):
                print(i+j+k)
                if nums[i]+nums[j]+nums[k]==0:
                    list.append([nums[i],nums[j],nums[k]])
    print(list)
threesome([-1,0,1,2,-1,-4])