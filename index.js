const path = require('path');
const fs = require('fs');
const del = require('del');
const util = require('util');
const yargs = require('yargs');
const paths = {
  src: null,
  dist: null
}
const exists = util.promisify(fs.exists)
const mkDir = util.promisify(fs.mkdir)
const readDir = util.promisify(fs.readdir)
const statAsync = util.promisify(fs.stat)
const link = util.promisify(fs.link)

const argv = yargs
  .usage('Usage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .example('$0 --from ./fileDir --to ./fileDir')
  .option('from', {
    alias: 'f',
    describe: 'Source directory path',
    demandOption: true,
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

const createDir = async function (path) {
  try {
    const exist = await exists(path)
    if (!exist) {
      await mkDir(path)
    }
  } catch (e) {
    console.log(e);
  }
}

const sortFiles = async (src) => {
  try {
    console.log(1);
    const files = await readDir(src)
    files.forEach(async (item) => {
      const currentPath = path.join(src, item);
      const state = await statAsync(currentPath)
      if (state.isDirectory()) {
        await sortFiles(currentPath);
      } else {
        const firstLetter = item[0];
        const newPath = path.join(paths.dist, firstLetter)
        await createDir(newPath);
        await link(currentPath, path.join(newPath, item), err => {
          if (err) {
            console.error(err.message);
            return;
          }
          console.info(`${currentPath} coppied to`);
          console.log(newPath);
          console.log(' ');
        })
      }
    })
  } catch (e) {
    console.log(e);
  }
}
del(paths.dist).then(() => createDir(paths.dist)).then(() => sortFiles(paths.src)).then(()=> {
    if (argv.delete) {
      del(`${path.join(paths.src, path.sep)}**`);
      console.log('delete source directory');
    }
  }).catch(e => console.log(e))

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