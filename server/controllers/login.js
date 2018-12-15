const pswrd = require('../libs/password');
const db = require('../models/db');

module.exports.getLogin = async ctx => {
  if (ctx.session.isAdmin) {
    ctx.redirect('/admin')
  } else {
    ctx.render('pages/login', {msgslogin: ctx.flash('auth')[0]});
  }
};

module.exports.login = async ctx => {
  const { email, password } = ctx.request.body;
  const user = db.getState().user;
  if ( user.login === email && pswrd.validPassword(password)) {
    ctx.session.isAdmin = true
    ctx.redirect('/admin')
  } else {
    ctx.flash('auth', 'Неверное имя пользователя или пароль!')
    ctx.redirect('/login/#status')
  }
};