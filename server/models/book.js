const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//No need to add id field b'coz mongodb will create an id field.
const bookSchema = new Schema({
  name: String,
  genre: String,
  authorId: String
});

module.exports = mongoose.model('Book', bookSchema);
