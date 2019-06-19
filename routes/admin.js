var express = require("express");
var catogoryModel = require('../models/home.model');
var async = require("async");
var moment = require('moment');
var mysql = require('mysql');
var productModel = require('../models/product.model');
var router = express.Router();

router.get('/', (req, res, next) => {

    res.render("vwAdmin/dashboard",{ layout: false});
  })
module.exports = router;