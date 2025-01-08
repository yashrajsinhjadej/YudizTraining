class stack:
    def __init__(self):
        self.top=-1
        self.list=[]
    def push(self,number):
        self.top+=1
        """ self.list[self.top]=number for these way we have to predefine the size of the list"""
        self.list.append(number)
    def pop(self):
        if self.top==-1:
            print('out of index')
        else:
            print(self.list[self.top])
            self.top-=1
    def is_empty(self):
        if self.top==-1:
            return True 
        else:
            return False
    def peek(self):
        if self.top==-1:
            print('stack is empty')
        else:
            print(self.list[self.top])

    def size(self):
        if self.top==-1:
            print('stack is empty')
        else:
            return self.top+1

stack = stack()
stack.push(1)
stack.push(2)
stack.push(3)

stack.pop()
stack.peek()
stack.is_empty()
stack.size()