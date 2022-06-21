const mongoose = require('mongoose');

// описываем модель
const cardSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Обязательно добавьте название картинки'],
    minlength: 2,
    maxlength: 30,
  },
  link: {
    type: String,
    required: [true, 'Обязательно добавьте ссылку на картинку'],
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: [true, 'Поле owner обязательное'],
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now(),
  },
});

// создаем модель и экспортируем ее
module.exports = mongoose.model('card', cardSchema);
