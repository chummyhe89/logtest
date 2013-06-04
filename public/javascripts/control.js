var socket=io.connect('http://192.168.6.62:3000');
socket.on('jsondata',function(data)
{
	var $msg =$('<div class="log"/>');
	$msg.text(data);
	$('div#shell').append($msg);
	var shell = document.getElementById("shell");
	shell.scrollTop = shell.scrollHeight;
});
