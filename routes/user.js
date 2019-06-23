var express = require("express");
var catogoryModel = require('../models/category.model');
var async = require("async");
var moment = require('moment');
var mysql = require('mysql');
var productModel = require('../models/product.model');
var categoryModel = require('../models/category.model');
var userModel = require('../models/user.model');
var router = express.Router();
var crypto = require('crypto');
var multer = require('multer');
var bcrypt = require('bcrypt');
var passport = require('passport');
router.get('/', (req, res, next) => {

  userModel.allNT().then(rows => {


    notification = rows;
    userModel.allNT2().then(x => {
      notification2 = x;
      userModel.countByNoti().then(r => {
        count = r[0].tong;
        console.log(count);
        res.render("vwAdmin/dashboard", { notification, count, notification2, layout: 'main2.hbs' });
      })
    })


  })

})


var p = function (req, res, next) {
  if (req.params.id == 2) {
    productModel.proByALL0()
      .then(rows => {
        req.prod = rows;

        return next();

      })
      .catch(err => next(err));
  }
  else {
    productModel.proByUser0(req.params.id)
      .then(rows => {
        req.prod = rows;

        return next();

      })
      .catch(err => next(err));
  }

}
var p1 = function (req, res, next) {
  if (req.params.id == 2) {
    productModel.proByALL1()
      .then(rows => {
        req.prod1 = rows;

        return next();

      })
      .catch(err => next(err));
  }
  else {
    productModel.proByUser1(req.params.id)
      .then(rows1 => {
        req.prod1 = rows1;

        return next();

      })
      .catch(err => next(err));
  }

}
var p2 = function (req, res, next) {
  if (req.params.id == 2) {
    productModel.proByALL2()
      .then(rows => {
        req.prod2 = rows;

        return next();

      })
      .catch(err => next(err));
  } else {
    productModel.proByUser2(req.params.id)
      .then(rows2 => {
        req.prod2 = rows2;

        return next();

      })
      .catch(err => next(err));
  }

}
var p3 = function (req, res, next) {
  if (req.params.id == 2) {
    productModel.proByALL3()
      .then(rows => {
        req.prod3 = rows;

        return next();

      })
      .catch(err => next(err));
  } else {
    productModel.proByUser3(req.params.id)
      .then(rows3 => {
        req.prod3 = rows3;

        return next();

      })
      .catch(err => next(err));
  }
}
var p4 = function (req, res, next) {
  if (req.params.id == 2) {
    productModel.proByALL4()
      .then(rows => {
        req.prod4 = rows;

        return next();

      })
      .catch(err => next(err));
  } else {
    productModel.proByUser4(req.params.id)
      .then(rows4 => {
        req.prod4 = rows4;

        return next();

      })
      .catch(err => next(err));
  }
}
var p5 = function (req, res, next) {

  productModel.ED(req.params.id)
    .then(rows5 => {
      req.prod5 = rows5;

      return next();

    })
    .catch(err => next(err));

}
var gCD = function (req, res, next) {

  productModel.getCD(req.params.id)
    .then(rows5 => {
      console.log(rows5[0]);
      var k = rows5[0];
      if (k) {
        res.getCD = rows5[0].CatID;

        productModel.getProCat(res.getCD).then(rows6 => {
          req.PC = rows6;

          return next();
        });
      }
      else
        return next();




    })
    .catch(err => next(err));
}
router.get('/:id/categories', (req, res, next) => {
  id = req.params.id;
  if (res.locals.admin) {
    categoryModel.all()
      .then(rows => {

        var chuck = [];
        for (var i = 0; i < rows.length; i += 1) {
          chuck.push(rows.slice(i, i + 1));
          console.log(rows.slice(i, i + 1));

        }
        console.log(rows);
        res.render('vwAdmin/index', {
          categories: rows,
          layout: 'main2.hbs'
        });
      }).catch(next);
  }
})
router.get('/edit/user/:id', (req, res, next) => {
  id = req.params.id;
  if (isNaN(id)) {
    res.render('vwAdmin/dashboard');
    return;
  }
  if (res.locals.admin) {
    userModel.single(id).then(rows => {
      entity = rows[0];
      var dob = moment(entity.f_DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');
      entity.f_DOB = dob;
      res.render('vwAdmin/profile', {
        entity,
        layout: 'main2.hbs',
        adminedit: true,
      })
    }).catch(next);
  }
})
router.post('/edit/user/:id', (req, res, next) => {
  if (res.locals.admin) {
    entity = req.body;
    var dob = moment(entity.f_DOB, 'DD/MM/YYYY').format('YYYY-MM-DD');
    entity.f_DOB = dob;
    delete entity.f_Pic;
    if (entity.f_ID == res.locals.authUser.f_ID) {
      if (entity.f_Permission != res.locals.authUser.f_Permission) {
        userModel.update(entity).then(rows => {
          res.redirect('/');
        })
        return;
      }
    }
    userModel.update(entity).then(rows => {
      if (entity.f_Permission == 1 || entity.f_Permission == 2)
        res.redirect('/user/' + res.locals.authUser.f_ID + '/users');
      else
        res.redirect('/user/' + res.locals.authUser.f_ID + '/members');
    }).catch(next);
  }

});
router.post('/:id/profile', (req, res, next) => {
 
  var xx = req.body.f_DOB;
  var dob5 = moment(xx, 'DD/MM/YYYY').format('YYYY-MM-DD');
  var dob6 = moment(dob5,'YYYY-MM-DD' ).format('DD/MM/YYYY');
    var entity  = new Object();
    entity.f_ID=req.body.f_ID;
    entity.f_Name = req.body.f_Name;
    entity.f_Email= req.body.f_Email;
    entity.f_DOB = dob5;
    entity.f_Username= req.body.f_UserName;
    entity.f_Permission = req.body.f_Permission;
    entity.Pic = req.body.f_Pic;
      userModel.update(entity);
      
  
  res.redirect("/user/"+req.params.id+"/profile")
})
router.get('/tag/:id', (req,res,next) => {
  id = req.params.id;
  if(isNaN(id))
  {
    res.render('vwAdmin/edittag', {error: true});
  }
  if(res.locals.admin)
  {
    userModel.singleTag(id).then(rows =>{
      if(rows.length>0)
      {
        res.tag = rows[0];
        res.render('vwAdmin/edittag',{
          tag: res.tag,
          error: false
        })
      }
      else 
      {
        res.render('vwAdmin/edittag',{
          error: true
        })
      }
    }).catch(next);
  }
})
router.post('/tag/delete/:id', (req,res,next) =>{
  id = req.params.id;
  userModel.deleteTag(id).then(rows =>{
    userModel.singleTagitem(id).then(rows3 =>{
      if(rows3.length>0)
      {
        userModel.deleteTagitem(id).then(rows2=>{
          res.redirect('/user/'+res.locals.authUser.f_ID+'/tags');
        })
      }
      else {
        res.redirect('/user/'+res.locals.authUser.f_ID+'/tags');}
    })
    
  }).catch(next);
})
router.post('/tag/:id', (req,res,next)=>{
  var id = req.params.id;
  entity = req.body;
  userModel.updateTag(entity).then(rows =>{
    res.redirect('/user/'+ res.locals.authUser.f_ID +'/tags');
  })
})
router.post('/extend/:id', (req, res, next) => {
  id = req.params.id;
  if (res.locals.admin) {
    if (res.locals.authUser.f_ID == id) {
      res.redirect('/user/' + id + '/members');
    }
    else {
      userModel.singleSub(id).then(rows => {
        if (rows.length > 0) {
          entity = rows[0];
          oldDay = entity.CreatedAt;
          newDay = moment(oldDay, 'YYYY-MM-DD hh:mm:ss').add(7, 'days').format('YYYY-MM-DD hh:mm:ss');
          entity.CreatedAt = newDay;
          userModel.updateSub(entity).then(rows => {
            res.redirect('/user/' + res.locals.authUser.f_ID + '/users');
          }).catch(next);
        }
      })
    }
  }
  else res.redirect('/');
})
router.post('/backtoguest/:id', (req, res, next) => {
  id = req.params.id;
  if (res.locals.admin) {
    if (res.locals.authUser.f_ID == id) {
      res.redirect('/user/' + id + '/members');
    }
    else {
      userModel.singleSub(id).then(rows1 => {
        if (rows1.length > 0) {
          userModel.deleteSub(id).then(rows2 => {
            userModel.single(id).then(rows => {
              if (rows.length > 0) {
                entity = rows[0];
                per = entity.f_Permission;
                entity.f_Permission = 1;
                userModel.update(entity).then(rows2 => {
                  if (per == 5 || per == 4 || per == 3) {
                    res.redirect('/users/' + res.locals.authUser.f_ID + '/members');
                    return;
                  }
                  else {
                    res.redirect('/users/' + res.locals.authUser.f_ID + '/users');
                    return;
                  }
                })
              }
            })
          })
        }
        else {
          userModel.single(id).then(rows => {
            if (rows.length > 0) {
              entity = rows[0];
              per = entity.f_Permission;
              entity.f_Permission = 1;
              userModel.update(entity).then(rows2 => {
                if (per == 5 || per == 4 || per == 3) {
                  res.redirect('/users/' + res.locals.authUser.f_ID + '/members');
                  return;
                }
                else {
                  res.redirect('/users/' + res.locals.authUser.f_ID + '/users');
                  return;
                }
              })
            }
          })
        }
      })
    }
  }
  else res.redirect('/');
})
router.get('/:id/categories/add', (req, res, next) => {
  res.render('vwAdmin/add', { error: false, subcat: false, layout: 'main2.hbs' });
})
router.post('/:id/categories/add', (req, res, next) => {
  categoryModel.add(req.body).then(id => {
    res.redirect('/user/' + res.locals.authUser.f_ID + '/categories');
  }).catch(next);
})
router.get('/:id/members', (req, res, next) => {
  id = req.params.id;
  if (res.locals.admin) {
    userModel.allByP(5).then(rows => {
      res.admin = rows;
      userModel.allByP(4).then(rows2 => {
        res.editor = rows2;
        userModel.allByP(3).then(rows3 => {
          res.writter = rows3;
          res.render('vwAdmin/members', {
            layout: 'main2.hbs',
            admins: res.admin,
            editors: res.editor,
            writters: res.writter,
          });
        })
      })
    })
  }
})
router.get('/:id/users', (req, res, next) => {
  id = req.params.id;
  if (res.locals.admin) {
    id = req.params.id;
    if (res.locals.admin) {
      userModel.allSubsc().then(rows => {
        res.subscriber = rows;
        for (var i in res.subscriber) {
          var cd = moment(res.subscriber[i].CreatedAt, 'DD/MM/YYYY').format('DD-MM-YYYY , h:mm:ss');
          res.subscriber[i].CreatedAt = cd;

        }
        userModel.allByP(1).then(rows1 => {
          res.guest = rows1;
          res.render('vwAdmin/users', {
            layout: 'main2.hbs',
            subscriber: res.subscriber,
            guest: res.guest
          });
        })
      })
    }
  }
})
router.post('/delete/:id', (req, res, next) => {
  id = req.params.id;
  if (isNaN(id)) {
    res.redirect('/user/' + res.locals.authUser.f_ID + '/users');
  }
  if (id == res.locals.authUser.f_ID) {
    res.redirect('/user/' + res.locals.authUser.f_ID + '/users');
    return;
  }
  else {
    userModel.delete(id).then(rows => {
      res.redirect('/user/' + res.locals.authUser.f_ID + '/members');
    })
  }
})
router.get('/admin/register/:id', (req, res, next) => {
  id = req.params.id;
  if (res.locals.admin) {

    res.render('vwAdmin/register');
    return;
  }
})
router.post('/admin/register/:id', (req, res, next) => {
  var saltRounds = 10;
  var hash = bcrypt.hashSync(req.body.password, saltRounds);
  var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

  var entity = req.body;
  entity.f_Password = hash;
  entity.f_DOB = dob;
  entity.f_Permission = id;

  delete entity.password;
  delete entity.confirm;
  delete entity.dob;

  userModel.add(entity).then(id => {
    res.redirect('/user/');
  })
})
router.get('/:id/typography', (req, res, next) => {
  id = req.params.id;
  if (res.locals.admin) {
    res.render('vwAdmin/typography', {
      layout: 'main2.hbs'
    });
  }
})
router.get('/:id/tags', (req, res, next) => {
  id = req.params.id;
  if (res.locals.admin) {
    userModel.alltag().then(rows => {
      console.log(rows);
      if (rows.length > 0) {
        res.tags = rows;
        res.render('vwAdmin/tags', {
          layout: 'main2.hbs',
          tags: res.tags
        });
      }

    })
  }
})
router.get('/:id/table/', [p, p1, p2, p3, p4, gCD, p5], function (req, res, next) {
  id = req.params.id;

  userModel.single(id)
    .then(rows => {
      account = rows[0];
      var dob = moment(account.f_DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');


      var entity = account;
      entity.f_DOB = dob;
      console.log(entity.f_Permission);
      if (entity.f_Permission == 5) {
        prod = req.prod;
        prod1 = req.prod1;
        prod2 = req.prod2;
        prod3 = req.prod3;
        prod4 = req.prod4;
        res.render("vwAdmin/table", {
          prod, prod1, prod2, prod3, prod4, id,
          layout: 'main2.hbs'


        });
      }
      else
        if (entity.f_Permission == 3) {
          prod = req.prod;
          prod1 = req.prod1;
          prod2 = req.prod2;
          prod3 = req.prod3;
          prod4 = req.prod4;
          res.render("vwWriter/table", {
            prod, prod1, prod2, prod3, prod4, id,
            layout: 'main2.hbs'


          });
        }
        else
          if (entity.f_Permission == 4) {
            prod5 = req.PC;
            prod6 = req.prod5;
            console.log(id);
            res.render("vwEditor/table", {
              prod5, id, prod6,
              layout: 'main2.hbs'


            });
          }


    })


})
router.get('/:id/profile', (req, res, next) => {
  id = req.params.id;
  console.log(res.locals.lcUsers);
  userModel.single(id)
    .then(rows => {
      account = rows[0];
      var dob = moment(account.f_DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');

      var entity = account;

      entity.f_DOB = dob;
      productModel.isNT(entity.f_ID).then(kq => {
        console.log(kq);
        if (kq.length > 0)
          var mes = 1;


        if (entity.f_Permission == 5) {
          res.render("vwAdmin/profile", {
            entity,
            layout: 'main2.hbs'


          });
        }
        else {
          if (entity.f_Permission != 5) {
            if (mes == 1) {
              var button = 1;
              console.log(mes);
              res.render("vwWriter/profile", {
                entity, mes, button,
                layout: 'main2.hbs'


              });
            }
            else {
              if (entity.f_Permission == 1) {
                var button = 1;
                res.render("vwWriter/profile", {
                  entity, button,
                  layout: 'main2.hbs'


                });
              }
              else {
                if (entity.f_Permission == 2) {
                  userModel.isSub(entity.f_ID).then(rr => {
                    if (rr.length > 0)
                      var yes = 1;

                    sub = rr[0];
                    if (yes == 1) {
                      res.render("vwWriter/profile", {
                        entity, sub,
                        layout: 'main2.hbs'


                      });
                    }
                    else {
                      res.render("vwWriter/profile", {
                        entity,
                        layout: 'main2.hbs'


                      });
                    }


                  })

                } else {
                  res.render("vwWriter/profile", {
                    entity,
                    layout: 'main2.hbs'


                  });
                }
              }

            }

          }
        }

      })


    }).catch(next);
})
// Khởi tạo biến cấu hình cho việc lưu trữ file upload
let diskStorage = multer.diskStorage({
  destination: (req, file, callback) => {
    // Định nghĩa nơi file upload sẽ được lưu lại
    callback(null, './public/pic');
  },
  filename: (req, file, callback) => {
    // ở đây các bạn có thể làm bất kỳ điều gì với cái file nhé.
    // Mình ví dụ chỉ cho phép tải lên các loại ảnh png & jpg
    let math = ["image/png", "image/jpeg"];
    if (math.indexOf(file.mimetype) === -1) {
      let errorMess = `The file <strong>${file.originalname}</strong> is invalid. Only allowed to upload image jpeg or png.`;
      return callback(errorMess, null);
    }

    // Tên của file thì mình nối thêm một cái nhãn thời gian để đảm bảo không bị trùng.
    let filename = `${Date.now()}-LTW2-${file.originalname}`;
    callback(null, filename);
  }
});

// Khởi tạo middleware uploadFile với cấu hình như ở trên,
// Bên trong hàm .single() truyền vào name của thẻ input, ở đây là "file"
let uploadFile = multer({ storage: diskStorage }).single("file");

var isPic = function (req, res, next) {

  id = req.params.id;
  userModel.single(id)
    .then(rows => {
      res.KT = rows[0].pic;

      return next();

    })
    .catch(err => next(err));
}
// Route này Xử lý khi client thực hiện hành động upload file
router.post("/:id/profile/image", isPic, function (req, res) {
  id = req.params.id;
  if (req.KT != '') {

    uploadFile(req, res, (error) => {
      // Nếu có lỗi thì trả về lỗi cho client.
      // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
      if (error) {
        return res.send(`Error when trying to upload: ${error}`);
      }

      userModel.Updatepic(id, req.file.filename);

      // Không có lỗi thì lại render cái file ảnh về cho client.
      // Đồng thời file đã được lưu vào thư mục uploads



    });
    res.redirect('/user/' + id + '/profile');
  }
  else {
    uploadFile(req, res, (error) => {
      // Nếu có lỗi thì trả về lỗi cho client.
      // Ví dụ như upload một file không phải file ảnh theo như cấu hình của mình bên trên
      if (error) {
        return res.send(`Error when trying to upload: ${error}`);
      }
      userModel.Addpic(id, req.file.filename);

      // Không có lỗi thì lại render cái file ảnh về cho client.
      // Đồng thời file đã được lưu vào thư mục uploads



    });

    res.redirect('/user/' + id + '/profile');
  }

});
var gTag = function (req, res, next) {

  productModel.gettag(req.params.id)
    .then(rows4 => {
      req.gT = rows4;

      return next();

    })
    .catch(err => next(err));
}
router.get('/:idu/edit/:id', gTag, function (req, res, next) {
  id = req.params.id;
  productModel.single3(id)
    .then(rows => {
      product = rows[0];
      console.log(product);
      Tag = req.gT;
      res.tga = '';
      for (var i = 0; i < Tag.length; i++) {
        if (i == (Tag.length - 1))
          res.tga = res.tga + Tag[i].tagName;
        else
          res.tga = res.tga + Tag[i].tagName + ',';
      }
      console.log(res.tga);
      console.log(Tag);
      t = res.tga;
      res.render("vwWriter/edit", {
        product, Tag, t,
        layout: 'main2.hbs',


      });

    }).catch(next);
})

var b2 = function (req, res, next) {
  console.log(req.body.TinyDes);
  productModel.IDsingle()
    .then(rows => {
      req.iddd = rows[0].ProID;

      return next();

    })
    .catch(err => next(err));
}
router.post('/:idu/edit/:id', b2, function (req, res) {

  console.log(res.locals.authUser.f_Permission );
  if (res.locals.authUser.f_Permission == 3 || res.locals.authUser.f_Permission == 5 ) {
    var entity = new Object;
    entity.CatID = req.body.CatID;
    if (req.body.subCatID != null)
      entity.subCatID = req.body.subCatID;
    else
      entity.subCatID = 0;
    entity.pic = req.body.pic;
    console.log(entity.pic);
    var xx = entity.pic.split(" ")[2];


    var yy = xx.split("=")[1];
    var av = (yy.slice(1, yy.length - 1));
    entity.pic = av;



    entity.ProName = req.body.ProName;
    entity.TinyDes = req.body.TinyDes;
    entity.FullDes = req.body.FullDes;

    entity.Click = 0;
    entity.CreatedAt = moment().format('YYYY-MM-DD HH:mm:ss');
    console.log(req.body.author);
    entity.author = req.body.author;
    entity.TrangThai = 0;
    var tagg = req.body.tags;
    var tag = tagg.split(",");
    console.log("ok");
    console.log(entity);
    productModel.delP(req.params.id);
    console.log("ok");
    productModel.delI(req.params.id)
    console.log("ok");
    productModel.add(entity);
    console.log("ok");

    console.log(req.body.TinyDes);

    console.log(req.body.TinyDes);
    console.log(req.iddd);
    res.iddd = req.iddd + 1;
    console.log(res.iddd);
    res.i = 0;
    res.i2 = 0;

    var tagarray = [];
    productModel.alltag().then(rew => {
      for (res.i in rew) {
        tagarray.push(rew[res.i].tagName);
        res.i = res.i + 1;
      }
      console.log(tagarray.length);
      for (res.i2 in tag) {
        res.i3 = 0;
        console.log(res.i2);
        for (res.i3 in tagarray) {
          console.log(res.i3);
          if (tagarray[res.i3] === tag[res.i2]) {
            console.log("da co ");
            console.log(tag[res.i2]);
            productModel.IDsingle2(tag[res.i2]).then(
              r => {
                console.log(tag[res.i2]);
                console.log(res.iddd);
                res.idtag = r[0];
                var enti = new Object;
                enti.proID = res.iddd;
                enti.tagID = res.idtag.tagID;

                productModel.addITag(enti);

                console.log(enti.tagID);
                console.log("thanh cong 1");

              }

            )
            break;
          }
          else {

            if (res.i3 == (tagarray.length - 1)) {
              console.log("canthem vao");
              console.log(tag[res.i2]);
              productModel.addTag(tag[res.i2]);
              console.log(tag[res.i2]);
              productModel.IDsingle2(tag[res.i2]).then(
                r => {


                  console.log(res.iddd);
                  console.log(r[0]);
                  res.idtag = r[0];
                  var enti = new Object;
                  enti.proID = res.iddd;
                  enti.tagID = res.idtag.tagID;

                  productModel.addITag(enti);

                  console.log(enti.tagID);
                  console.log("thanh cong 2");

                }

              )
            }
            console.log(res.i3);
            res.i3 = res.i3 + 1;
          }

        }
        res.i2 = res.i2 + 1;
      }
    })
  }
  else
    if (res.locals.authUser.f_Permission == 4 ) {
      productModel.isNT(req.params.id)
        .then(rows => {

          if (rows.length > 0) {

            res.sms = "Từ chối:" + "  " + req.body.SMS;
            productModel.updateNT(req.params.id, res.sms);

          }
          else {

            res.sms = "Từ chối:" + "  " + req.body.SMS;
            productModel.addNT(req.params.id, res.sms, 0);
          }



        })
        .catch(err => next(err));


    }


  res.redirect(/user/);


})
var KT = function (req, res, next) {
  console.log(req.body.TinyDes);

}
router.post('/:idu/Deny/:id', b2, function (req, res) {
  productModel.isNT(req.params.id)
  .then(rows => {

    if (rows.length > 0) {

      res.sms = "Từ chối:" + "  " + req.body.SMS;
      productModel.updateNT(req.params.id, res.sms);

    }
    else {

      res.sms = "Từ chối:" + "  " + req.body.SMS;
      productModel.addNT(req.params.id, res.sms, 0);
    }



  })
  .catch(err => next(err));
  res.redirect('/user/' + req.params.idu+ '/profile');
})
router.post('/:idu/Accept/:id', b2, function (req, res) {

  var xx = req.body.dob;
  var dob5 = moment(xx, 'DD/MM/YYYY').format('YYYY-MM-DD');
  var datee = moment(dob5);
  console.log(Date(datee));
  var enti = new Object();
  enti.user_ID = req.params.idu;
  enti.ProID = req.params.id;
  enti.CreatedAt = dob5;

  productModel.add22(enti);


  console.log(req.body.ProName);
  console.log(req.body.TinyDes);
  console.log(req.body.FullDes);
  console.log(req.body.CatID);
  console.log(req.body.subCatID);
  console.log(req.body.pic);
  var tagg = req.body.tags;
  var tag = tagg.split(",");

  productModel.isNT(req.params.id)
    .then(rows => {

      if (rows.length > 0) {
        res.sms = "duyệt:" + req.body.SMS;
        productModel.Accept(req.params.id);
        productModel.updateNT(req.params.id, res.sms);
        productModel.updatePro(req.params.id, req.body.ProName, req.body.TinyDes, req.body.FullDes, req.body.CatID, req.body.subCatID);



      }
      else {
        res.sms = "duyệt:" + req.body.SMS;
        productModel.Accept(req.params.id);

        productModel.addNT(req.params.id, res.sms, 0);
        productModel.updatePro(req.params.id, req.body.ProName, req.body.TinyDes, req.body.FullDes, req.body.CatID, req.body.subCatID);

      }



    })
    .catch(err => next(err));

  var tagarray = [];
  productModel.alltag().then(rew => {
    for (res.i in rew) {
      tagarray.push(rew[res.i].tagName);
      res.i = res.i + 1;
    }
    console.log(tagarray.length);
    for (res.i2 in tag) {
      res.i3 = 0;
      console.log(res.i2);
      for (res.i3 in tagarray) {
        console.log(res.i3);
        if (tagarray[res.i3] === tag[res.i2]) {

          console.log("da co ");
          console.log(tag[res.i2]);
          res.newi = tag[res.i2];
          console.log(req.params.id)
          productModel.tagInfo(tag[res.i2]).then(tg => {
            console.log(tg[0].tagID);
            productModel.isitiemTag(req.params.id, tg[0].tagID).then(re => {
              res.proi = req.params.id;
              console.log(res.proi);
              if (re.length > 0) {

                console.log("có");
                productModel.updateitiemTag(req.params.id, tg[0].tagID);
              }
              else {
                console.log("không có");
                var enti = new Object;
                enti.proID = res.proi;
                enti.tagID = tg[0].tagID;

                productModel.addITag(enti);

                console.log(enti.tagID);
                console.log("thanh cong rôi");
              }
            })
          })

          break;

        }
        else {

          if (res.i3 == (tagarray.length - 1)) {
            console.log("canthem vao");
            console.log(tag[res.i2]);
            productModel.addTag(tag[res.i2]);
            console.log(tag[res.i2]);
            res.newi = tag[res.i2];
            console.log(req.params.id)
            productModel.tagInfo(tag[res.i2]).then(tg => {
              console.log(tg[0].tagID);
              productModel.isitiemTag(req.params.id, tg[0].tagID).then(re => {
                res.proi = req.params.id;
                console.log(res.proi);
                if (re.length > 0) {

                  console.log("có");
                  productModel.updateitiemTag(req.params.id, tg[0].tagID);
                }
                else {
                  console.log("không có");
                  var enti = new Object;
                  enti.proID = res.proi;
                  enti.tagID = tg[0].tagID;

                  productModel.addITag(enti);

                  console.log(enti.tagID);
                  console.log("thanh cong rôi");
                }
              })
            })


          }
          console.log(res.i3);
          res.i3 = res.i3 + 1;
        }

      }
      res.i2 = res.i2 + 1;
    }
  }).catch(err => next(err));

  res.redirect(/user/);
})
router.get('/:id/Update', (req, res, next) => {
  res.sms2 = res.locals.authUser.f_Name + " " + "Gửi yêu cầu làm subriber";
  productModel.isNT(req.params.id).then(ro => {

    if (ro.length > 0) {
      productModel.delNT(req.params.id).then(id => {
        res.redirect('/user/' + res.locals.authUser.f_ID + '/profile');
      }).catch(next);
    }
    else {
      productModel.addNT(0, res.sms2, req.params.id).then(id => {
        res.redirect('/user/' + res.locals.authUser.f_ID + '/profile');
      }).catch(next);
    }



  })

})
router.get('/:id/check', (req, res, next) => {
  id = req.params.id;
  userModel.upPermiss(id);
  productModel.delNT(id);
  userModel.addsub(id);

  res.redirect('/user');
})
router.get('/:idu/Created/:id', function (req, res) {
  id = req.params.id;
  productModel.XuatBan(req.params.id);
  productModel.isNT(id).then(kq => {
    if (kq.length > 0) {
      productModel.delNT(id);
    }
  })
  res.redirect('/user/' + req.params.idu + "/table");
})
router.get('/:idu/Delete/:id', function (req, res) {
  id = req.params.id;
  productModel.delete(req.params.id);
  productModel.isNT(id).then(kq => {
    if (kq.length > 0) {
      productModel.delNT(id);
    }
  })
  res.redirect('/user/' + req.params.idu + "/table");
})
router.get('/:idu/UpPer/:id', function (req, res) {
  id = req.params.id;
  productModel.Upper(id);
  res.redirect('/user/' + req.params.idu + "/table");
})
router.get('/:idu/DPer/:id', function (req, res) {
  id = req.params.id;
  productModel.XuatBan(id);
  res.redirect('/user/' + req.params.idu + "/table");
})
module.exports = router;