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
var b = function(req,res,next){
  console.log(req.body.username);
  productModel.single3(req.body.username)
  .then(rows => {
     req.id =rows[0].f_ID;
     console.log(req.id);
     return next();
   
   })
   .catch(err => next(err));
}
router.post('/:id', b,function(req, res,next) {
  var id = req.params.id;
  console.log(id);
 
  
  
  
  console.log(req.id);
  productModel.AddCmt(req.body.comment,req.body.username.id,id);
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
