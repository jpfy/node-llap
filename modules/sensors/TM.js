/*
 * TM.js
 * temperature sensor / server side handling code
 */

/* functions that are required:
 *  - init(socket) : bind some listeners to the socket should some interaction
 *       with the main page be required
 *  - onUserConnected(socket) : serve data over the socket when someone
 *       views the main page
 *  - onDataOverSerial(sockets, message) : process the message received over
 *       the serial connection and send the update over the socket
 */

var TMtemp = "??";
var TMbatt = "??";

exports.init = function(socket){
};

exports.onUserConnected = function(socket){
	socket.emit('received-TM-temp', { content: ("Temp: "+TMtemp+" ºC") });
	socket.emit('received-TM-batt', { content: ("Batt: "+TMbatt+" V") });
};

exports.onDataOverSerial = function(sockets,message){
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
};