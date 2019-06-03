var express = require ('express');
var router = express.Router();
var catogoryModel = require('../models/home.model');

router.get('/',(req,res)=>{
    catogoryModel.New()
    .then(rows => {
       res.render('home',{
           New: rows
        });
      
    })
    .catch(error => {
        res.render('error',{ layout: false})
    }) ;
    
})
module.exports = router;