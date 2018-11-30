const yargs = require('yargs');

const argv = yargs
  .usage('Usage: $0 [options]')
  .help('help')
  .alias('help', 'h')
  .example('$0 --time 20')
  .option('interval', {
    alias: 'i',
    describe: 'Timer interval in seconds',
    default: 1
  })
  .option('timer', {
    alias: 't',
    describe: 'Stop delay in seconds',
    default: 10
  })
  .argv

const getTime = function() {
  const date = new Date();
  const hours = date.getHours() >= 10 ? date.getHours() : `0${date.getHours()}`;
  const minutes = date.getMinutes() >= 10 ? date.getMinutes() : `0${date.getMinutes()}`;
  const seconds = date.getSeconds() >= 10 ? date.getSeconds() : `0${date.getSeconds()}`;
  return `${hours}:${minutes}:${seconds}`
}



let http = require('http');
http.createServer(function(req, res) {
  if (req.url !== '/favicon.ico') {
    res.writeHead(404, {
      'Content-type': 'text/plain; charset=utf-8'
    });
    res.writeHead(200, {'Content-Type': 'text/html'});
    
    const timer = setInterval(() => {
      console.log(getTime());
    }, argv.interval * 1000)

    setTimeout(() => {
      clearInterval(timer);
      res.end(`<h1>Stop time: ${getTime()}</h1>`);
    }, argv.timer * 1000)
  } else {
    res.end();
  }

}).listen(8080);




