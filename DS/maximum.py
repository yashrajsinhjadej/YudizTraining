class Solution(object):
    def maxSubArray(self,nums):
        """
        :type nums: List[int]
        :rtype: int
        """
        list=[]
        obj=Solution()
        for i in range(len(nums)):
            list.append(obj.findlarge(nums))
            nums.pop(0)
        large=0
        for i in list:
            if i>large:
                large=i
        return large

    def findlarge(self,nums):
        sum=0
        largest=0
        for i in nums:
            sum+=i
            if sum>largest:
                largest=sum 
        return largest
 
