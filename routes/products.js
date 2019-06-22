var express = require('express');
var productModel = require('../models/product.model');
var categoryModel = require('../models/category.model');
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var fs = require('fs')
var path = require('path')
var crypto = require('crypto');
var bodyParser = require('body-parser');
var multer  =   require('multer');
var moment = require('moment');

var storage = multer.diskStorage({
  destination: 'public/pic/',
  filename: function (req, file, cb) {
    crypto.pseudoRandomBytes(16, function (err, raw) {
      if (err) return cb(err)
      cb(null, Math.floor(Math.random()*9000000000) + 1000000000 + path.extname(file.originalname))
    })
  }
})
var upload = multer({ storage: storage });

io.on('connection', function (socket) {
  console.log('a user connected');
});

var router = express.Router();

router.get('/add', (req, res, next) => {
  res.render('vwProducts/add');
})

router.post('/add', (req, res, next) => {
  
  res.end('done');
})
var cmt = function (req, res, next) {

  productModel.ShowCmt(req.params.id)
    .then(rows => {
      req.show = rows;
    
      return next();

    })
    .catch(err => next(err));
}
var relatee = function (req, res, next) {

  productModel.related(req.params.id)
    .then(rows => {
      res.locals.relate = rows;
      
      return next();

    })
    .catch(err => next(err));
}
var gTag = function (req, res, next) {

  productModel.gettag(req.params.id)
      .then(rows4 => {
          req.gT = rows4;

          return next();

      })
      .catch(err => next(err));
}
router.get('/sp/:id', [cmt,gTag, relatee], function (req, res, next) {
  var id = req.params.id;
  Tag= req.gT;
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

    
        res.render('vwProducts/detail', {
          error: false, product, k, showcmt, productRelate,Tag

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
     
      return next();

    })
    .catch(err => next(err));
}

var cmt2 = function (req, res, next) {

  productModel.ShowCmt(req.params.id)
    .then(rows => {
      req.show2 = rows;
     
      return next();

    })
    .catch(err => next(err));
}


router.post('/sp/:id', [b, cmt2,relatee], function (req, res, next) {
  var id = req.params.id;

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
        
       

    
        res.redirect('/products/sp  /'+id);
      } else {
        res.render('vwProducts/detail', {
          error: true
        });
      }
    }).catch(next);

})
router.get('/',(req,res) =>{
  res.render('vwProducts/upload');
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
router.post('/',b2,function(req,res) {


 var entity = new Object;
 entity.CatID = req.body.CatID; 
 if(req.body.subCatID != null)
 entity.subCatID = req.body.subCatID;
 else
 entity.subCatID = 0;
 entity.pic= req.body.pic;
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
                  
                ).catch(err => next(err));
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
                
              ).catch(err => next(err));
            }
            console.log(res.i3);
            res.i3=res.i3+1;
            }
           
          }
          res.i2=res.i2+1;
        }
      }).catch(err => next(err));
      
  

  res.redirect(/products/);

 
})
router.get('/files', function (req, res) {
  const images = fs.readdirSync('public/pic')
  var sorted = []
  for (let item of images){
      if(item.split('.').pop() === 'png'
      || item.split('.').pop() === 'jpg'
      || item.split('.').pop() === 'jpeg'
      || item.split('.').pop() === 'svg'){
          var abc = {
                "image" : "/pic/"+item,
                "folder" : '/'
          }
          sorted.push(abc)
      }
  }
  res.send(sorted);
})
router.post('/', upload.array('flFileUpload', 12), function (req, res, next) {
  res.redirect('back');
});
module.exports = router;
