class Solution(object):
    def nextGreaterElements(self, nums):
        n = len(nums)
        ans = [-1] * n  # Initialize the result array with -1
        stack = []  # This will store indices

        # Traverse the array twice to handle the circular condition
        for i in range(2 * n):
            while stack and nums[stack[-1]] < nums[i % n]:
                # Update the result for the index at the top of the stack
                ans[stack.pop()] = nums[i % n]
            if i < n:
                stack.append(i % n)
        
        return ans

