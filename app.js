var express = require('express');
var exphbs = require('express-handlebars');
var hbs_sections = require('express-handlebars-sections');
var morgan = require('morgan');
var createError = require('http-errors');
var numeral = require('numeral');
var flash = require('express-flash');
var mysql = require('mysql');
var app = express();  
var connection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : '',
  database : 'qlbh'
});

connection.connect();


app.use(morgan('dev'));
app.engine('hbs', exphbs({
  layoutsDir: 'views/_layouts',
  defaultLayout: 'main.hbs',
  helpers: {
    format_number: val => {
      return numeral(val).format('0,0');
    },
    section: hbs_sections()
  }
}));
app.set('view engine', 'hbs');

// parse application/x-www-form-urlencoded
app.use(express.urlencoded({
  extended: true
}));
// parse application/json
app.use(express.json());
app.use(flash());
app.use(express.static('public'));

require('./middlewares/session')(app);
require('./middlewares/passport')(app);
require('./middlewares/upload')(app);

app.use(require('./middlewares/auth.mdw'));
app.use(require('./middlewares/category.mdw'));

app.use(require('./routes/home'));


app.use('/categories', require('./routes/categories'));
app.use('/products', require('./routes/products'));
app.use('/account', require('./routes/account'));

app.post('/search',function(req,res){
   
  console.log(req.headers.referer);
 
  connection.query('SELECT * from products where ProName like "%'+req.body.typehead+'%"', function(err, rows, fields) {
      if (err) throw err;
       var data= rows[0];
       res.redirect('/products/'+data.ProName);
        
    });
  });
  

  
app.get('/error', (req, res) => {
  res.render('error', { layout: false });
})

app.use((req, res, next) => {
  next(createError(404));
})

app.use((err, req, res, next) => {

  var status = err.status || 500;
  var vwErr = 'error';

  if (status === 404) {
    vwErr = '404';
  }

  // app.set('env', 'prod');
  // var isProd = app.get('env') === 'prod';

  process.env.NODE_ENV = process.env.NODE_ENV || 'dev';
  var isProd = process.env.NODE_ENV === 'prod';
  var message = isProd ? 'An error has occured. Please contact administartor for more support.' : err.message;
  var error = isProd ? {} : err;

  var message = isProd ? 'An error has occured. Please contact administartor for more support.' : err.message;
  var error = isProd ? {} : err;

  res.status(status).render(vwErr, {
    layout: false,
    message,
    error
  });
})

var port = 3000;
app.listen(port, () => {
  console.log(`server is running at port http://localhost:${port}`);
});