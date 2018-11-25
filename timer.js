const yargs = require('yargs');

const argv = yargs
  .usage('Usage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .example('$0 --time 20')
  .option('time', {
    alias: 't',
    describe: 'Timer interval in seconds',
    default: 20
  })
  .argv

const getTime = function() {
  const date = new Date();
  const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
  const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
  return `${hours}:${minutes}:${seconds}`
}

const timer = setInterval(() => {
  console.log(getTime());
}, 1000)

setTimeout(() => {
  clearInterval(timer);
  console.log(`stop time: ${getTime()}`);
}, argv.time * 1000 + 1000)