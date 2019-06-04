var express = require ('express');
var router = express.Router();
var catogoryModel = require('../models/home.model');


var top3host = function(req,res,next){
    catogoryModel.all()
    .then(rows => {
       req.Host =rows;
       return next();
       
     })
     .catch(err => next(err));
}
var top10host = function(req,res,next){
     catogoryModel.all2()
     .then(rows => {
        req.Host2 =rows;
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
router.get('/',[top3host,top10host,b],function(req,res,next){
   
      return  res.render('home',{
           Host: req.Host,
           Host2: req.Host2,
           New : req.New
        });
      
   
  
    
})



module.exports = router;
