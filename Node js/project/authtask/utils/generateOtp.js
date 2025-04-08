require('dotenv').config();

function generateOtp() {
    const otp = Math.random() * (10 ** process.env.OTP_LENGTH);
    return Math.floor(otp);
}

module.exports = { generateOtp };

//crypto model for otp generation