const { check, validationResult } = require('express-validator');

const checkEmail = [
    check('Email').isEmail().withMessage('Please enter a valid email address')
];

const checkcardetails =[
    check('sName').notEmpty().withMessage('carname not given'),
    check('sModel').notEmpty().withMessage('carbrand not given'),
    check('dYear').notEmpty().withMessage('carmodel not given'),
    check('sColor').notEmpty().withMessage('color not given'),
    check('sFuel').notEmpty().withMessage('fuel not given'),
    check('sType').notEmpty().withMessage('cartype not given')
]

const checkuuid = [
    check('id').isUUID().withMessage('Please enter a valid UUID')
]

const checkpassword = [
    check('password').notEmpty().withMessage('password not given')
]

function Result(req, res, next) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
}

const yash = console.log(gh4);


module.exports = {checkEmail,Result,checkpassword,checkcardetails,checkuuid};