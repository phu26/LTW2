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
router.get('/',[top3host,top10host,b],function(req,res,next){
     
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
     entity1.CreatedAt = dob;
     entity2.CreatedAt = dob2;
     entity3.CreatedAt = dob3;
     entity4.CreatedAt = dob4;
     entity5.CreatedAt = dob5;
     function getCategoryTree(callback) {
          conn.query("SELECT * FROM `categories`", function(error, results, fields) {
            async.map(results, getCategory, callback);
          });
        }
     function getCategory(resultItem, callback) {
          var supcat_id = resultItem.CatID;
          var cat_name = resultItem.CatName;
          conn.query("SELECT * FROM `subcategories` WHERE `CatID` = " + supcat_id, function(error, results, fields) {
               var subcategories = results.map(getSubCategory);
               callback(error, { cat_id: supcat_id, cat_name: cat_name, subcats: subcategories });
             });
        }
   
        
        function getSubCategory(resultItem) {
          return {
            subcat_id: resultItem.subID,
            subcat_name: resultItem.subName
          };
        }
        
        getCategoryTree(function(err, result) {
          console.log(JSON.stringify(result, null, "  "));
        });
    
      return  res.render('home',{
           Host: req.Host,
           H1:entity1,
           H2:entity2,
           H2:entity3,
           Host2: entity4,
           
           New : entity5,
        });
      
   
  
    
})



module.exports = router;
