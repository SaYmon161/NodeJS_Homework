const express = require('express');
const path = require('path');
const app = express();
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const session = require('express-session');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(cookieParser());
app.use(session({ 
  secret: 'upload',
  resave: true,
  saveUninitialized: true,
}));
app.use(flash());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', require('./routes/index'));

app.use(function(req, res, next) {
  let err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res) {
  res.status(err.status || 500);
  res.render('error', { message: err.message, error: err });
});

const server = app.listen(process.env.PORT || 3000, function() {
  console.log('Сервер запущен на порте: ' + server.address().port);
});