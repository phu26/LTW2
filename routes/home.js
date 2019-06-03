var express = require ('express');
var router = express.Router();
var catogoryModel = require('../models/home.model');


var a = function(req,res,next){
    catogoryModel.all()
    .then(rows => {
       req.Host =rows;
       return next();
       
     })
     .catch(err => next(err));
}

var b = function(req,res,next){
    catogoryModel.New()
    .then(rows => {
       req.New =rows;
       return next();
       
     })
     .catch(err => next(err));
}
router.get('/',[a,b],function(req,res,next){
   
      return  res.render('home',{
           Host: req.Host,
           New : req.New
        });
      
   
  
    
})



module.exports = router;
