var createError = require('http-errors');
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var mongoose = require('mongoose');
const bodyParser = require('body-parser'); // Parse incoming request bodies in a middleware before your handlers, available under the req.body property.
var cors = require('cors');

var propertyRouter = require('./routes/properties');
var authRouter = require('./routes/authentication');
var samplingPoints = require('./routes/samplingPoints');
var analyses = require('./routes/analyses');
var users = require('./routes/users');
var clients = require('./routes/clients');
var environment = require('./config/database')

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({ extended: true })); // parse application/x-www-form-urlencoded
app.use(bodyParser.json());                         // parse application/json
app.use(cors());
// app.use(express.static(path.join(__dirname, 'dist/gmaps-ng5')));
// app.use('/', express.static(path.join(__dirname, 'dist/gmaps-ng5')));
app.use('/api/propriedades', propertyRouter);
app.use('/api/conta', authRouter);
app.use('/api/points', samplingPoints);
app.use('/api/analyses', analyses);
app.use('/api/usuario', users);
app.use('/api/cliente', clients);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.send(err.status);
});

console.log(environment)

mongoose.connect(environment.uri, { promiseLibrary: require('bluebird') })
  .then(() =>  console.log('connection successful'))
  .catch((err) => console.error(err));


module.exports = app;