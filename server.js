var express = require('express');
var app = express();
var morgan = require('morgan');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var User = require('./models/user');
var ejs = require('ejs');
var ejsMate = require('ejs-mate');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var flash = require('express-flash');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));
app.engine('ejs',ejsMate);
app.set('view engine','ejs');
app.use(express.static(__dirname+'/public'));
app.use(morgan('dev'));
app.use(cookieParser());
app.use(session({
  resave : true,
  saveUninitialized: true,
  secret: "Harpal@$@!#@"
}));
app.use(flash());
//******************************************************//
//****************Mongodb connection*********************//
mongoose.connect('mongodb://root:abc123@ds035503.mlab.com:35503/ecommerce',function(err){
  if(err) {
    console.log(err);
  }else{
    console.log("connected to mongodb");
  }
});

//****************************************************//
//***************user routes*************************//


app.get('/signup',function(req,res){
  res.render('accounts/signup',{
    errors:req.flash('errors')
  });
});
app.post('/signup',function(req,res, next){
  var user = new User();
  user.profile.name = req.body.name;
  user.password= req.body.password;
  user.email=req.body.email;

  User.findOne({ email: req.body.email}, function(err, existingUser){
    if(existingUser){
      req.flash('errors',"Account with this email already exist");
    //  console.log(req.body.email + " is already exist");
      return res.redirect('/signup');
    }else{
      user.save(function(err){
        if(err) return next(err);
        return res.redirect('/');
      //  res.json("new sucessfully created user");
      });
    }
  });

});

//*************************************************************//
//*********************Main route******************************//

app.get('/',function(req,res){
  res.render('main/home');
});

//*************************************************************//
//*********************run Server on port 3000****************************//
app.listen(3000,function(err){
  if(err) throw err;
  console.log('server running on 3000');
});
