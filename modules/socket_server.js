var sockets;
var serport = require('./serial_node');
var lhelper = require('./llap_helper');
var logger = require('./log_backend');
var activeUser;

/*
	TODO - need to store the current animation & autoMode setting on the server
*/

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
		// let all the clients know about the message
		sockets.emit('received-llap-msg', { content: msg });
	} else {
		// message not valid
	}
};

var onUserConnected = function(socket)
{
	serport.writeNumber(socket.user.id);
	// here comes socket.on('something-happens', ...)
}