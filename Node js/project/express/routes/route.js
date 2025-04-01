const express = require('express');
const router = express.Router();
const {showItemList} = require('../controllers/showItemList.js');
const {addItemList}=require('../controllers/addItemList.js')
const {showItemById} = require('../controllers/showItemById.js')
const {updateItemById} = require('../controllers/updateItemById.js');
const { deleteItemById } = require('../controllers/deleteItemById.js');
const {check,validationResult,matchedData}= require('express-validator');


//matched data returns the obj in which all the validations are true and all other are removed automaticcaly

router.get('/',(req,res)=> {
  showItemList(req, res);
});

router.post('/',[
  check('sName').isString().notEmpty().withMessage('sName should be a string and not empty'),
  check('nQuantity').isInt({ gt: 0 }).withMessage('nQuantity should be a number'),
  check('nPrice').isFloat({ gt: 0 }).withMessage('nPrice should be a number')
],(req,res)=>{
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  } 
  console.log('hello')
  addItemList(req,res)  
})

router.get('/:pId',(req,res)=>{
  showItemById(req,res)
})

router.put('/:pId',[
  check('sName').isString().notEmpty().withMessage('sName should be a string and not empty'),
  check('nQuantity').isInt({ gt: 0 }).withMessage('nQuantity should be a number'),
  check('nPrice').isFloat({ gt: 0 }).withMessage('nPrice should be a number')
],(req,res)=>{
  updateItemById(req,res)
})

router.delete('/:pId',(req,res)=>{
  deleteItemById(req,res)
})



 


module.exports = router;
