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

router.get('/', (req, res, next) => {

    res.render("vwAdmin/dashboard", { layout: 'main2.hbs' });
})


var p = function (req, res, next) {

    productModel.proByUser0(req.params.id)
        .then(rows => {
            req.prod = rows;

            return next();

        })
        .catch(err => next(err));
}
var p1 = function (req, res, next) {

    productModel.proByUser1(req.params.id)
        .then(rows1 => {
            req.prod1 = rows1;

            return next();

        })
        .catch(err => next(err));
}
var p2 = function (req, res, next) {

    productModel.proByUser2(req.params.id)
        .then(rows2 => {
            req.prod2 = rows2;

            return next();

        })
        .catch(err => next(err));
}
var p3 = function (req, res, next) {

    productModel.proByUser3(req.params.id)
        .then(rows3 => {
            req.prod3 = rows3;

            return next();

        })
        .catch(err => next(err));
}
var p4 = function (req, res, next) {

    productModel.proByUser4(req.params.id)
        .then(rows4 => {
            req.prod4 = rows4;

            return next();

        })
        .catch(err => next(err));
}
var gCD = function (req, res, next) {

    productModel.getCD(req.params.id)
        .then(rows5 => {
            console.log(rows5[0]);
            var k= rows5[0];
            if(k)
            { res.getCD = rows5[0].CatID;
         
                productModel.getProCat(res.getCD) .then(rows6 => {
                    req.PC = rows6;
                    
                    return next();
                });}
           else 
           return next();

            
           

        })
        .catch(err => next(err));
}
router.get('/:id/categories', (req,res,next) => {
    id = req.params.id;
    if(res.locals.admin)
    {
    categoryModel.all()
    .then(rows => {
      res.render('vwCategories/index', {
        categories: rows,
        layout: 'main2.hbs'
      });
    }).catch(next);
    }
})
router.get('/:id/members', (req,res,next) => {
    id = req.params.id;
    if(res.locals.admin)
    {
    
      res.render('vwAdmin/members', {
        layout: 'main2.hbs'
      });
    }
})
router.get('/:id/users', (req,res,next) => {
    id = req.params.id;
    if(res.locals.admin)
    {
    
      res.render('vwAdmin/users', {
        layout: 'main2.hbs'
      });
    }
})
router.get('/:id/typography', (req,res,next) => {
    id = req.params.id;
    if(res.locals.admin)
    {
        res.render('vwAdmin/typography', {
            layout: 'main2.hbs'
          });
    }
})
router.get('/:id/table/', [p,p1, p2, p3, p4,gCD], function (req, res, next) {
    id = req.params.id;

    userModel.single(id)
        .then(rows => {
            account = rows[0];
            var dob = moment(account.f_DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');

            
            var entity = account;
            entity.f_DOB = dob;
            console.log(entity.f_Permission) ;
            if (entity.f_Permission == 5) {
                res.render("vwAdmin/table", {
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
                        prod, prod1, prod2, prod3, prod4,id ,
                        layout: 'main2.hbs'


                    });
                }
                else
                if(entity.f_Permission == 4)
                {
                    prod5 = req.PC;
                    console.log(id);
                    res.render("vwEditor/table", {
                        prod5,id ,
                        layout: 'main2.hbs'


                    });
                }


        })


})
router.get('/:id/profile', (req, res, next) => {
    id = req.params.id;
    userModel.single(id)
        .then(rows => {
            account = rows[0];
            var dob = moment(account.f_DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');

            var entity = account;

            entity.f_DOB = dob;

            if (entity.f_Permission == 5) {
                res.render("vwAdmin/profile", {
                    entity,
                    layout: 'main2.hbs'


                });
            }
            else
                if (entity.f_Permission !=5) {
                    res.render("vwWriter/profile", {
                        entity,
                        layout: 'main2.hbs'


                    });
                }
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
router.post("/:id/profile", isPic, function (req, res) {
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
router.get('/:idu/edit/:id', gTag,function(req, res, next) {
    id = req.params.id;
    productModel.single3(id)
        .then(rows => {
            product = rows[0];
       console.log(product);
            Tag= req.gT;
            res.tga = '';
            for(var i =0; i<Tag.length ; i++)
            {
                if(i==(Tag.length -1) )
              res.tga = res.tga + Tag[i].tagName;
              else
              res.tga = res.tga + Tag[i].tagName +',';
            }
            console.log(res.tga);
            console.log(Tag);
            t = res.tga;
                    res.render("vwWriter/edit", {
                       product,Tag,t,
                        layout: 'main2.hbs',


                    });
                
        }).catch(next);
})

var b2= function (req, res, next) {
    console.log(req.body.TinyDes);
    productModel.IDsingle()
      .then(rows => {
        req.iddd = rows[0].ProID;
       
        return next();
  
      })
      .catch(err => next(err));
  }
router.post('/:idu/edit/:id',b2,function(req,res) {

    console.log(res.locals.authUser.f_Permission);
    if(res.locals.authUser.f_Permission ==3)
    {
    var entity = new Object;
    entity.CatID = req.body.CatID; 
    if(req.body.subCatID != null)
    entity.subCatID = req.body.subCatID;
    else
    entity.subCatID = 0;
    entity.pic= req.body.pic;
    console.log(entity.pic);
    var xx= entity.pic.split(" ")[2];
    
 
     var yy = xx.split("=")[1];
    var av = (yy.slice(1,yy.length-1));
    entity.pic = av;
    
   
    
    entity.ProName = req.body.ProName; 
    entity.TinyDes = req.body.TinyDes; 
    entity.FullDes = req.body.FullDes; 
    
    entity.Click=0;
     entity.CreatedAt= moment().format('YYYY-MM-DD HH:mm:ss');
     console.log(req.body.author);
     entity.author= req.body.author;
     entity.TrangThai = 0;
     var tagg = req.body.tags;
     var tag  = tagg.split(",");
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
      res.iddd=req.iddd + 1 ;
       console.log(res.iddd);
       res.i= 0;
       res.i2= 0;
         
         var tagarray = [];
         productModel.alltag().then(rew=>{
           for( res.i in rew)
           {
             tagarray.push(rew[res.i].tagName);
            res.i = res.i+1;
           }
           console.log(tagarray.length);
           for(res.i2 in tag)
           {
             res.i3 = 0;
             console.log(res.i2);
             for(res.i3 in tagarray)
             {
               console.log(res.i3);
               if(tagarray[res.i3]===tag[res.i2])
               {
                   console.log("da co ");
                   console.log(tag[res.i2]);
                   productModel.IDsingle2(tag[res.i2]).then(
                     r=>{
                       console.log(tag[res.i2]);
                       console.log(res.iddd);
                       res.idtag = r[0];
                       var enti = new Object;
                       enti.proID=res.iddd;
                       enti.tagID = res.idtag.tagID;
                       
                       productModel.addITag(enti);
                      
                       console.log(enti.tagID);
                       console.log("thanh cong 1");
                     
                     }
                     
                   )
                   break;
               }
               else{
                 
                 if(res.i3==(tagarray.length-1))
                 {
                   console.log("canthem vao");
                 console.log(tag[res.i2]);
                 productModel.addTag(tag[res.i2]);
                 console.log(tag[res.i2]);
                 productModel.IDsingle2(tag[res.i2]).then(
                   r=>{
       
                     
                     console.log(res.iddd);
                     console.log(r[0]);
                     res.idtag = r[0];
                     var enti = new Object;
                     enti.proID=res.iddd;
                     enti.tagID = res.idtag.tagID;
                     
                     productModel.addITag(enti);
                    
                     console.log(enti.tagID);
                     console.log("thanh cong 2");
                   
                   }
                   
                 )
               }
               console.log(res.i3);
               res.i3=res.i3+1;
               }
              
             }
             res.i2=res.i2+1;
           }
         })
        }
        else
        if(res.locals.authUser.f_Permission == 4)
        {
            productModel.isNT(req.params.id)
            .then(rows => {
                
              if(rows.length >0)
              {
                  
              
                  productModel.updateNT(req.params.id,req.body.SMS);
                
              }
              else{
                     
                     
                      productModel.addNT(req.params.id,req.body.SMS);
              }
             
            
        
            })
            .catch(err => next(err));
       

        }
     
   
     res.redirect(/user/);
   
    
   })
var KT= function (req, res, next) {
    console.log(req.body.TinyDes);
    
  }
router.post('/:idu/Accept/:id',b2,function(req,res) {
    console.log(res.locals.authUser.f_Permission);
    productModel.isNT(req.params.id)
      .then(rows => {
          
        if(rows.length >0)
        {
            
            productModel.Accept(req.params.id);
            productModel.updateNT(req.params.id,req.body.SMS);
          
        }
        else{
                productModel.Accept(req.params.id);
               
                productModel.addNT(req.params.id,req.body.SMS);
        }
       
      
  
      })
      .catch(err => next(err));
      res.redirect(/user/);
   })
module.exports = router;