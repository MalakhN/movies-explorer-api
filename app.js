const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const { PORT = 3000, NODE_ENV, URL_DB_PROD } = process.env;

const { errors } = require('celebrate');
const helmet = require('helmet');
const limiter = require('./middlewares/limiter');
const { URL_DB_DEV } = require('./utils/urlDBdev');
const router = require('./routes');
const { errorCentralHandler } = require('./middlewares/errorCentralHandler');
const cors = require('./middlewares/cors');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const app = express();

mongoose.connect(NODE_ENV === 'production' ? URL_DB_PROD : URL_DB_DEV);

app.use(helmet());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(requestLogger);

app.use(cors);
app.use(limiter);

app.use(router);

app.use(errorLogger);

app.use(errors());

app.use(errorCentralHandler);

app.listen(PORT, () => {
  console.log(`The server is running on ${PORT}`);
});
