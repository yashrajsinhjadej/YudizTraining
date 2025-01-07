import random
class Solution(object):

    def sumZero(self, n):
        """
        :type n: int
        :rtype: List[int]
        """
        list=[]
        if n%2==1:
            list.append(0)
            n=n-1
        temp=n
        for i in range(n/2):
            list.append(temp)
            list.append(-temp)
            temp-=1
        return list 