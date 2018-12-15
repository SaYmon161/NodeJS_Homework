const db = require('../models/db');

const { sendEmail } = require('../libs/sendEmail')

module.exports.getIndex = async ctx => {
  ctx.render(
    'pages/index',
    {
      skills: db.getState().skills,
      products: db.getState().products,
      msgsemail: ctx.flash('info')[0]
    });
};

module.exports.sendEmail = async ctx => {
  const { name, email, message } = ctx.request.body;
  
  try {
    await sendEmail(name, email, message)
    ctx.flash('info', 'Сообщение успешно отправлено!');
    ctx.redirect("/#status");
  } catch (error) {
    ctx.flash('info', error.message);
    ctx.redirect('/#status');
  }
 
};