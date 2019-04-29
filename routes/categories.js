var express = require ('express');
var catogoryModel = require('../models/category.model');
var router = express.Router();


router.get('/',(req,res)=>{
    catogoryModel.all()
    .then(rows => {
       res.render('categories/index',{
           categories: rows
        });
      
    })
    .catch(error => {
        res.render('error',{ layout: false})
    }) ;
    
})

router.get('/add',(req,res)=>{res.render('categories/add');})
router.post('/add',(req,res)=>{
  
    catogoryModel.add(req.body).then(id => {
        console.log(id);
        res.render('categories/add');
    });
    })
module.exports = router;