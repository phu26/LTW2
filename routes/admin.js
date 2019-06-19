var express = require("express");
var catogoryModel = require('../models/home.model');
var async = require("async");
var moment = require('moment');
var mysql = require('mysql');
var productModel = require('../models/product.model');
var router = express.Router();

router.get('/', (req, res, next) => {

    res.render("vwAdmin/dashboard", { layout: 'main2.hbs' });
})
router.get('/table', (req, res, next) => {

    res.render("vwAdmin/table", { layout: 'main2.hbs' });
})
router.get('/table/profile', (req, res, next) => {

    res.render("vwAdmin/profile", { layout: 'main2.hbs' });
})
router.get('/table', (req, res, next) => {

    res.render("vwAdmin/table", { layout: 'main2.hbs' });
})
router.get('/table', (req, res, next) => {

    res.render("vwAdmin/table", { layout: 'main2.hbs' });
})
module.exports = router;