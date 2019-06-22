var LRU = require('lru-cache');
var categoryModel = require('../models/user.model');
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


  function getUsersTree(callback) {
    conn.query("SELECT * FROM permission", function(error, results, fields) {
      //console.log(results);
      async.map(results, getPermission, callback);
    });   
  }

function getPermission(resultItem, callback) {
  //console.log("resultItem");
  //console.log(resultItem);
    var permission_id = resultItem.id;
    var permission = resultItem.permission;
    conn.query("SELECT * FROM `users` WHERE `f_Permission` = " + permission_id, function(error, results, fields) {
         var users = results.map(getUsers);
         callback(error, { per_id: permission_id, per_name: permission, users: users });
       });}

  
  function getUsers(resultItem) {
    return {
      user_id: resultItem.f_ID,
      user_name: resultItem.f_Name,
      user_username: resultItem.f_Username,
      user_email: resultItem.f_Email
    };
  }
  
  //

  module.exports = (req, res, next) => getUsersTree(function(err,result ){

    var data2 = cache.get('AllUsers');
  if (!data2) {
    console.log('-- fetch `AllUsers`');
  
      cache.set('AllUsers', result);
    
      res.locals.lcUsers = result;
      next();
    
  } else {
    console.log('-- cache hit for `AllUsers`');
    for (const c of data2) {
      delete c.active;
    }
    res.locals.lcUsers = data2;
    next();
  }
  //console.log(res.locals.lcUsers);
  //

  
  });

  
  
  // categoryModel.allWithDetails().then(rows => {
  //   res.locals.lcCategories = rows;
  //   next();
  // });
