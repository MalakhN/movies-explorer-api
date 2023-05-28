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
    trailerLink: Joi.string().required().regex(regEx),
    thumbnail: Joi.string().required().regex(regEx),
    movieId: Joi.number().required(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

moviesRouter.delete('/:_Id', celebrate({
  params: Joi.object().keys({
    _Id: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = moviesRouter;
