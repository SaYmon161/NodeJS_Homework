const formidable = require('formidable');
const db = require('../models/db')();

module.exports.getLogin = function (req, res) {
  res.render('pages/login');
};

module.exports.login = function (req, res, next) {
  let form = new formidable.IncomingForm();

  form.parse(req, function(err, fields) {
    if (err) {
      return next(err);
    }

    for (let key in fields) {
      db.set(`login:${key}`, fields[key]);
      db.save();
    }
    res.redirect('/admin');
  });
};