const uuid = require('uuid')

function checkvalidation(oData){
    if((oData.sName==undefined||oData.nQuantity==undefined||oData.nPrice==undefined)||Object.keys(oData).length!=3){
        return false
    }
    else if(!(/^[a-zA-Z0-9]+/.test(oData.sName) && !(/^\d+/.test(oData.sName))&& /^\d+/.test(oData.nQuantity) && /^\d+/.test(oData.nPrice))){

        return false
    }
    else{
        return true 
    }
}
function checkId(pId){
    if(!uuid.validate(pId)){
        // console.log('fasle')
        return false
    }
    else{
        return true 
    }
}

module.exports ={checkvalidation,checkId}