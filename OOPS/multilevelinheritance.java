public class multilevelinheritance {
    public static void main(String[] args) {
        
    }
}
class a{
    public void a(){
        System.out.println("method a is called");
    }
}
class b extends a{
    public void b(){
        System.out.println("method b is called");
    }
}
class c extends b{
    public void c(){
        System.out.println("method c is called ");
    }
}
/* 
 * in multilevel inheritance child is derived from a parent which is also derived by other 
 * parent for eg class a , b extends a, c extends c 
 */