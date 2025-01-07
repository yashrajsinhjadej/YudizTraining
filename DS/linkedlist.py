class Solution(object):
    def middleNode(self, head):
        """
        :type head: Optional[ListNode]
        :rtype: Optional[ListNode]
        """
        length=0
        temp=head
        while temp!=None:
            length+=1
            temp=temp.next
        length=length/2
        while length!=0:
            head=head.next
            length-=1
        return head 
