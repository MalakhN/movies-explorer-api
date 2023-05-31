require('dotenv').config();

const { NODE_ENV, JWT_SECRET } = process.env;

module.exports = {
  NODE_ENV,
  JWT_SECRET,
};
