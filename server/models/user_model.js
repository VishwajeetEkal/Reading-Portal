

const mongoose = require('mongoose');

const User = new mongoose.Schema(
    {
        firstname: {type: String,required: true},
        lastname: {type: String,required: true},
        googleId: {type: String},
  email: { type: String, required: true, unique: true },
  username: { type: String, unique: true }, 
  password: { type: String, required: true },
  role:{type:String,required:true},
  quote: { type: String},
  securityQuestion1: {type: String,required: true},
securityAnswer1: {type: String,required: true},
securityQuestion2: {type: String,required: true},
securityAnswer2: {type: String,required: true},
reviews: [{
  reviewerUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  rating: Number,
  comment: String,
}]
},
{collection: 'user-data'})

module.exports = mongoose.model('UserData', User);
