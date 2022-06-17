const mongoose = require('mongoose');

// описываем модель
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    require: true,
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    require: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    require: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Data,
    default: Data.now,
  },
});

// создаем модель и экспортируем ее
module.exports = mongoose.model('card', cardSchema);
