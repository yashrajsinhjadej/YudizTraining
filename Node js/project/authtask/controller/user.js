const { generateOtp } = require('../utils/generateOtp');
const { sendOtp } = require('../services/nodemailer');
const { responseHandler } = require('../utils/responseHandler');
const jwt = require('jsonwebtoken'); // Fix incorrect import
let login = []; // Temporary storage for OTP generation
const { ReadFromFile, WriteToFile } = require('../utils/fileoperation');
const { response } = require('express');
require('dotenv').config(); // Ensure .env file is loaded

async function userlogin(req, res) {
    try{
    const { Email, OTP } = req.body;
    if (!OTP) {
        const OTP = generateOtp()
        // const OTP=123456
        sendOtp(Email, 'Email-Verification', OTP)
        const find = login.find((item) => item.Email === Email);
        if (find) {
            find.otp = OTP;
        } else {
            login.push({ Email, otp: OTP });
        }
        setTimeout(()=>{                                     
            const find = login.find((item) => item.Email == Email);
            if(find){
                login = login.filter((item) => item.Email !== Email);
                console.log('OTP REMOVED')
                console.log(login)
            }
        },60000)
        responseHandler(res, { statusmsg: "OK", sMsg: 'OTP sent successfully' });
    } else {
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
                WriteToFile(JSON.stringify(data), process.env.USER_FILEPATH)
                
                responseHandler(res, { statusmsg: "OK", sMsg: 'login successfully', sData: { token } });
            }
        }
    }}
    catch(err){
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


module.exports = { userlogin ,getCarDetails,logoutuser};