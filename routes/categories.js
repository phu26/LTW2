var express = require('express');
var categoryModel = require('../models/category.model');
var productModel = require('../models/product.model');
var config = require('../config/default.json');
var userModel = require('../models/user.model');
var router = express.Router();
//get
router.get('/', (req, res, next) => {
  categoryModel.all()
    .then(rows => {
      res.render('vwCategories/index', {
        categories: rows,
        layout: 'main2.hbs'
      });
    }).catch(next);
})




router.get('/add/:id', (req, res, next) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.render('vwCategories/add2', { error: true });
    return;
  }
  categoryModel.single(id)
    .then(rows => {
      if (rows.length > 0) {
        res.cat = rows[0];
        res.render('vwCategories/add2', {
          error: false,
          CatID: id,
        })
      } else {
        res.render('vwCategories/add2', {
          error: true
        });
      }
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
      for(var c in res.locals.lcCategories)
        {
          if(res.locals.lcCategories[c].cat_id == id )
          {  
            res.userID = res.locals.lcCategories[c].userID;
            res.userName = res.locals.lcCategories[c].userName;
          }
        }
        console.log(res.userName);
      if (rows.length > 0) {
        res.cat = rows[0];
        categoryModel.subCatbyCat(res.cat.CatID).then(rows2 => {
          if (rows2.length == 0) {
            res.render('vwCategories/edit', {
              error: false,
              category: res.cat,
              userID: res.userID,
              userName: res.userName,
              subcat: false,
            }).catch(next);
            return;
          }
          res.sub = rows2;
          //console.log(res.sub);
          if (rows2.length > 0) {
            res.render('vwCategories/edit', {
              error: false,
              userID: res.userID,
              userName: res.userName,
              category: res.cat,
              subcat: res.sub,
            })
          }
        }

        )
      } else {
        res.render('vwCategories/edit', {
          error: true
        });
      }
    }).catch(next);
})
router.get('/edit/:id1/:id2', (req, res, next) => {
  var catid = req.params.id1;
  var subid = req.params.id2;
  if (isNaN(catid) || isNaN(subid)) {
    res.render('vwCategories/edit2', { error: true }).catch(next);
    return;
  }

  categoryModel.single(catid)
    .then(rows => {
      if (rows.length > 0) {
        res.cat = rows[0];
        categoryModel.subCatbyCat(res.cat.CatID).then(rows2 => {
          if (rows2.length > 0) {

            res.i = 0;
            while (res.i < rows2.length) {
              console.log(rows2[res.i].subID);
              if (rows2[res.i].subID == subid) {
                categoryModel.subcat(rows2[res.i].subID).then(rows3 => {
                  if (rows3.length > 0) {
                    res.subcat = rows3[0];
                    res.render('vwCategories/edit2', {
                      error: false,
                      SubCat: res.subcat,
                      Cat: res.cat,
                    });
                    return;
                  }
                })
              }
              res.i = res.i + 1;
            }

          }

        }
        )
      }
      else {
        res.render('vwCategories/edit2', {
          error: true
        });
      }
    })
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
router.get('/:id1/delete/:id2', (req, res, next) => {
  var catid = req.params.id1;
})
//post
router.post('/:id/delete', (req, res, next) => {
  var catid = req.params.id;
  if (isNaN(catid)) {
    res.redirect('/categories');
  }

  categoryModel.single(catid).then(rows => {
    if (rows.length > 0) {
      productModel.allByCat(catid).then(rows1 =>{
        if(rows.length >0)
        {
          window.alert("Không thể xóa danh mục do còn tồn tại bài viết");
          res.redirect('/user/'+res.locals.authUser.f_ID +'/categories');
          return;
        }
        else{
          categoryModel.delete(catid).then(rows => {
            res.redirect('/user/'+res.locals.authUser.f_ID +'/categories');
          })
        }
      })
      
    }
    else { res.redirect('/categories' + catid); }
  })

}
)

router.post('/:id1/delete/:id2', (req, res, next) => {

  var catid = req.params.id1;
  var subid = req.params.id2;
  console.log(catid);
  if (isNaN(catid) || isNaN(subid)) {
    res.redirect('/user/'+res.locals.authUser.f_ID +'/categories');
  }

  categoryModel.single(catid).then(rows => {
    if (rows.length > 0) {
      categoryModel.subsingle(subid).then(rows2 => {
        if(rows2.length>0)
        {
          productModel.allbySub(subid).then(rows3 =>{
            if(rows3.length==0)
            {
              categoryModel.subdelete(subid).then(rows3 => {
                res.redirect('/categories/edit/' + catid);
              })
              return;
            }
          })
        } 
      })
    }
    else { res.redirect('/categories/edit' + catid); }
  }).catch(next);
})
// lỗi
router.post('/edit/update', (req, res, next) => {
  entity = req.body;
  var entity2 = new Object;
  entity2.user_ID = entity.editor_id;
  entity2.CatID = entity.CatID;
  userModel.single(entity2.user_ID).then(rows2 =>{
    if(rows2.length>0)
    {
      user = rows2[0];
      entity2.userName = user.f_Name;
    }
  })
  entity2.userName = entity.editor_name;
  delete entity.editor_id;
  delete entity.editor_name;
  delete entity.Temp;

  if(res.locals.admin)
  {
    categoryModel.update(entity).then(n => {
      categoryModel.singleEditor(entity2.CatID).then(rows =>{
        if(rows.length>0)
        {
          edit = rows[0];
          entity2.id=edit.id;
          categoryModel.updateEditor(entity2).then(rows1=>{
            res.redirect('/user/'+res.locals.authUser.f_ID +'/categories');
          }).catch(next);
        }
        else{
          categoryModel.insertEditor(entity2).then(rows1=>{
            res.redirect('/user/'+res.locals.authUser.f_ID +'/categories');
          }).catch(next);
        }
      }).catch(next);
    }).catch(next);
  }
  else{ res.redirect('/');}
})

router.post('/delete', (req, res, next) => {
  categoryModel.delete(+req.body.CatID).then(n => {
    res.redirect('/user/'+res.locals.authUser.f_ID +'/categories');
  }).catch(next);
})

router.post('/add/:id', (req, res, next) => {
  var id = req.params.id;
  if (isNaN(id)) {
    res.redirect('/user/'+res.locals.authUser.f_ID +'/categories');
  }
  var entity = req.body;
  categoryModel.addsub(entity).then(rows => {
    res.redirect('/categories/edit/' + id);
  }).catch(next);
})



router.get('/view/:subcate', (req, res, next) => {
  
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
