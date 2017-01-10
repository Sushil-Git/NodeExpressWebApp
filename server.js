var express = require('express');
var app = express();

var util = require('util');
var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');

var dbConfig = require('./config/db.js');

var port = process.env.PORT || 3693;

mongoose.connect(dbConfig.url);

require('./config/passport')(passport);


//app.use(morgan('common'));
app.use(morgan('combined', {
    skip: function(req, res) { return res.statusCode < 400 }
}));


app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.set('view engine', 'ejs');

app.use(session({ secret: 'itizmyveryveryveryverysecretsessionkeyforitbdev' }));

app.use('/styles', express.static(__dirname + '/config/css')); // styles
app.use('/img', express.static(__dirname + '/config/images')); // images
app.use('/js', express.static(__dirname + '/node_modules/bootstrap/dist/js')); // bootstrap JS
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist')); //  jquery
app.use('/css', express.static(__dirname + '/node_modules/bootstrap/dist/css')); //  bootstrap CSS
app.use('/fonts/', express.static(__dirname + '/node_modules/bootstrap/dist/fonts')); //  bootstrap fonts


app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

require('./app/routes.js')(app, passport);

app.listen(port);

console.log('App Dev up on', port);