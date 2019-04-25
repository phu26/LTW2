var express = require('express');
var exphbs = require('express-handlebars');
var morgan = require('morgan');
var app = express();
var publicDir = require('path').join(__dirname, '/public');
var bodyParser = require('body-parser');


app.use(morgan('dev'));
app.use(express.static(publicDir));
app.use(express.static('pic'));
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');
app.use(bodyParser.urlencoded({
    extended: false
}));
app.use(bodyParser.json());
app.use('/categories', require('./routes/categories'));
app.get('/', (req, res) => { res.render('home'); })

app.get('/test', (req, res) => { res.end('test page.'); })
var port = 3000;
app.listen(port, () => {console.log(`server is running at port ${port}`);});

