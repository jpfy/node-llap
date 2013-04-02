
$(document).ready(function(){

	$('#wrapper #serialtalk #serialtalk-btn').click(function(e){
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
	});	
});