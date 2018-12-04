const formidable = require('formidable');
const fs = require('fs');
const path = require('path');
const db = require('../models/db')();


module.exports.getAdmin = function (req, res) {
  res.render('pages/admin', {msgskill: req.flash('msgskill'), msgfile: req.flash('msgfile')});
};

module.exports.sendSkills = function (req, res, next) {
  let form = new formidable.IncomingForm();

  form.parse(req, function(err, fields) {
    if (err) {
      return next(err);
    }
    let skills = [
      {
        number: fields.age,
        text: 'Возраст начала занятий на скрипке'
      },
      {
        number: fields.concerts,
        text: 'Концертов отыграл'
      },
      {
        number: fields.cities,
        text: 'Максимальное число городов в туре'
      },
      {
        number: fields.years,
        text: 'Лет на сцене в качестве скрипача'
      }
    ];

    req.flash('msgskill', 'Данные загружены');
    db.set('skills', skills);
    db.save();
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

  form.parse(req, function(err, fields, files) {
    if (err) {
      return next(err);
    }

    const fileName = path.join(upload, files.photo.name);

    fs.rename(files.photo.path, fileName, function(err) {
      if (err) {
        console.error(err.message);
        return;
      }

      let dir = fileName.substr(fileName.indexOf('\\'));

      let newProduct = {
        src: dir,
        name: fields.name,
        price: fields.price
      };

      let products = db.get('products');

      products.push(newProduct);
      
      req.flash('msgfile', 'Картинка успешно загружена');
      db.set('products', products);
      db.save();
      res.redirect('/admin');
    });
  });
};
