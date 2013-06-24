var socket=io.connect('http://192.168.6.62:3000');
var appendResult = function(cls,data)
{
	var $info=$('<div class="'+cls+'"/>');
	$info.text(data);
	$('div#result').append($info);
	var result = document.getElementById("result");
	result.scrollTop = result.scrollHeight;

};
socket.on('jsondata',function(data)
{
	var $msg =$('<div class="log"/>');
	$msg.text(data);
	$('div#shell').append($msg);
	var shell = document.getElementById("shell");
	shell.scrollTop = shell.scrollHeight;
});
socket.on('info',function(data)
{
	appendResult('info',data);
}
);

socket.on('infoNoRule',function(data)
{
	appendResult('infoNoRule',data);
}
);
socket.on('infoMultiRule',function(data)
{
	appendResult('infoMultiRule',data);
}
);
socket.on('infoVerRule',function(data)
{
	appendResult('infoVerRule',data);
}
);
socket.on('infoMultiVerRule',function(data)
{
	appendResult('infoMultiVerRule',data);
}
);
