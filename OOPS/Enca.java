public class Enca{
   public static void main(String[] args) {
    Account obj = new Account("yash",5000);
    obj.checkbalance();
    obj.deposit(2000);
    obj.checkbalance();
    obj.withdraw(1000);
    obj.checkbalance();
    obj.withdraw(10000);
   }
}
class Account{
    private String name = "";
    private int balance = 0;
    Account(String name,int balance){
        this.name=name;
        this.balance=balance;
    }

    public void deposit(int amount)
    {
        this.balance+=amount;
        System.out.println("amount added");
    }

    public void withdraw(int amount){
        if(amount>balance){
            System.out.println("error");
        }
        else{
            balance-=amount;
            System.out.println("withdraw success ");
        }
    }
    public void checkbalance(){
        System.out.println(this.balance);
    }
}