var express = require ('express');
var router = express.Router();
var catogoryModel = require('../models/home.model');


var top3host = function(req,res,next){
    catogoryModel.all()
    .then(rows => {
         req.Host= rows;
       req.H1 =rows[0];
       req.H2 =rows[1];
       req.H3 =rows[2];

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
     console.log(req.H2);
      return  res.render('home',{
           Host: req.Host,
           H1:req.H1,
           H2:req.H2,
           H2:req.H3,
           Host2: req.Host2,
           
           New : req.New
        });
      
   
  
    
})



module.exports = router;
