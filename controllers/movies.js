const Movie = require('../models/movie');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ForbiddenError } = require('../errors/ForbiddenError');

const getAllMovies = (req, res, next) => {
  Movie.find({})
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
    trailer,
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
    trailer,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner: _id
  })
    .then((newMovie) => {
      Movie.findOne(newMovie)
        .populate(['owner'])
        .then((movie) => res.status(201).send(movie));
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequestError('Некорректные данные для добавления фильма'));
        return;
      }
      next(err);
    });
};

const deleteMovie = (req, res, next) => {
  const { movieId } = req.params;
  Movie.findById(movieId)
    .then((movie) => {
      if (!movie) {
        throw new NotFoundError('Фильм не найден');
      } else if (movie.owner.toString() !== req.user._id) {
        throw new ForbiddenError('Пользователь не может удалить фильм, который не добавлял');
      } else {
        return Movie.deleteOne({ _id: movieId }).then(() => res.send(movie));
      }
    })
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Некорректный id фильма'));
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
