const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../models/db')();

module.exports.getAdmin = function (req, res) {
  res.render('pages/admin');
};

module.exports.sendSkills = function (req, res, next) {
  let form = new formidable.IncomingForm();

  form.parse(req, function(err, fields) {
    if (err) {
      return next(err);
    }

    for (let key in fields) {
      db.set(`skills:${key}`, fields[key]);
      db.save();
    }
    res.redirect('/admin');
  });
};

module.exports.sendProduct = (req, res, next) => {
  let form = new formidable.IncomingForm();
  let upload = path.join('./public', 'upload');

  if (!fs.existsSync(upload)) {
    fs.mkdirSync(upload);
  }

  form.uploadDir = path.join(process.cwd(), upload);

  form.parse(req, function(err, fields) {
    if (err) {
      return next(err);
    }

    for (let key in fields) {
      db.set(`product:${key}`, fields[key]);
      db.save();
    }
    res.redirect('/admin');
  });
};