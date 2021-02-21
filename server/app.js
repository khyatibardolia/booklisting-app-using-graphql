var createError = require('http-errors');
var express = require('express');
//It allows express to understand graphql. It's an express server that runs the grapghql API's.
const {graphqlHTTP} = require('express-graphql');
const mongoose = require('mongoose');
const mongooseUtil = require('./utilities/mongooseUtil');
const cors = require('cors')

//import the schema file
const schema = require('./schema/schema');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

//allow cors-origin request
app.use(cors());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

//connect to DB
mongooseUtil.connectToServer();
mongoose.connection.once('open', () => {
  console.log('connected to DB');
});

//It's a middleware that will fire graphql api's
// The func graphqlHTTP needs to know the graph of data, so we need to pass schema
//graphiql tool is used to test graphql end-points
app.use('/graphql', graphqlHTTP({
  schema,
  graphiql: true
}));

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
  res.render('error');
});

app.listen(4000, () => {
  console.log('listening');
});
module.exports = app;
