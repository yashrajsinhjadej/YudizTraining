const { ReadFromFile } = require("../utils/readfile.js");
const { WriteToFile } = require("../utils/writeFile.js");
const { Item } = require("../models/class.js");
const { checkId} = require("../validations/newitem");
const { responseHandler } = require("../utils/response.js");


async function updateItemById(req, res) {
  let {sName,nQuantity,nPrice} = req.body;
  let {pId} = req.params;
  if (!checkId(pId)) {
    responseHandler(res, { statusmsg: "BadRequest", sMsg: "validation wrong" });
  } 
  else
   {
        try {
            let sData = await ReadFromFile();
            let aData = JSON.parse(sData);
            let bflag = aData.some((obj) => {
            return obj.sName == sName && obj.pId !=pId;
            });
            if (bflag) {
                    return responseHandler(res, {statusmsg: "BadRequest",sMsg: "Item already exists"}); //pass object as status and msg
            } 
            else {
                let flag = false;
                aData.forEach((element) => {
                if (element.pId == pId) {
                    element.sName = sName;
                    element.nQuantity = +nQuantity;
                    element.nPrice = +nPrice;
                    flag = true;
                }
                });
                if (!flag) {
                responseHandler(res, {statusmsg: "NotFound",sMsg: "Item not found"}); //pass object as status and msg
                }
                sData = JSON.stringify(aData);
                await WriteToFile(sData);
                responseHandler(res, {statusmsg: "OK",sMsg: "Item updated successfully",sData: {sName,nQuantity,nPrice}}); //pass object as status and msg
      }
    } catch (err) {
      responseHandler(res, {
        statusmsg: "InternalServerError",
        sMsg: "there was error in the file",
      }); //pass object as status and msg
    }
  }
}

module.exports = { updateItemById };
