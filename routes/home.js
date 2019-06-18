var express = require ('express');
var router = express.Router();
var catogoryModel = require('../models/home.model');
var async = require("async");
var moment = require('moment');
var mysql = require('mysql');

var createConnection = () => mysql.createConnection({
    host:'localhost',
    
    user:'root',
    password:'',
    database:'qlbh',

});
var conn= createConnection();

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

var tag = function(req,res,next){
     catogoryModel.alltag()
     .then(rows => {
     
        req.Tag =rows;
        return next();
        
      })
      .catch(err => next(err));
 }
 
 function getCategoryTree(callback) {
     conn.query("SELECT DISTINCT c.* FROM categories c, products p WHERE c.CatID=p.CatID ORDER by p.CreatedAt DESC limit 10", function(error, results, fields) {
       async.map(results, getCategory, callback);
     });
   }
 
 function getCategory(resultItem, callback) {
     var supcat_id = resultItem.CatID;
     var cat_name = resultItem.CatName;
     conn.query(`SELECT * from  products p WHERE p.CatID = ${supcat_id} ORDER by p.CreatedAt DESC limit 1`, function(error, results, fields) {
          var subcategories = results.map(getSubCategory);
          callback(error, { cat_id: supcat_id, cat_name: cat_name, subcats: subcategories });
        });
   }
 
   
   function getSubCategory(resultItem) {
     return {
       sub_id: resultItem.ProID,
       sub_name: resultItem.ProName,
       sub_pic:resultItem.pic,
       sub_CreatedAt :resultItem.CreatedAt

     };
   }
   
 
router.get('/',[top3host,top10host,b,tag],function(req,res,next){
     
     var dob = moment(req.H1.CreatedAt, 'YYYY-MM-DD').format('DD/MM/YYYY');
     var dob2 = moment(req.H2.CreatedAt, 'YYYY-MM-DD').format('DD/MM/YYYY');
     var dob3 = moment(req.H3.CreatedAt, 'YYYY-MM-DD').format('DD/MM/YYYY');
     var dob4 = moment(req.Host2.CreatedAt, 'YYYY-MM-DD').format('DD/MM/YYYY');
     var dob5 = moment(req.New.CreatedAt, 'YYYY-MM-DD').format('DD/MM/YYYY');
     var entity1 = req.H1;
     var entity2 = req.H2;
     var entity3 = req.H3;
     var entity4 = req.Host2;
     var entity5 = req.New;
     var TAG = req.Tag;
   
     entity1.CreatedAt = dob;
     entity2.CreatedAt = dob2;
     entity3.CreatedAt = dob3;
     entity4.CreatedAt = dob4;
     entity5.CreatedAt = dob5;

     getCategoryTree(function(err, result) {
          console.log(JSON.stringify(result, null, "  "));
          return  res.render('home',{
               Host: req.Host,
               H1:entity1,
               H2:entity2,
               H3:entity3,
               Host2: entity4,
               Tg : TAG,
               tcm : result,
               New : entity5,
            });
        });

         
              

         
              
      
        
        
  
         
        
          
      
      
   
  
    
})



module.exports = router;
