class Solution(object):
    def longestValidParentheses(self, s):
        """
        :type s: str
        :rtype: int
        """
        counter=0
        large=0
        list=[]
        list2=[0]*len(s)
        for i in range(len(s)):
            if s[i]=='(':
                list.append(i)
                list2[i]=0
            else:
                if not list:
                    pass
                else:
                    temp=list.pop()
                    list2[temp]=1
                    list2[i]=1
        list2.append(0)
        print(list2)
        counter=0
        large=0
        for i in list2:
            if i==1:
                counter+=1
            else:
                if large<counter:
                    large=counter
                counter=0
        return large
