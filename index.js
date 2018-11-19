const path = require('path');
const fs = require('fs');
const del = require('del');
const yargs = require('yargs');
const paths = {
  src: null,
  dist: null
}
const Observable = require('./assets/observer')

const argv = yargs
  .usage('Usage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .example('$0 --from ./fileDir --to ./fileDir')
  .option('from', {
    alias: 'f',
    describe: 'Source directory path',
    default: './from'
  })
  .option('to', {
    alias: 't',
    describe: 'Destination directory path',
    default: '/to'
  })
  .option('delete', {
    alias: 'd',
    describe: 'Delete source directory after copy'
  })
  .argv

paths.src = path.normalize(path.join(__dirname, argv.from))
paths.dist = path.normalize(path.join(__dirname, argv.to))

const observable = new Observable(() => {
  if (argv.delete) {
    del.sync(`${path.join(paths.src, path.sep)}**`);
    console.log('delete source directory');
  }
});

const sortFiles = (src) => {
  observable.addObserver(src);
  if (!fs.existsSync(paths.dist)) {
    fs.mkdirSync(paths.dist)
  }
  fs.readdir(src, (error, files) => {
    if (error) {
      process.exit(500);
    }

    if (!files.length) {
      process.exit(404);
    }

    files.forEach((item) => {
      const currentPath = path.join(src, item);
      const state = fs.statSync(currentPath)

      if (state.isDirectory()) {
        sortFiles(currentPath)
      } else {
        const firstLetter = item[0];
        const newPath = path.join(paths.dist, firstLetter)

        if (!fs.existsSync(newPath)) {
          fs.mkdirSync(newPath)
        }
        fs.linkSync(currentPath, path.join(newPath, item), err => {
          if (err) {
            console.error(err.message);
            return;
          } 
        })
        console.info(`${currentPath} coppied to`);
        console.log(newPath);
        console.log(' ');
      }
    })

    observable.removeObserver(src);
  })
}

del.sync(paths.dist)
sortFiles(paths.src);
observable.start('sorting...');

process.on('exit', code => {
  switch (code) {
    case 500:
      console.error(`Directory read failed`);
      break;
    case 404:
      console.error(`Directory is clear.`);
      break;
  }
});