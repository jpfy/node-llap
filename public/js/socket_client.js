var socket = io.connect('/');
var socket_connected = false;
var autoMode;

var TMsensor = require('./sensors/TM.js')

// Sensors: register on the socket
TMsensor.register(socket);

// Initialising the connection
socket.on('connected-to-server', function (data) {
// update the view based with the current server settings //
// generate a random id for this newly connected user //
	var id = Math.floor(Math.random()*9999);
	$('#user-id').html('Connected : <span style="color:blue">'+id+'</span>');
	socket_connected = true;
	socket.emit('connected-client-response', { id:id });
	socket.emit('request-server-info', {});
});

socket.on('server-info-response', function (data) {
	$('footer #serial-port-elt').html('<span>'+data.serialPort+'</span>');
});

socket.on('received-llap-msg', function (data) {
	$('#serialtalk #serialtalk-resp').html(data.content);
});

// Logs

socket.on('sent-latest-logs', function (data) {
	$('#logs-content').html("");
	data.file.forEach(function (elt) {
		$('#logs-content').append(elt.timestamp + ": "+elt.message+"<br />");
	});
});
