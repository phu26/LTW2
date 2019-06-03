var express = require('express');
var productModel = require('../models/product.model');


var router = express.Router();

router.get('/add', (req, res, next) => {
  res.render('vwProducts/add');
})

router.post('/add', (req, res, next) => {
  console.log(req.body);
  res.end('done');
})

router.get('/:id', (req, res,next) => {
  var id = req.params.id;
  console.log(id);
  if (id == '') {
    res.render('vwProducts/detail', { error: true });
    return;
  }
  productModel.Click(id);

  productModel.single(id)
    .then(rows => {
      if (rows.length > 0) {

        var product = rows[0];
        var k = rows;
       
        for (var c of res.locals.lcCategories) {
          if (c.CatID === product.CatID) {
            c.active = true;
          }
        }
       
        
      res.render('vwProducts/detail', {
          error: false, product,k

        });
      } else {
     res.render('vwProducts/detail', {
          error: true
        });
      }
    }).catch(next);
    
 
})
router.post('/:id', (req, res,next) => {
  var id = req.params.id;
  console.log(id);
  if (id == '') {
    res.render('vwProducts/detail', { error: true });
    return;
  }
  
  
  productModel.single(id)
    .then(rows => {
      if (rows.length > 0) {

        var product = rows[0];
        var k = rows;
       
        for (var c of res.locals.lcCategories) {
          if (c.CatID === product.CatID) {
            c.active = true;
          }
        }
       
        
      res.render('vwProducts/detail', {
          error: false, product,k

        });
      } else {
     res.render('vwProducts/detail', {
          error: true
        });
      }
    }).catch(next);
    
 
})

module.exports = router;
