var lhelper = require('./llap_helper');

/*
	Public API
*/

exports.writeNumber = function(n)
{
// parse number into multiplier and remainder //
	var m = Math.floor(n/255);
	var r = n%255;
	var data = [1, m, r];
	console.log('sending over serial ::', data);
	sendDataOverSerial(new Buffer(data));
}

exports.getPath = function()
{
	if(serport) {
		return serport.path;
	} else {
		return "not connected";
	}
}

exports.sendLLAPmsg = function(msg)
{
	msg = lhelper.padMessage(lhelper.fixSignature(msg));
	if(lhelper.isValid(msg)) {
		sendDataOverSerial(msg);
	} else {
		console.log('error :: the message "'+msg+'" is not valid.');
	}		
}

/*
	Private Methods
*/

var serport;
var socket = require('./socket_server');
var serialport = require('serialport');
var exec = require('child_process').exec;

/*
	Attempt to connect to a serial port
*/

var detectSerialOnOSX = function()
{
	var port;
	console.log('* attempting to detect a serial port on mac osx *');
	exec('ls /dev/tty.*', function(error, stdout, stderr){
		if (stdout){
			var ports = stdout.split('\n');
			for (var i = ports.length - 1; i >= 0; i--){
				if (ports[i].search('usbmodem') != -1 || ports[i].search('usbserial') != -1) port = ports[i];
			}
		}
		if (port){
			attemptConnection(port);
		}	else{
			detectSerialOnRaspberryPI();
		}
	});
}

var detectSerialOnRaspberryPI = function()
{
	var port;
	console.log('* attempting to connect to a serial port on raspberry pi *');
	serialport.list(function (e, ports) {
		ports.forEach(function(obj) {
			if (obj.hasOwnProperty('pnpId')){
		// FTDI captures the duemilanove //
		// Arduino captures the leonardo //
		// CC1111 captures the URF stick //
				if (obj.pnpId.search('FTDI') != -1 || obj.pnpId.search('Arduino') != -1 || obj.pnpId.search('CC1111') != -1) {
					port = obj.comName;
				}
			}
		});
		if (port){
			attemptConnection(port);
		}	else{
			console.log('* failed to find a serial port : please check your connections *');
		}
	});
}

var incomingData = "";
var llapParser = function(emitter, buffer){
	incomingData += buffer.toString();
	// remove any stuff before a signature 'a' appears
	incomingData = incomingData.replace(/^[^]*?a/,'a');
	while (incomingData.length >= 12) {
		emitter.emit('data',incomingData.substr(0,12));
		incomingData = incomingData.substr(12).replace(/^[^]*?a/,'a');
	}
}

var attemptConnection = function(port)
{
	console.log('* attempting to connect to serial at :', port, ' *');
	serport = new serialport.SerialPort(port, { baudrate: 9600, parser: llapParser });
	serport.on("open", function () {
		console.log('* connection to a serial port successful ! *');
		serport.on('data', function(data){
	// send incoming data from serport out to the socket server //
			socket.onDataOverSerial(data);
		});
	});
}

var sendDataOverSerial = function(buffer)
{
// calling write if an serport is not connected will crash the server! //
	if (serport){
		serport.write(buffer, function(e, results) {
			if (e) {
				console.log('error :: ' + e);
			}	else{
			//	console.log('message successfully sent');
			}
		});
	}
}

detectSerialOnOSX();
//detectSerialOnRaspberryPI();
