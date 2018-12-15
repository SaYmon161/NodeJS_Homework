const db = require('../models/db');
const fs = require('fs');
const util = require('util');
const _path = require('path');
const validation = require('../libs/validation');
const rename = util.promisify(fs.rename);
const unlink = util.promisify(fs.unlink);

module.exports.getAdmin = async ctx => {
  if (ctx.session.isAdmin) {
    ctx.render('pages/admin', {
      msgskill: ctx.flash('skills')[0],
      msgfile: ctx.flash('file')[0]
    });
  } else {
    ctx.flash('auth', 'Нужна авторизация!')
    ctx.redirect('/login')
  }
};

module.exports.sendSkills = async ctx => {
  const { age, concerts, cities, years } = ctx.request.body;

  db.set('skills', [
      {
        number: age,
        text: 'Возраст начала занятий на скрипке'
      },
      {
        number: concerts,
        text: 'Концертов отыграл'
      },
      {
        number: cities,
        text: 'Максимальное число городов в туре'
      },
      {
        number: years,
        text: 'Лет на сцене в качестве скрипача'
      }
    ])
    .write();
  ctx.flash('skills', 'Информация обновлена!')
  ctx.redirect('/admin')
};

module.exports.sendProduct = async ctx => {
  const { productName, price } = ctx.request.body;
  const { name, size, path } = ctx.request.files.photo;
  const valid = validation(name, price, name, size);
  if (valid) {
    await unlink(path);
    ctx.flash('file', valid.mes)
    ctx.redirect('/admin')
  }
  let fileName = _path.join(process.cwd(), 'public', 'upload', name);
  await rename(path, fileName);
  db.get('products')
  .push({
    src: _path.join('upload', name),
    name: productName,
    price: parseInt(price)
  })
  .write();
  ctx.flash('file', 'Успешно загружено!')
  ctx.redirect('/admin')
};
