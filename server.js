//********************************************//
//***************express module***************//
var express = require('express');
var app = express();
//**********************************************//
//***********morgan to keep log of user action**//
var morgan = require('morgan');
//**bodyParser to read data from user *******//
var bodyParser = require('body-parser');
//*****connect mongodb and nodejs***********//
var mongoose = require('mongoose');
//********bcrypt to encrypt password*******//
var bcrypt = require('bcrypt-nodejs');
//*********** model created in models**//
var User = require('./models/user');
var Category = require('./models/category');
//*************templat engine****************//
var ejs = require('ejs');
//***********extenstion to ejs ************//
var ejsMate = require('ejs-mate');
//**manage user session*********************//
var session = require('express-session');
//********store cookie in browser*********//
var cookieParser = require('cookie-parser');
//******to display error and success msgs***//
var flash = require('express-flash');
//*******valuable data******************//
var secret = require('./config/secret');
//**********store session on server side*******//
var MongoStore = require('connect-mongo/es5')(session);
//**authentication modeule***************//
var passport = require('passport');
//**********config file*****************//
var passportConfig = require('./config/passport');
//***********body parser to accept data in json and urlencoded form//
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
//*******************************************************//
//**********node js engine******************************//
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  resave : true,
  saveUninitialized: true,
  secret: secret.secretKey,
  store: new MongoStore({url: secret.database, autoReconnect:true})
}));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
//************************************************************//
//****middleware where every route can have user object *****//
app.use(function(req,res,next){
  res.locals.user=req.user;
  next();
});
//********************************//
//***middleware for category******//
app.use(function(req,res,next){
  Category.find({},function(err,categories){
    if(err) return next(err);
      res.locals.categories = categories;
      next();
  });
});

//******************************************************//
//****************Mongodb connection*********************//
mongoose.connect(secret.database,{ useMongoClient: true }, function(err){
  if(err) {
    console.log(err);
  }else{
    console.log("connected to mongodb");
  }
});
//****************************************************//
//***************user routes*************************//

var userRoute = require('./routes/user');
app.use(userRoute);
//*************************************************************//
//*********************Main route******************************//

var mainRoute = require('./routes/main');
app.use(mainRoute);

//***************************************************************//
//********************admin route*******************************//
var adminRoute = require('./routes/admin');
app.use(adminRoute);


//*****************************************************************//
//***********************product api*******************************//
var apiRoute = require('./api/api');
app.use('/api',apiRoute);


//*************************************************************//
//*********************run Server on port 3000****************************//
app.listen(secret.port,function(err){
  if(err) throw err;
  console.log('server running on '+ secret.port);
});
