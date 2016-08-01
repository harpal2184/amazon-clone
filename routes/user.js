var router = require('express').Router();
var User = require('../models/user');
var passport= require('passport');
router.get('/login',function(req,res){
  if(req.user) return res.redirect('/');
  res.render('accounts/login',{message:req.flash('loginMessage')});
});
router.post('/login', passport.authenticate('local-login',{
  successRedirect: 'profile',
  failureRedirect: 'login',
  failureFlash: true
}));
router.get('/profile',function(req,res,next){
  User.findOne({_id: req.user._id}, function(err,user){
    if(err) return next(err);
      res.render('accounts/profile',{user:user});
    });
  });
router.get('/signup',function(req,res){
  res.render('accounts/signup',{
    errors:req.flash('errors')
  });
});
router.post('/signup',function(req,res, next){
  var user = new User();

  user.profile.name = req.body.name;
  user.password= req.body.password;
  user.email=req.body.email;
  //user.profile.picture= user.gravatar();

  User.findOne({ email: req.body.email}, function(err, existingUser){
    if(existingUser){
      req.flash('errors',"Account with this email already exist");
    //  console.log(req.body.email + " is already exist");
      return res.redirect('/signup');
    }else{
      user.save(function(err,user){
        if(err) return next(err);
//***************************************************************//
//************this functon will create session on server and store cookies on browser//
          req.logIn(user,function(err){
            if(err) return next(err);
            res.redirect('/profile');
          });
      });
    }
  });

});

router.get('/edit-profile',function(req,res,next){
  res.render('accounts/edit-profile',{message:req.flash('edit profile')});
});
router.post('/edit-profile',function(req,res,next){
    User.findOne({_id: req.user._id}, function(err,user){
      if(err) return next(err);

      if(req.body.name) user.profile.name = req.body.name;
      if(req.body.address) user.profile.address = req.body.address;

      user.save(function(err){
        if(err) return next(err);
        req.flash('success', 'Successfully Edited your profile');
        return res.redirect('/profile');
      });
    });
});
router.get('/logout',function(req,res,next){
  req.logout();
  res.redirect('/');
});
module.exports = router;
