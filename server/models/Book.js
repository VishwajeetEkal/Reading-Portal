const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
});

const bookSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  genre: {
    type: String,
    required: true,
  },
  ISBN: {
    type: String,
    required: true,
  },
  publication_year: {
    type: Number,
  },
  condition: {
    type: String,
    required: true,
  },
  price_per_day: {
    type: Number,
    required: true,
  },
  owner_user_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  location: {
    type: locationSchema,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  postedAT: {
    type: Date,
    default: Date.now,
},
active:{
  type: Boolean,
  required: true,
  default: true,
},
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
