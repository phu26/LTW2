var express = require('express');
var categoryModel = require('../models/category.model');
var productModel = require('../models/product.model');
var config = require('../config/default.json');

var router = express.Router();

router.get('/', (req, res, next) => {
  categoryModel.all()
    .then(rows => {
      res.render('vwCategories/index', {
        categories: rows
      });
    }).catch(next);
})

router.get('/add', (req, res, next) => {
  res.render('vwCategories/add');
})

router.post('/add', (req, res, next) => {
  categoryModel.add(req.body).then(id => {
    res.render('vwCategories/add');
  }).catch(next);
})

router.get('/edit/:id', (req, res, next) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.render('vwCategories/edit', { error: true });
    return;
  }

  categoryModel.single(id)
    .then(rows => {
      if (rows.length > 0) {
        res.cat=rows[0];
        categoryModel.subCatbyCat(res.cat.CatID).then(rows2 =>
          {
            res.sub = rows2;
            console.log(res.sub);
            if(rows2.length>0)
            {
              res.render('vwCategories/edit', {
                error: false,
                category: res.cat,
                subcat: res.sub,
              }).catch(next);
            }
          }
        )
      } else {
        res.render('vwCategories/edit', {
          error: true
        });
      }
    })
})

router.post('/update', (req, res, next) => {
  categoryModel.update(entity).then(n => {
    res.redirect('/categories');
  }).catch(next);
})

router.post('/delete', (req, res, next) => {
  categoryModel.delete(+req.body.CatID).then(n => {
    res.redirect('/categories');
  }).catch(next);
})

router.get('/:id/products', (req, res, next) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.render('vwProducts/byCat', { error: true });
    return;
  }

  var limit = config.paginate.default;
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var start_offset = (page - 1) * limit;

  Promise.all([
    productModel.countByCat(id),
    productModel.pageByCat(id, start_offset)
  ]).then(([nRows, rows]) => {

    for (var c of res.locals.lcCategories) {
      if (c.CatID === +id) {
        c.active = true;
      }
    }

    var total = nRows[0].total;
    var nPages = Math.floor(total / limit);
    if (total % limit > 0)
      nPages++;

    var page_numbers = [];
    for (i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        active: i === +page
      })
    }


    res.render('vwProducts/byCat', {
      error: false,
      empty: rows.length === 0,
      products: rows,
      page_numbers
    });

  }).catch(next);
})

router.get('/:subcate', (req, res, next) => {
  
  var id = req.params.subcate;
  console.log(id);
  

  var limit = config.paginate.default;
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var start_offset = (page - 1) * limit;

  Promise.all([
    productModel.countBySubCat(id),
    productModel.pageBySubCat(id, start_offset)
  ]).then(([nRows, rows]) => {

    for (var c of res.locals.lcCategories) {
      if (c.CatID === +id) {
        c.active = true;
      }
    }

    var total = nRows[0].total;
    var nPages = Math.floor(total / limit);
    if (total % limit > 0)
      nPages++;

    var page_numbers = [];
    for (i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        active: i === +page
      })
    }


    res.render('vwProducts/byCat', {
      error: false,
      empty: rows.length === 0,
      products: rows,
      page_numbers
    });

  }).catch(next);
})

router.get('/tag/:tg', (req, res, next) => {
  
  var id = req.params.tg;
  console.log(id);
  

  var limit = config.paginate.default;
  var page = req.query.page || 1;
  if (page < 1) page = 1;
  var start_offset = (page - 1) * limit;

  Promise.all([
    productModel.countByTag(id),
    productModel.pageByTag(id, start_offset)
  ]).then(([nRows, rows]) => {

    for (var c of res.locals.lcCategories) {
      if (c.CatID === +id) {
        c.active = true;
      }
    }

    var total = nRows[0].total;
    var nPages = Math.floor(total / limit);
    if (total % limit > 0)
      nPages++;

    var page_numbers = [];
    for (i = 1; i <= nPages; i++) {
      page_numbers.push({
        value: i,
        active: i === +page
      })
    }


    res.render('vwProducts/byCat', {
      error: false,
      empty: rows.length === 0,
      products: rows,
      page_numbers
    });

  }).catch(next);
})

// router.get('/:id/products', (req, res, next) => {
//   var id = req.params.id;
//   if (isNaN(id)) {
//     res.render('vwProducts/byCat', { error: true });
//     return;
//   }

//   productModel.allByCat(id).then(rows => {

//     for (var c of res.locals.lcCategories) {
//       if (c.CatID === +id) {
//         c.active = true;
//       }
//     }

//     res.render('vwProducts/byCat', {
//       error: false,
//       empty: rows.length === 0,
//       products: rows
//     });
//   }).catch(next);
// })

module.exports = router;
