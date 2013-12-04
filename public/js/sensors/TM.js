// Temperature sensor / TM

/* This is the code that updates the webpage when
 * new data appears on the socket.
 * It gets loaded with the webpage, hopefully after
 * the socket has been initalised.
 *
 * A document.ready() function that will bind functions to (say)
 * some button clicks can also go here (sensor specific!).
 */

if( socket ){
	socket.on('received-TM-temp', function (data) {
		$('#TMtemp').html(data.content);
	});
	socket.on('received-TM-batt', function (data) {
		$('#TMbatt').html(data.content);
	});
}
