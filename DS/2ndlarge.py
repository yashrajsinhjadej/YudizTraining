class Solution:
    def getSecondLargest(self, arr):
        # Code Here
        large=0
        secondlarge=0
        for i in arr:
            if i > large:
                secondlarge=large
                large=i
            if i>secondlarge and i<large:
                secondlarge=i
        if secondlarge==0:
            secondlarge=-1
        return secondlarge