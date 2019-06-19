var express = require("express");
var catogoryModel = require('../models/category.model');
var async = require("async");
var moment = require('moment');
var mysql = require('mysql');
var productModel = require('../models/product.model');
var userModel= require('../models/user.model');
var router = express.Router();

router.get('/', (req, res, next) => {

    res.render("vwAdmin/dashboard", { layout: 'main2.hbs' });
})
router.get('/:id/table/', (req, res, next) => {
    id = req.params.id;
   
    userModel.single(id)
   
    .then(rows => {
      account = rows[0];
      var dob = moment(account.f_DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');

      var entity = account;

      entity.f_DOB = dob;
if(entity.f_Permission == 5)
{ res.render("vwAdmin/table", { 
    layout :'main2.hbs'
   
    
 });}
   
    }).catch(next);
})
router.get('/profile', (req, res, next) => {

    res.render("vwAdmin/table", { layout: 'main2.hbs' });
})


module.exports = router;