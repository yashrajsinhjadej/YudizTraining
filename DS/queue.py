class Queue:
    def __init__(self):
        self.first = -1
        self.last = -1
        self.size = 100
        self.list = [None] * self.size

    def enqueue(self, value):
        if self.last == self.size - 1:
            print("Queue overflow")
            return
        if self.first == -1:
            self.first = 0
        self.last += 1
        self.list[self.last] = value

    def dequeue(self):
        if self.first == -1 or self.first > self.last:
            print("Queue underflow")
            return
        print(f"Dequeued: {self.list[self.first]}")
        self.list[self.first] = None
        self.first += 1
        if self.first > self.last:
            self.first = -1
            self.last = -1

    def display(self):
        if self.first == -1:
            print("Queue is empty")
        else:
            print("Queue contents:", self.list[self.first : self.last + 1])
q = Queue()
q.enqueue(1)
q.enqueue(2)
q.enqueue(3)
q.display()  
q.dequeue()  # Output: Dequeued: 1
q.display()  # Output: Queue contents: [2, 3]
q.dequeue()  # Output: Dequeued: 2
q.dequeue()  # Output: Dequeued: 3
q.dequeue()  # Output: Queue underflow
q.display()  # Output: Queue is empty
