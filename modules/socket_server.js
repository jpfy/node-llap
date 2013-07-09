var sockets;
var serport = require('./serial_node');
var lhelper = require('./llap_helper');
var logger = require('./log_backend');
var activeUser;
var TMtemp = "??";
var TMbatt = "??";

exports.init = function(io){
	
	sockets = io.sockets;
	io.set('log level', 1);
	sockets.on('connection', function (socket) {
	// only allow the most recent connected user to interact with serial //
		activeUser = socket;
	// tell client they have successfully connected to the server and wait for their response //
		socket.emit('connected-to-server', {
			// transmit current status
		});
	// listen for the client to tell us who they are //
		socket.on('connected-client-response', function(data){
			socket.user = data;
			onUserConnected(socket);
		});
	// transmit info about the server on request
		socket.on('request-server-info', function (data) {
			socket.emit('server-info-response', { serialPort: serport.getPath() });
		});
	// send an LLAP message over serial
		socket.on('send-llap-msg', function(data){
			serport.sendLLAPmsg(data.content);
		});
	});
};

exports.onDataOverSerial = function(data){
	var msg = data.toString();
	// process data received
	if (lhelper.isValid(msg)) {
		// log the message
		logger.log_message(msg);

		// process the message if "known"
		var message = lhelper.message(msg);
		switch (lhelper.deviceName(msg)) {
			case "TM":
				if(message.substring(0,4) == "TMPA") {
					TMtemp = message.substring(4,9);
					sockets.emit('received-TM-temp',
						{ content: ("Temp: "+TMtemp+" ºC")});
				}
				if(message.substring(0,4) == "BATT") {
					TMbatt = message.substring(4,9);
					sockets.emit('received-TM-batt',
						{ content: ("Batt: "+TMbatt+" V")});
				}
				break;
			default:
				// let all the clients know about the message|
				sockets.emit('received-llap-msg', { content: msg });
				break;
		}
	} else {
		// message not valid
	}
};

var onUserConnected = function(socket)
{
	serport.writeNumber(socket.user.id);
	socket.emit('received-TM-temp', { content: ("Temp: "+TMtemp+" ºC") });
	socket.emit('received-TM-batt', { content: ("Batt: "+TMbatt+" V") });
	logger.emit_latest_logs(socket);

	// here comes socket.on('something-happens', ...)
}