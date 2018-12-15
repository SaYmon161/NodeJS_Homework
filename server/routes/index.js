const Router = require('koa-router');
const router = new Router();
const koaBody = require('koa-body');
const ctrlIndex = require('../controllers/index');
const ctrlLogin = require('../controllers/login');
const ctrlAdmin = require('../controllers/admin');

router
  .get('/', ctrlIndex.getIndex)
  .post('/', koaBody(), ctrlIndex.sendEmail);

router
  .get('/login', ctrlLogin.getLogin)
  .post('/login', koaBody(), ctrlLogin.login);

router
  .get('/admin', ctrlAdmin.getAdmin)
  .post('/admin/skills', koaBody(), ctrlAdmin.sendSkills)
  .post(
    '/admin/upload',
    koaBody({
      multipart: true,
      formidable: {
        uploadDir: process.cwd() + '/public/upload',
      },
      formLimit: 1000000,
    }),
    ctrlAdmin.sendProduct
  );

module.exports = router;