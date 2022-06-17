const mongoose = require('mongoose');

// описываем модель
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  about: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  avatar: {
    type: String,
    require: true,
  },
});

// создаем модель и экспортируем ее
module.exports = mongoose.model('user', userSchema);
