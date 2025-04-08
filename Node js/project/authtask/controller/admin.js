const { ReadFromFile, WriteToFile } = require('../utils/fileoperation');
const {car}=require('../models/car')
const { responseHandler } = require('../utils/responseHandler');
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
require('dotenv').config

async function login(req,res){
    try{
        const {Email,password}= req.body
        const admindata = await ReadFromFile(process.env.ADMIN_FILEPATH)
        const data = JSON.parse(admindata)
        const find = data.find((item)=>item.Email==Email)
        if(find){
        const check = bcrypt.compareSync(password,find.password,10)
        if(check)
            {
                   const token = jwt.sign({Email},process.env.ADMIN_SECRET_KEY,{'expiresIn':'15d'})
                   if(find.loggeddevice.length==2){
                    find.loggeddevice.shift()
                   }
                   find.loggeddevice.push(token)
                   await WriteToFile(JSON.stringify(data),process.env.ADMIN_FILEPATH)
                responseHandler(res,{statusmsg:'OK',sMsg:"token generated",sData:token})
            }
        else{
            responseHandler(res,{statusmsg:"BadRequest",sMsg:"password not correct"})
        }        
    }
    else{
        responseHandler(res,{statusmsg:"BadRequest",sMsg:"email not found"})
    }
    }
    catch(err){
        console.log(err)
        responseHandler(res,{statusmsg:"InternalServerError",sMsg:'something went wrong'})
    }
}   

async function logout(req,res){
    try{
            const token = req.headers['authorization']
            const userdata = await ReadFromFile(process.env.ADMIN_FILEPATH)
            const data = JSON.parse(userdata)
            const decode = jwt.verify(token,process.env.ADMIN_SECRET_KEY)
            const find = data.find((item)=>item.Email==decode.Email)
            console.log(token)
            if(!find)
                {
                    responseHandler(res,{statusmsg:"BadRequest",sMsg:'cannot find the emailid'})
                }
            else{
                const filter = find.loggeddevice.filter((item)=>item!=token)
                find.loggeddevice=filter    
                console.log('erhe')        
                console.log(process.env.ADMIN_FILEPATH)
                await WriteToFile(JSON.stringify(data), process.env.ADMIN_FILEPATH)
                responseHandler(res,{statusmsg:"OK",sMsg:'you are logged out'})
                console.log('here')
    
            }
        }
        catch(err){
            responseHandler(res,{statusmsg:"InternalServerError",sMsg:'something went wrong'})
        }
}

async function addcar(req,res)
{
    try{
    const {sName,sModel,dYear,sColor,sFuel,sType}=req.body
    // console.log(process.env.CARS_FILEPATH)
    const carData = await ReadFromFile(process.env.CARS_FILEPATH)
    const data = JSON.parse(carData)
    const newcar = new car(sName,sModel,dYear,sColor,sFuel,sType)
    data.push(newcar)
    await WriteToFile(JSON.stringify(data),process.env.CARS_FILEPATH)
    responseHandler(res,{statusmsg:"Create",sMsg:'car added successfully',sData:newcar})
}
catch(err){
    console.log(err)
    responseHandler(res,{statusmsg:"InternalServerError",sMsg:'something went wrong'})
}
}


async function updatecar(req,res){
    try{
        const {id}=req.params
        const {sName,sModel,dYear,sColor,sFuel,sType}=req.body
        // console.log(sName)
        const carData = await ReadFromFile(process.env.CARS_FILEPATH)
        const data = JSON.parse(carData)
        // console.log(data)
        const find = data.find((item)=>item.pId==id)
        if(!find){
            responseHandler(res,{statusmsg:"BadRequest",sMsg:'car not found'})
        }
        else{
            find.sName=sName
            find.sModel=sModel
            find.dYear=dYear
            find.sColor=sColor
            find.sFuel=sFuel
            find.sType=sType
            console.log(find)
            await WriteToFile(JSON.stringify(data),process.env.CARS_FILEPATH)
            responseHandler(res,{statusmsg:"OK",sMsg:'car updated successfully',sData:find})
        }
    }
    catch(err){
        console.log(err)
        responseHandler(res,{statusmsg:"InternalServerError",sMsg:'something went wrong'})
    }
}

async function deletecar(req,res){
    try{
        const {id}=req.params
        const carData = await ReadFromFile(process.env.CARS_FILEPATH)
        const data = JSON.parse(carData)
        const find = data.find((item)=>item.pId==id)
        if(!find){
            responseHandler(res,{statusmsg:"BadRequest",sMsg:'car not found'})
        }
        else{
            const filter = data.filter((item)=>item.pId!=id)
            await WriteToFile(JSON.stringify(filter),process.env.CARS_FILEPATH)
            responseHandler(res,{statusmsg:"OK",sMsg:'car deleted successfully',sData:find})  
        }
    }
    catch(err){
        console.log(err)
        responseHandler(res,{statusmsg:"InternalServerError",sMsg:'something went wrong'})
}

}


module.exports={login,logout,addcar,updatecar,deletecar};