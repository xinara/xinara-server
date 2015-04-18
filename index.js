var express = require('express');
var redis = require('redis');
var c = redis.createClient();
var bodyParser = require('body-parser');
var log = require('./lib/logger').getLogger();
var openpgp = require('openpgp');
var fs = require('fs');

var serverkey = fs.readFileSync('./priv.key');
var pkey = openpgp.key.readArmored(serverkey.toString()).keys[0];
pkey.decrypt('xinara');

var app = express();

app.use(bodyParser.raw({"type":"application/text", verify: false}));

c.on('connect', function() {
    log.debug('connected to redis');
});

prefix = 'xinara_';
batch = 5 * 60 * 1000;
expire = 3 * 24 * 60 * 60 * 1000;

app.post('/', function (req, res) {
  armored_content = req.body.toString("utf8");
  process.stdout.write(armored_content);
  log.debug(armored_content);
  pgp_content = openpgp.message.readArmored(armored_content);

  openpgp.decryptMessage(pkey, pgp_content).then(function(content) {
    now_date = new Date().getTime();
    available_date = Math.ceil(now_date / batch) * batch;
    log.debug(content);
    log.debug(now_date);
    log.debug(available_date);
    c.zadd(prefix + 'posts', available_date, content);
    res.send('OK');
  }).catch(function(error) {
    res.send('ERR');
  });

});


app.get('/', function (req, res) {
  now_date = new Date().getTime();
  expire_date = now_date-expire;
  log.debug(expire_date);
  log.debug(now_date);
  c.zrangebyscore(prefix + 'posts', expire_date, now_date, function(err, posts){
    log.debug(err);
    log.debug(posts);
    res.send(posts);
  });
});

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  log.debug('Xinara server listening at http://%s:%s', host, port);
});
