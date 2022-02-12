const mongoose = require('mongoose');

const characterSchema = new mongoose.Schema({
  fullName: String,
  name: String,
  img: String
})

const Character = mongoose.model("Characters", characterSchema);

module.exports = Character;
