/* 
 * Abstraction means hiding of implementation details from the user for eg if you are a 
 * car driver you do not need to know how the car mechanics work you are given methods liken
 * start stop accelearate brake with using this methods you can drive the car 
 */

public class Abstraction {
    public static void main(String[] args) {
        vehicle obj = new car();    
        obj.start();
        obj.stop();
    }
}


abstract class vehicle {
    public abstract void start();
    public abstract void stop();
}
class car extends vehicle{
    public void start(){
        System.out.println("the car has started");
    }
    public void stop(){
        System.out.println("the car has stopped");
    }
}