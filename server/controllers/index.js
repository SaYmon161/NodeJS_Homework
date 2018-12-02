const formidable = require('formidable');
const db = require('../models/db')();

module.exports.getIndex = function (req, res) {
  res.render('pages/index');
};

module.exports.sendEmail = function (req, res, next) {
  let form = new formidable.IncomingForm();

  form.parse(req, function(err, fields) {
    if (err) {
      return next(err);
    }

    for (let key in fields) {
      db.set(`mail:${key}`, fields[key]);
      db.save();
    }
    res.redirect('/?msg=Данные загружены');
  });
};