class Solution(object):
    def searchInsert(self, nums, target):
        """
        :type nums: List[int]
        :type target: int
        :rtype: int
        """
        counter=0
        for i in nums:
            if i==target:
                return counter
            elif i>=target:
                return counter
            else:
                counter+=1
        return counter 
            
        