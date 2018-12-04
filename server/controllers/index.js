const formidable = require('formidable');
const db = require('../models/db')();
const nodemailer = require('nodemailer');
const config = require('../config.json');

module.exports.getIndex = function (req, res) {
  res.render('pages/index', {
    skills: db.get('skills'),
    products: db.get('products'),
    msgsemail: req.flash('msgsemail')
  });
};

module.exports.sendEmail = function (req, res, next) {
  let form = new formidable.IncomingForm();

  form.parse(req, function(err, fields) {
    if (err) {
      return next(err);
    }

    if (!fields.name || !fields.email || !fields.message) {
      req.flash('msgemail', 'Заполните все поля');
    }
    
    const transporter = nodemailer.createTransport(config.mail.smtp);
    const mailOptions = {
      from: `"${fields.name}" <${fields.email}>`,
      to: config.mail.smtp.auth.user,
      subject: config.mail.subject,
      text:
        fields.message.trim().slice(0, 500) +
        `\n Отправлено с: <${fields.email}>`,
    };
    transporter.sendMail(mailOptions, function(error) {
      if (error) {
        req.flash('msgemail', `При отправке письма произошла ошибка!: ${error}`);
      }
      req.flash('msgemail', 'Письмо успешно отправлено!');
    });
    
    res.redirect('/');
  });
};