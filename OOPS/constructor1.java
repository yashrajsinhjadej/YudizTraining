public class constructor1 {
    public static void main(String[] args) {
        Person obj = new Person("yash");
    }
}

class Person{
    String name = "";
    public Person(String name)
    {
        this.name=name;
        System.out.println(name);
    }

}
/* 
 * constructor is a special method in class which is directly called when the object 
 * is initiated or created it has the same name as class , no return type and called 
 * automatically this is mainly used to initialize the data types , when we create a 
 * class without a constructor it makes default constructor 
 * 
 * 
A destructor is a special method in a class that automatically runs when an 
object is destroyed. 
It’s used to clean up resources like memory or files that the object was using.
 */