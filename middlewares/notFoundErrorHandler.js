const NotFoundError = require('../errors/NotFoundError');
const { urlNotFound } = require('../errors/errorsTexts');

const notFoundErrorHandler = (req, res, next) => {
  next(new NotFoundError(urlNotFound));
};

module.exports = { notFoundErrorHandler };
