const express = require('express');
const path = require('path');
const logger = require('morgan');
const mongoose = require('mongoose');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const routes = require('./routes');
const app = express();

mongoose.connect(process.env.DB_URL);

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cors());

routes(app);

const port = process.env.PORT || '3000';
const server = http.createServer(app);
server.listen(port);
