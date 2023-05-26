const moviesRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { regEx } = require('../utils/regEx');
const { getAllMovies } = require('../controllers/movies');
const { createMovie } = require('../controllers/movies');
const { deleteMovie } = require('../controllers/movies');

moviesRouter.get('/', getAllMovies);

moviesRouter.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().required().regex(regEx),
    trailer: Joi.string().required().regex(regEx),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
    thumbnail: Joi.string().required().regex(regEx),
    movieId: Joi.number().required(),
  }),
}), createMovie);

moviesRouter.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.number().required(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
