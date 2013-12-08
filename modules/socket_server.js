/*
 * socket_server.js
 *
 * This code runs on the server, maintaining the socket, taking care of
 * connecting to clients and processing the incoming LLAP messages (by
 * passing them down to individual handlers), logging the messages to
 * a file.
 */

var sockets;
var serport = require('./serial_node');
var lhelper = require('./llap_helper');
var logger = require('./log_backend');
var activeUser;
// load all ./sensors/*.js into one object
var sensors = require('./sensors');

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
		// initialise the sensor code (if they want to add some listeners)
		for(var s in sensors){
			if(sensors.hasOwnProperty(s) && sensors[s].hasOwnProperty('init')){
				sensors[s].init(socket);
			}
		}
	});
};

exports.onDataOverSerial = function(data){
	var msg = data.toString();
	// process data received
	if (lhelper.isValid(msg)) {
		// log the message
		logger.log_message(msg);

		// process the message
		var message = lhelper.message(msg);
		var devname = lhelper.deviceName(msg);
		if(sensors.hasOwnProperty(devname) && sensors[devname].hasOwnProperty('onDataOverSerial')){
			// found a sensor with the correct name
			sensors[devname].onDataOverSerial(sockets,message);
		} else {
			// we've got no sensor service code for this device
			// let all the clients know about the message
			sockets.emit('received-llap-msg', { content: msg });
		}
	} else {
		// message not valid
	}
};

var onUserConnected = function(socket)
{
	serport.writeNumber(socket.user.id);
	// run userConnected initialisation code for all loaded sensors
	for(var s in sensors){
		if(sensors.hasOwnProperty(s) && sensors[s].hasOwnProperty('onUserConnected')){
			sensors[s].onUserConnected(socket);
		}
	}
	logger.emit_latest_logs(socket);

	socket.on('requesting-logs-refresh', function (data) {
		logger.emit_latest_logs(socket);
	});
	// here comes socket.on('something-happens', ...)
}