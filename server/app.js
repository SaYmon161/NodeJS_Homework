const Koa = require('koa');
const app = new Koa();
const staticDir = require('koa-static');
const session = require('koa-session');
const config = require('./config/config.json');
const fs = require('fs');
const flash = require('koa-better-flash');

const Pug = require('koa-pug');
const pug = new Pug({
  viewPath: './views',
  pretty: false,
  basedir: './views',
  noCache: true,
  app: app
});

app.use(staticDir('./public'));

const router = require('./routes');

app
  .use(session(config.session, app))
  .use(flash())
  .use(router.routes())
  .use(router.allowedMethods());

app.listen(3000, () => {
  if (!fs.existsSync(config.upload)) {
    fs.mkdirSync(config.upload);
  }
  console.log('Сервер запущен на 3000 порту');
});