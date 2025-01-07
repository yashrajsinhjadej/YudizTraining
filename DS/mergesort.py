class Solution(object):
    def merge(self, nums1, m, nums2, n):
        """
        :type nums1: List[int]
        :type m: int
        :type nums2: List[int]
        :type n: int
        :rtype: None Do not return anything, modify nums1 in-place instead.
        """
        for i in range(n):
            nums1[m]=nums2[i]
            m+=1
        n=len(nums1)
        for i in range(n):  
            for j in range(0, n-i-1):  
                if nums1[j] > nums1[j+1]:  
                    nums1[j], nums1[j+1] = nums1[j+1], nums1[j]
        return nums1

        