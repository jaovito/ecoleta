const mongoose = require('mongoose')

const ecology = new mongoose.Schema({
    image: String,
    name: String,
    address: String,
    address2: String,
    state: String,
    city: String,
    items: String
  });
  
 module.exports = mongoose.model('Eco', ecology);
  