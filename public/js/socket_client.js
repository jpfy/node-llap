var socket = io.connect('/');
var socket_connected = false;
var autoMode;

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

// Sensors:

// TM
socket.on('received-TM-temp', function (data) {
	$('#TMtemp').html(data.content);
});
socket.on('received-TM-batt', function (data) {
	$('#TMbatt').html(data.content);
});