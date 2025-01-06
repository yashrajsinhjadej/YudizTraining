/*  
 * Polymorphism means many form , it helps us to use the same class in different forms like 
 * turnon function of remote can be used to turn on so many devices based on the object it is 
 * connnected to so this is known as polymorphism 
 */

class Remote{
    public void Turnon(){
        System.out.println("device is turned on");
    }
}
class Tv extends Remote{
    public void Turnon(){
        System.out.println("tv is turned on");
    }
}

class Speaker extends Remote{
    public void Turnon(){
        System.out.println("speaker is turned on");
    }
}
class fan extends Remote{
    public void Turnon(){
        System.out.println("fan is turned on");
    }
}

public class Polymorphism{
    public static void main(String[] args) {
        Remote obj = new Remote();//making instance of Remote class or parent class
        obj.Turnon();

        Remote obj1=new Tv();  // making instance of Tv class
        obj1.Turnon();

        Remote obj2 = new fan(); //making instance of fan class 
        obj2.Turnon(); 

        Remote obj3 = new Speaker(); // making instance of remote class 
        obj3.Turnon();

    }
}
