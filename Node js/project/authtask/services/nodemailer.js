const nm = require('nodemailer');
const send = require('send');


function sendOtp(to,subject,otp){
    
const trans = nm.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
        user:process.env.GOOGLE_ACCOUNT,
        pass:process.env.GOOGLE_ACCOUNT_PASS
    }
})

const mailOptions = {
    from:process.env.GOOGLE_ACCOUNT,
    to:to,
    subject:subject,
    text:'for login',
    html:`<h1>your otp is ${otp}</h1>`
}

trans.sendMail(mailOptions, (err, info) => {
    if(err){
        console.log('here')
        console.log(err)
    }
    else{
        console.log(info)
    }
})
}

module.exports={sendOtp}