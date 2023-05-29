const Movie = require('../models/movie');
const BadRequestError = require('../errors/BadRequestError');
const NotFoundError = require('../errors/NotFoundError');
const ForbiddenError = require('../errors/ForbiddenError');
const {
  wrongMovieData,
  deletionForbidden,
  movieIDNotFound,
  wrongId
} = require('../errors/errorsTexts');

const getAllMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .populate(['owner'])
    .then((movies) => {
      res.send(movies);
    })
    .catch((err) => {
      next(err);
    });
};

const createMovie = (req, res, next) => {
  const { _id } = req.user;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId
  } = req.body;
  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: _id
  })
    .then((newMovie) => res.status(201).send(newMovie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError(wrongMovieData));
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  Movie.findById({ _id: req.params._id })
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError(movieIDNotFound);
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError(deletionForbidden);
      } else {
        return Movie.deleteOne({ _id: req.params._id }).then(() => res.send(movie));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError(wrongId));
        return;
      }
      next(err);
    });
};

module.exports = {
  getAllMovies,
  createMovie,
  deleteMovie,
};
