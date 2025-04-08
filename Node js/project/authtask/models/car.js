const { v4: uuidv4 } = require('uuid');
class car{
    constructor(sName,sModel,dYear,sColor,sFuel,sType)
    {
        this.pId=uuidv4()
        this.sName=sName
        this.sModel=sModel
        this.dYear=dYear
        this.sColor=sColor
        this.sFuel=sFuel
        this.sType=sType
    }
}


module.exports={car}