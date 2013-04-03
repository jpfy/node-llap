
$(document).ready(function(){

	var sendLLAPmessageEvent = function(e){
		// handle the button press
		/* useful fns: $(e.target).attr('id') .addClass('btn-warning')
			if (socket && socket_connected){
				socket.emit('animation-selected', { id:n });
			}
		 */
		if( socket && socket_connected ){
			socket.emit('send-llap-msg', {
				content:$('#wrapper #serialtalk #serialtalk-text').val()
			});
		} else {
			// socket unavailable: can't send
		}
	}

	$('#wrapper #serialtalk #serialtalk-btn').click(sendLLAPmessageEvent);
	$('#wrapper #serialtalk #serialtalk-text').keyup(function(e){
                if (e.keyCode==13) { sendLLAPmessageEvent(e); }
    });
});