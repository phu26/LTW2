var express = require('express');
var productModel = require('../models/product.model');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

io.on('connection', function (socket) {
  console.log('a user connected');
});

var router = express.Router();

router.get('/add', (req, res, next) => {
  res.render('vwProducts/add');
})

router.post('/add', (req, res, next) => {
  console.log(req.body);
  res.end('done');
})
var cmt = function (req, res, next) {

  productModel.ShowCmt(req.params.id)
    .then(rows => {
      req.show = rows;
      console.log(req.show);
      return next();

    })
    .catch(err => next(err));
}
var relatee = function (req, res, next) {

  productModel.related(req.params.id)
    .then(rows => {
      res.locals.relate = rows;
      console.log(req.show);
      return next();

    })
    .catch(err => next(err));
}

router.get('/:id', [cmt, relatee], function (req, res, next) {
  var id = req.params.id;
  console.log(id);
  if (id == '') {
    res.render('vwProducts/detail', { error: true });
    return;
  }
  productModel.Click(id);
  var showcmt = req.show;
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
        var productRelate= [];
        productRelate.length = 5;
        var i=0;
        for (var d of res.locals.relate) {
          if (d.CatID === product.CatID) {
          
           if(i==5)
           break;

           productRelate.push(d) ;
           i++;
          }
        }

        console.log(productRelate);
        res.render('vwProducts/detail', {
          error: false, product, k, showcmt, productRelate

        });
      } else {
        res.render('vwProducts/detail', {
          error: true
        });
      }
    }).catch(next);


})
var b = function (req, res, next) {
  console.log(req.body.username);
  productModel.single3(req.body.username)
    .then(rows => {
      req.cmt = rows[0];
      console.log(req.cmt);
      return next();

    })
    .catch(err => next(err));
}

var cmt2 = function (req, res, next) {

  productModel.ShowCmt(req.params.id)
    .then(rows => {
      req.show2 = rows;
      console.log(req.show2);
      return next();

    })
    .catch(err => next(err));
}


router.post('/:id', [b, cmt2], function (req, res, next) {
  var id = req.params.id;
  console.log(id);

  productModel.AddCmt(req.body.comment, req.cmt.f_ID, id);

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
        var showcmt = req.show2;

        res.render('vwProducts/detail', {
          error: false, k, product, showcmt

        });
      } else {
        res.render('vwProducts/detail', {
          error: true
        });
      }
    }).catch(next);

})

module.exports = router;
