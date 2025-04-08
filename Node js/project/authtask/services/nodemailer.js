const nm = require('nodemailer');
const send = require('send');


function sendOtp(to,subject,otp){
    
const trans = nm.createTransport({
    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
        user:'jadejayashrajsinh725@gmail.com',
        pass:'nlsc kmig xbbg ywvf'
    }
})

const mailOptions = {
    from:'jadejayashrajsinh725@gmail.com',
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