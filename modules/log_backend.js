var winston = require('winston');
var filename = "serial_incoming.log";
winston.add(winston.transports.File, { filename: filename, maxsize: 1048576 });
winston.remove(winston.transports.Console);
winston.add(winston.transports.Console, { timestamp: true, colorize: true });

exports.log_message = function(msg) {
	winston.info(msg);
}

exports.emit_latest_logs = function(socket) {
	winston.query( { from: new Date - 5*60*1000, until: new Date },
		function(err, results) {
			if(err) { throw err; }
			socket.emit('sent-latest-logs', results);
		});
}
