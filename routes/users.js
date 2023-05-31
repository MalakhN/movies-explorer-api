const usersRouter = require('express').Router();
const { celebrate, Joi } = require('celebrate');
const { getUserInfo } = require('../controllers/users');
const { updateUserInfo } = require('../controllers/users');

usersRouter.get('/me', getUserInfo);

usersRouter.patch(
  '/me',
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      name: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUserInfo
);

module.exports = usersRouter;
