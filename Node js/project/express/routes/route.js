var express = require('express');
var router = express.Router();
var {showItemList} = require('../controllers/showItemList.js');
var {addItemList}=require('../controllers/addItemList.js')
var {showItemById} = require('../controllers/showItemById.js')
var {updateItemById} = require('../controllers/updateItemById.js');
var { deleteItemById } = require('../controllers/deleteItemById.js');



router.get('/',(req,res)=> {
  // console.log('hello')
  showItemList(req, res);
});

router.post('/',(req,res)=>{
  addItemList(req,res)  
})

router.get('/:id',(req,res)=>{
  showItemById(req,res)
})

router.put('/:id',(req,res)=>{
  updateItemById(req,res)
})

router.delete('/:id',(req,res)=>{
  deleteItemById(req,res)
})


module.exports = router;
