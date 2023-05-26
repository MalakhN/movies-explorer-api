const mongoose = require('mongoose');
const validator = require('validator');

const movieSchema = new mongoose.Schema({
  country: {
    type: String,
    required: true,
  },
  director: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  year: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Некорректная ссылка на изображение',
    },
    required: true,
  },
  trailerLink: {
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Некорректная ссылка на видео',
    },
    required: true,
  },
  thumbnail: {
    type: String,
    validate: {
      validator: (value) => validator.isURL(value),
      message: 'Некорректная ссылка на изображение',
    },
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'user',
    required: true,
  },
  movieId: {
    type: Number,
    ref: 'movieId',
    required: true,
  },
  nameRU: {
    type: String,
    required: true,
  },
  nameENG: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('movie', movieSchema);
