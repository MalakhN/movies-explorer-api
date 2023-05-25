const jwt = require('jsonwebtoken');

const { NODE_ENV, JWT_SECRET } = process.env;
const { UnauthorizedError } = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Требуется авторизация');
  }
  const token = authorization.replace('Bearer ', '');
  let payload;
  try {
    payload = jwt.verify(token, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key');
  } catch (err) {
    throw new UnauthorizedError('Требуется авторизация');
  }
  req.user = payload;
  return next();
};

module.exports = {
  auth,
};
