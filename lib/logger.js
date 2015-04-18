"use strict";

var winston = require('winston');
var conf = require('../config');

var logLevels = {
  levels: {
      debug: 0,
      warn: 1,
      activity: 2,
      info: 3,
      error: 4,
      security: 5
    },
  colors: {
      debug: 'yellow',
      warn: 'orange',
      activity: 'blue',
      info: 'white',
      error: 'red',
      security: 'red'
    }
};

var logger = null;

module.exports.getLogger = function () {

  var transports = [];


  if (!logger) {

      if (conf.logs.transports) { 
          conf.logs.transports.forEach(function (transport) {
            transports.push(new (winston.transports.Console)(transport)); 
          });
      }

      logger = new (winston.Logger)({
            transports: transports, 
            levels: logLevels.levels
          }); 
  
      winston.addColors(logLevels.colors);
  
    }

  return logger;

};


module.exports.stream = {

    write: function (data) {
//        module.exports.getLogger().info(data);
        console.log(data);
    }

};

