/* 
 * when  a single child extends single parent is know as simpleinheritance
 * here child class has the access of all the parent class methods 
 */

public class simpleInheritance {
public static void main(String[] args) {
    Parent obj = new Parent();
    obj.method();
    child obj1 = new child();
    obj1.method();
    obj1.child1();
}    
}
class Parent{
    public void method(){
        System.out.println("parent method is called");
    }
}
class child extends Parent{
    public void child1(){
        System.out.println("child is called ");
    }
}
