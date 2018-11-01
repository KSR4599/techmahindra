
var mongoose = require('mongoose');
var bcrypt=require('bcryptjs')


// Modelled the schema to be containing three fields in total 1.Username 2.Password 3.email
var userSchema= new mongoose.Schema({
    username: {
      type: String,
    },

    password: {
      type: String,

    },
    email :{
      type : String
    }

  })

var User=module.exports=mongoose.model('User',userSchema);

//These methods are used by password while serializing and de-serializing
module.exports.getUserById = function(id, callback){
  User.findById(id, callback);
}

module.exports.getUserByUsername = function(username, callback){
  var query = {username : username};
  User.findOne(query, callback);
}

module.exports.comparePassword = function(candidatePassword,hash,callback){
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {

  callback(null,isMatch);
});
}


module.exports.createUser = function(newUser,callback){
 bcrypt.genSalt(10, function(err, salt) {
    bcrypt.hash(newUser.password, salt, function(err, hash) {
      newUser.password=hash;
      newUser.save(callback);
    });
});

}
