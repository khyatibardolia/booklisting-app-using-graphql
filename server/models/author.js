const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//No need to add id field b'coz mongodb will create an id field.
const authorSchema = new Schema({
  name: String,
  age: Number,
});

module.exports = mongoose.model('Author', authorSchema);
