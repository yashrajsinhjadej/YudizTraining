const { generateOtp } = require('../utils/generateOtp');
const { sendOtp } = require('../services/nodemailer');
const { responseHandler } = require('../utils/responseHandler');
const jwt = require('jsonwebtoken'); // Fix incorrect import
const { ReadFromFile, WriteToFile } = require('../utils/fileoperation');
const { response } = require('express');
require('dotenv').config(); // Ensure .env file is loaded


async function SendOTP(req,res){
    try{
        const otpdata = await ReadFromFile(process.env.USER_OTP_FILEPATH)
        const login = JSON.parse(otpdata)
        const {Email}=req.body
        const OTP = generateOtp()
        sendOtp(Email,'Email-verification',OTP)
        const find = login.find((item) => item.Email === Email);
        if (find) {
            find.otp = OTP;
        } else {
            login.push({ Email, otp: OTP });
        }
        console.log('herle')
        WriteToFile(JSON.stringify(login),process.env.USER_OTP_FILEPATH)
        responseHandler(res, { statusmsg: "OK", sMsg: 'OTP sent successfully' });
    }
    catch(err){
        console.log(err)
    }
}

async function userlogin(req, res) {
    try{
        const otpdata = await ReadFromFile(process.env.USER_OTP_FILEPATH)
        let login = JSON.parse(otpdata)
    const { Email, OTP } = req.body;
        const find = login.find((item) => item.Email == Email);
        if (!find) {
            responseHandler(res, { statusmsg: "BadRequest", sMsg: 'user not found' });
        } else {
            if (find.otp != OTP) {
                responseHandler(res, { statusmsg: "BadRequest", sMsg: 'otp is not correct' });
            } else {
                const Role = "User"
                const token = jwt.sign({ Email,Role }, process.env.SECRET_KEY, { expiresIn: '15d' });
                login = login.filter((item) => item.Email !== Email);
                await WriteToFile(JSON.stringify(login),process.env.USER_OTP_FILEPATH)
                const userdata = await ReadFromFile(process.env.USER_FILEPATH);
                const data = JSON.parse(userdata);
                const find = data.find((item) => item.Email === Email);
                if(!find){
                    loggeddevice=[token]
                    const newUser ={Email,Role,loggeddevice}
                    data.push(newUser)
                }
                else{
                    if(find.loggeddevice.length>=5){
                        find.loggeddevice.shift()
                    }
                    find.loggeddevice.push(token)
                }
                await WriteToFile(JSON.stringify(data), process.env.USER_FILEPATH)
                responseHandler(res, { statusmsg: "OK", sMsg: 'login successfully', sData: { token } });
            }
        }
    }
    catch(err){
        console.log(err)
        responseHandler(res, { statusmsg: "InternalServerError", sMsg: 'something went wrong' });
    }
}


async function getCarDetails(req,res)
{   
    try{
        const carData = await ReadFromFile(process.env.CARS_FILEPATH);
        const data = JSON.parse(carData);
        responseHandler(res, { statusmsg: "OK", sMsg: 'car details', sData: data });
    }
    catch(err){
        console.log(err)
        responseHandler(res, { statusmsg: "InternalServerError", sMsg: 'something went wrong' });
    }
}


async function logoutuser(req,res){
    try{
        const token = req.headers['authorization']
        const userdata = await ReadFromFile(process.env.USER_FILEPATH)
        const data = JSON.parse(userdata)
        const decode = jwt.verify(token,process.env.SECRET_KEY)
        const find = data.find((item)=>item.Email==decode.Email)
        if(!find)
            {
                responseHandler(res,{statusmsg:"BadRequest",sMsg:'cannot find the emailid'})
            }
        else{
            const filter = find.loggeddevice.filter((item)=>item!=token)
            find.loggeddevice=filter            
            WriteToFile(JSON.stringify(data), process.env.USER_FILEPATH)
            responseHandler(res,{statusmsg:"OK",sMsg:'you are logged out'})

        }
    }
    catch(err){
        console.log(err)
        responseHandler(res,{statusmsg:"InternalServerError",sMsg:'something went wrong'})
    }

}


module.exports = { userlogin ,getCarDetails,logoutuser,SendOTP};