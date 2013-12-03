// Temperature sensor / TM

exports.register = function (socket) {
	socket.on('received-TM-temp', function (data) {
		$('#TMtemp').html(data.content);
	});
	socket.on('received-TM-batt', function (data) {
		$('#TMbatt').html(data.content);
	});
}