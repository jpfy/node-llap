
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
				content:$('#serialtalk #serialtalk-text').val()
			});
		} else {
			// socket unavailable: can't send
		}
	}

	$('#serialtalk #serialtalk-btn').click(sendLLAPmessageEvent);
	$('#serialtalk #serialtalk-text').keyup(function(e){
                if (e.keyCode==13) { sendLLAPmessageEvent(e); }
    });

    $('#refresh-logs-btn').click(function(e){
    	if( socket && socket_connected ){
    		socket.emit('requesting-logs-refresh', {});
    	}
    });
});