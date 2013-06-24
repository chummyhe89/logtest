var fs = require('fs');
var zlib = require('zlib');
//var content;
fs.readFile('./gzip.txt',function(err,data)
{
	if(err) throw err;
	console.log(data);
	zlib.gunzip(data,function(err,output)
		{
			if(err) throw err;
			console.log(output.toString());
		});	
});
//console.log(content);
var input = '.................................';
zlib.deflate(input, function(err, buffer) {
  if (!err) {
    console.log(buffer.toString('base64'));
  }
});

var buffer = new Buffer('eJzT0yMAAGTvBe8=', 'base64');
zlib.unzip(buffer, function(err, buffer) {
  if (!err) {
    console.log(buffer.toString());
  }
});

var buff = new Buffer('{"data":[{"key":"value"}],"param":{"uid":"123456"}}','utf8');
zlib.gzip(buff,function(err,output)
{
	if(!err)
	{
		fs.writeFile('./text.gz',output,function(err)
		{
			if(err) throw err;
			fs.readFile('./text.gz',function(err,out)
			{
				if(!err)
				{ 
					console.log(out);
					var str1=out.toString()+'';
					var buf1 = new Buffer(str1);
					console.log(buf1);
				}
			});
		}
		);
	}
});
buf = new Buffer(256);
len = buf.write('\u00bd + \u00bc = \u00be', 0);
console.log(len + " bytes: " + buf.toString('utf8', 0, len));
len = buf.write('\uefbfbd',0);
console.log('-------------------------------------------'+buf.toString('utf8'));
