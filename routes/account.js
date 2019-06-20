var express = require('express');
var bcrypt = require('bcrypt');
var moment = require('moment');
var passport = require('passport');
var userModel = require('../models/user.model');
var restricted = require('../middlewares/restricted');
var multer = require('multer');
var router = express.Router();
var nodemailer = require("nodemailer");
var async = require('async');
var crypto = require('crypto');
router.get('/register', (req, res, next) => {
  res.render('vwAccount/Register');
})
router.post('/register', (req, res, next) => {
  var saltRounds = 10;
  var hash = bcrypt.hashSync(req.body.password, saltRounds);
  var dob = moment(req.body.dob, 'DD/MM/YYYY').format('YYYY-MM-DD');

  var entity = req.body;
  entity.f_Password = hash;
  entity.f_DOB = dob;
  entity.f_Permission = 1;

  delete entity.password;
  delete entity.confirm;
  delete entity.dob;

  userModel.add(entity).then(id => {
    res.redirect('/account/login');
  })
})

router.get('/is-available', (req, res, next) => {
  var user = req.query.user;
  userModel.singleByUserName(user).then(rows => {
    if (rows.length > 0)
      res.json(false);
    else res.json(true);
  })
})

router.get('/login', (req, res, next) => {
  res.render('vwAccount/login', {
    layout: false
  });
})
router.get('/forgot', function (req, res) {
  res.render('vwAccount/forgot', {
    layout: false
  });
})
router.get('/Newpass/:id', function (req, res) {
  req.session.destroy;

  res.render('vwAccount/Newpass', {

    layout: false
  });

})
router.get('/ChPass/:id', function (req, res) {


  res.render('vwAccount/ChPass');

})
router.post('/ChPass/:id', function (req, res) {


  var id = req.params.id;
  var op = req.body.oldP;
  var np = req.body.newP;
  var saltRounds = 10;

  console.log(id);
  userModel.single(id).then(rows => {
    user = rows[0];
    var ret = bcrypt.compareSync(op, user.f_Password);
    var hash = bcrypt.hashSync(np, saltRounds);
    console.log(ret);
    if (ret) {
      userModel.updatePass(id, hash);
      res.render('vwAccount/Newpass', {
        message: 'completed',
        layout: false
      });
    }
    else {
      res.render('vwAccount/Newpass', {
        message: 'wrong pass',
        layout: false
      });
    }


  });

})
router.post('/Newpass/:id', function (req, res) {


  var id = req.params.id;
 
  var np = req.body.newP;
  var saltRounds = 10;

  console.log(id);
  userModel.single(id).then(rows => {
    user = rows[0];
  
    var hash = bcrypt.hashSync(np, saltRounds);
    
    
      userModel.updatePass(id, hash);
      res.render('vwAccount/Newpass', {
        message: 'completed',
        layout: false
      });
    
    


  });

})
router.post('/forgot', function (req, res, next) {
  console.log(req.body.email);

  var toke = crypto.randomBytes(20, function (err, buf) {

    return token = buf.toString('hex');
  });
  email = req.body.email;
  userModel.findOne(req.body.email).then(rows => {
    user = rows[0];
    console.log(user);


    if (!user) {

      req.flash('error', 'No account with that email address exists.');
      return res.redirect('/account/forgot');
    }



    console.log(user);
    console.log(token);
    let transporter = nodemailer.createTransport({
      transport: "SMTP",
      host: 'smtp.gmail.com',
      port: 587,
      secureConnection: false, // true for 465, false for other ports
      requiresAuth: true,
      auth: {
        user: 'nguyentranphu1233@gmail.com',
        pass: 'FUdmtlnlacccpCK3'
      },
      tls: {
        rejectUnauthorized: false
      }
    });


    var mailOptions = {

      to: ''+user.f_Email+'',
      from: '"Nodemailer Contact" <nguyentranphu1233@gmail.com>',
      subject: 'Node.js Password Reset',
      text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
        'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
        'http://' + req.headers.host + '/account/Newpass/' + user.f_ID + '\n\n' +
        'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    };
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return console.log(error);
      }
      console.log('Message sent: %s', info.messageId);



    });




    res.redirect('/account/forgot');
  });


})

router.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err)
      return next(err);

    if (!user) {
      return res.render('vwAccount/login', {
        layout: false,
        err_message: info.message
      })
    }
    var retUrl1 = req.query.retUrl || '/';
    var retUrl3 = req.query.retUrl || '/'
    var retUrl = req.query.retUrl || '/';
    req.logIn(user, err => {
      if (err)
        return next(err);
        return res.redirect(retUrl1);
    });
  })(req, res, next);
})

router.get('/logout', restricted, (req, res, next) => {
  cookie = req.cookies;
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }
    res.cookie(prop, '', { expires: new Date(0) });
  }
  req.logout();
  res.redirect('/account/login');
})
router.post('/logout', restricted, (req, res, next) => {
  cookie = req.cookies;
  for (var prop in cookie) {
    if (!cookie.hasOwnProperty(prop)) {
      continue;
    }
    res.cookie(prop, '', { expires: new Date(0) });
  }
  req.logout();
  res.redirect('/account/login');
})

router.get('/profile/:id', restricted, (req, res, next) => {
  id = req.params.id;
  userModel.single(id)
    .then(rows => {
      account = rows[0];
      var dob = moment(account.f_DOB, 'YYYY-MM-DD').format('DD/MM/YYYY');

      var entity = account;

      entity.f_DOB = dob;




      if (rows.length > 0) {
        res.render('vwAccount/profile', {
          entity
        });
      } else {
        res.render('vwAccount/profile', {
          error: true
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
router.post("/profile/:id", isPic, function (req, res) {
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
    res.redirect('/account/profile/' + id);
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

    res.redirect('/account/profile/' + id);
  }

});
module.exports = router;
