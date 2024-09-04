

const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        firstname: {type: String,required: true},
        lastname: {type: String,required: true},
  email: { type: String, required: true, unique: true },
  role:{type:String,required:true},
  googleId: {type: String,required: true},
  quote: { type: String},
},
{collection: 'google-login'})

module.exports = mongoose.model('GoogleLoginData', User);
