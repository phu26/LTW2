var express = require('express');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var app = express();
var publicDir = require('path').join(__dirname, '/public');
var bodyParser = require('body-parser');
var catogoryModel = require('../models/category.model');


app.use(morgan('dev'));
app.use(express.static(publicDir));
app.use(express.static('pic'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use((require('./middlewares/category.mdw') ) );
app.use('/categories', require('./routes/categories'));
app.get('/', (req, res) => {
    catogoryModel.all()
    .then(rows => {
       res.render('home',{
           categories: rows
        });
      
    })
    .catch(error => {
        res.render('error',{ layout: false})
    }) ;
    
});

app.get('/test', (req, res) => { res.end('test page.'); })
var port = 3000;
app.listen(port, () => {console.log(`server is running at port ${port}`);});

