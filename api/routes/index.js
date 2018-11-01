//requiring all the modules
var express = require('express');
var app = express()
var router = express.Router();
module.exports = router;
var mongoose=require('mongoose');
mongoose.set('useCreateIndex', true);
var passport = require('passport')
  , LocalStrategy = require('passport-local').Strategy;
app.use(passport.initialize());
app.use(passport.session());
var flash = require('express-flash-notification')
var User=mongoose.model('User')


// ROOT RENDER
router.get('/',function(req, res){
  res.render('index')
})

//LOGIN RENDER
router.get('/login',function(req,res){
  res.render('login')
})

//REGISTER RENDER
router.get('/register',function(req,res){
  res.render('register')
})

// ROOT RENDER
router.get('/wronglogin',function(req, res){
  res.render('wronglogin')
})



//REGISTER POST FUNCTION
router.post('/register',function(req, res,next){
  var email = req.body.email;
  var username=req.body.username;
  var password=req.body.password;
  var password2=req.body.password2;


  User.findOne({ 'email': req.body.email}, function(err, user) {
    if(user){
      res.render('register',{x:3});
    }
    else{


  //form validation
  req.checkBody('password2','passwords do not match'). equals(req.body.password);
  //Check Errors
  var errors=req.validationErrors();
if(password!==password2){
  res.render('register',{
    errors:'Passwords Do not match!'
  });
}
  else{

    var newUser = new User({
      username:username,
      email:email,
      password:password
    })
    User.createUser(newUser,function(err, user){
      if(err) throw err;
      console.log(user);

}) }
}
})
req.flash('Success:-', 'You are now registered and can Login!',false);
res.redirect('/api/login')
})




//LOGIN POST
router.post('/login',
passport.authenticate('local',{failureRedirect:'/api/wronglogin'}),
function(req, res, next){
  req.flash('Success:-', 'You are now Logged in!',false);
 res.redirect('/api/');

});


passport.serializeUser(function(user, done) {
       return done(null, user.id);
});

passport.deserializeUser(function(id, done) {
    User.getUserById(id, function(err, user) {
      return done(err, user);
});
});

passport.use(new LocalStrategy(
  function(username, password, done) {
    User.getUserByUsername(username,function(err,user){

      if(err) {return done(err);}

      if(!user){
        console.log("No user found");
         return done(null,false,{message:'Unknown User!'});
        }

      User.comparePassword(password,user.password,function(err,isMatch){
        if(err) {return done(err); }

        if(isMatch){
       console.log("User Found!")
              return done(null,user);
        }
          else {
              return done(null, false, {
                  message: "Invalid password"})

           //return done(null,false)
         }
         })
})

}));



//LOGOUT ROUTE
router.get('/logout',function(req,res,next){
  req.logout();
  req.flash('Success:-', 'You are now Logged out!',false);
  res.redirect('/api/login');
})
