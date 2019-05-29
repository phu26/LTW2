var express = require('express');
var productModel = require('../models/product.model');

var router = express.Router();

router.get('/:id', (req, res, next) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.render('vwProducts/detail', { error: true });
    return;
  }

  productModel.single(id)
    .then(rows => {
      if (rows.length > 0) {

        var product = rows[0];

        for (var c of res.locals.lcCategories) {
          if (c.CatID === product.CatID) {
            c.active = true;
          }
        }

        res.render('vwProducts/detail', {
          error: false, product
        });
      } else {
        res.render('vwProducts/detail', {
          error: true
        });
      }
    }).catch(next);
})

module.exports = router;
