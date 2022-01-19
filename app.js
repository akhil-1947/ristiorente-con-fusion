var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');
const FileStore = require('session-file-store')(session);
var config = require('./config');

const passport = require('passport');
const authenticate = require('./authenticate');

const mongoose = require('mongoose');

const url = config.mongoUrl;
const connect = mongoose.connect(url,{useNewUrlParser: true,useUnifiedTopology: true,useFindAndModify: false});

connect.then((db) => {
  console.log("successfully started the mongodb server");
  },err => {
  console.log(err);
})
.catch((err) => console.log(err));

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dishRouter = require('./routes/dishRouter');
var promoRouter = require('./routes/promotionRouter');
var leaderRouter = require('./routes/leaderRouter');
var uploadRouter = require('./routes/uploadRouter');
var favoritesRouter = require('./routes/favoriteRouter');
var commentsRouter = require('./routes/commentRouter');
var cartRouter = require('./routes/cartRouter');
var ordersRouter = require('./routes/ordersRouter');
var feedbackRouter = require('./routes/feedbackRouter');

var app = express();

// Secure traffic only
// app.all('*', (req,res,next) => {
//   if(req.secure) {
//     return next();
//   }
//   else {
//     // redirect unsecure traffic to the secure server
//     // status code sent is 307, which is temporary redirect and it tells the user agent to must not change the 
//     // request method if it performs an automatic redirection to that uri
//     res.redirect(307,'https://'+req.hostname+':'+app.get('secPort')+req.url);
//   }
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
// app.use(cookieParser('12345-67890-09876-54321'));

// passport.initialize() middleware is required to initialize Passport
app.use(passport.initialize());

// app.use('/', indexRouter);
app.use('/users', usersRouter);

app.use('/dishes',dishRouter);
app.use('/leaders',leaderRouter);
app.use('/promotions',promoRouter);
app.use('/imageUpload',uploadRouter);
app.use('/favorites',favoritesRouter);
app.use('/comments', commentsRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);
app.use('/feedback',feedbackRouter);

if(process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname,'confusion/build')));
}
app.use(express.static(path.join(__dirname, 'public')));

app.get('*', function (request, response){
  response.sendFile(path.resolve(__dirname, 'confusion/build' ,'index.html'))
})

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
  if(req.app.get('env') === 'development') {
    res.render('error');
  }
  else {
    res.redirect(`https://${req.hostname}/error.html`);
  }
});

module.exports = app;