const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET, NODE_ENV } = require('../config');
const { BadRequestError } = require('../errors/BadRequestError');
const { NotFoundError } = require('../errors/NotFoundError');
const { ConflictError } = require('../errors/ConflictError');
const { UnauthorizedError } = require('../errors/UnauthorizedError');
const {
  userNotFound,
  userIdNotFound,
  wrongUserUpdate,
  wrongEmail,
  wrongUserData,
  wrongEmailPassword
} = require('../errors/errorsTexts');

const getUserInfo = (req, res, next) => {
  User.findById({ _id: req.user._id })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userNotFound);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      next(err);
    });
};

const updateUserInfo = (req, res, next) => {
  const owner = req.user._id;
  const { name, email } = req.body;
  User.findByIdAndUpdate(
    owner,
    { name, email },
    {
      new: true,
      runValidators: true,
    }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(userIdNotFound);
      } else {
        res.send(user);
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError(wrongEmail),
        );
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(wrongUserUpdate));
        return;
      }
      next(err);
    });
};

const createUser = (req, res, next) => {
  const {
    name, email
  } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({
      name, email, password: hash
    }))
    .then((newUser) => {
      res.status(201).send({
        email: newUser.email,
        name: newUser.name,
      });
    })
    .catch((err) => {
      if (err.code === 11000) {
        next(
          new ConflictError(wrongEmail)
        );
      } else if (err.name === 'ValidationError') {
        next(new BadRequestError(wrongUserData));
      } else {
        next(err);
      }
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  User.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError(wrongEmailPassword);
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          throw new UnauthorizedError(wrongEmailPassword);
        }
        const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'some-secret-key', {
          expiresIn: '7d',
        });
        res.send({ token });
      });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getUserInfo,
  createUser,
  updateUserInfo,
  login,
};
