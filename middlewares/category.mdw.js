var LRU = require('lru-cache');
var categoryModel = require('../models/category.model');
var mysql = require('mysql');
var async = require("async");
var createConnection = () => mysql.createConnection({
    host:'localhost',
    
    user:'root',
    password:'',
    database:'qlbh',

});
var conn= createConnection();
var cache_options = {
  max: 500,
  maxAge: 1000 * 60 // ms
}

var cache = new LRU(cache_options);


  function getCategoryTree(callback) {
    conn.query("SELECT c.*,e.userName,e.user_ID FROM categories c left join editor e on c.CatID = e.CatID", function(error, results, fields) {
   
      async.map(results, getCategory, callback);
    });
  }
 /* select c.*, count(p.ProID) as num_of_products
  from subcategories c left join products p on c.subID = p.CatID 
  and p.TinyDes!='' and c.CatID = 1
  group by c.subID, c.subName*/
function getCategory(resultItem, callback) {
  if(resultItem.userName)
  { 
    var userid = resultItem.user_ID;
    var userN = resultItem.userName;
    var supcat_id = resultItem.CatID;
    var cat_name = resultItem.CatName;
    conn.query("SELECT * FROM `subcategories` WHERE `CatID` = " + supcat_id, function(error, results, fields) {
         var subcategories = results.map(getSubCategory);
         callback(error, { cat_id: supcat_id, cat_name: cat_name,userName: userN,userID: userid, subcats: subcategories });
       });}
   
  else
  { var userN = resultItem.userName;
    var supcat_id = resultItem.CatID;
    var cat_name = resultItem.CatName;
    conn.query("SELECT * FROM `subcategories` WHERE `CatID` = " + supcat_id, function(error, results, fields) {
         var subcategories = results.map(getSubCategory);
         callback(error, { cat_id: supcat_id, cat_name: cat_name, subcats: subcategories });
       });}
 
   
   
  }

  
  function getSubCategory(resultItem) {
    return {
      subcat_id: resultItem.subID,
      subcat_name: resultItem.subName
    };
  }
  
  //

  module.exports = (req, res, next) => getCategoryTree(function(err,result ){

    var data = cache.get('globalCategories');
  if (!data) {
    console.log('-- fetch `globalCategories`');
   
      cache.set('globalCategories', result);
    
      res.locals.lcCategories = result;
      next();
    
  } else {
    console.log('-- cache hit for `globalCategories`');
    for (const c of data) {
      delete c.active;
    }
    res.locals.lcCategories = data;
    next();
  }
  console.log(res.locals.lcCategories);
  //

  
  });

  
  
  // categoryModel.allWithDetails().then(rows => {
  //   res.locals.lcCategories = rows;
  //   next();
  // });
