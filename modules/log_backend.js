var winston = require('winston');
var filename = "serial_incoming.log";
winston.add(winston.transports.File, { filename: filename, maxsize: 1048576 });
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { timestamp: true, colorize: true });

exports.log_message = function(msg) {
	winston.info(msg);
}