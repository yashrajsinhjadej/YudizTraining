
const { v4: uuidv4 } = require('uuid');
class Item {
    constructor(sName,nQuantity,nPrice){
        this.pId=uuidv4()
        this.sName=sName
        this.nQuantity=nQuantity
        this.nPrice=nPrice
        if(nQuantity){
            this.bStatus=true
        }
        else{
            this.bStatus=false
        }

        this.dCreatedDate=new Date()
        this.dUpdatedate=new Date()
    }
}

module.exports={Item}