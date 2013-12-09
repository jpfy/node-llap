/*
 * - implement logging
 * - well, I got tired of fighting with streams, so here goes a trivial data logger
 * NOTES:
 * - logging should be done to a transport, which then takes care to chunk to
 *    files by itself
 * - reading on streams:
 *   - https://github.com/substack/stream-handbook
 *   - http://codewinds.com/blog/2013-08-19-nodejs-writable-streams.html
 */

// this is relative to process.cwd();
var logDir = './data_log/';

var fs = require('fs');

var strftime = require('strftime');

exports.log = function(sensor, data){
	fs.appendFile(logDir+sensor+strftime('-%Y-%m.csv'),
		strftime('%Y,%m,%d,%H,%M,%S,')+data+'\n',
		function (err) {
			if (err)
				console.log(strftime('%F %H:%M:%S: ')+sensor+': could not log to csv file: '+err);
		});
};
