
/*
 * GET home page.
 */
module.exports = function(app,io,usersImei)
{	
	app.get('/',function(req,res)
	{
		var imei = req.query.imei;
		if(imei && imei !=='')
		{
			req.session.imei = imei; //设置session
			res.redirect('/test');
		}
		res.render('input',{title:'日志测试平台'});
	}
	);	
	app.get('/test',function(req,res)
	{
		var imei = req.session.imei;
		console.log('-----------------------------------------session.imei'+imei+'--------------');
		if(imei && imei !=='')
		{	
			
			res.render('index',{title:'日志测试平台',info:'你的imei号:'+imei});	
		}
		else
		{
			res.render('index',{title:'日志测试平台',info:'你没有输入imei号,将接收到所有日志'});
		
		}
	}
	);
	app.post('/',function(req,res)
	{
	//	console.log("post.....................");		
		var data = req.body
		  , json_obj = JSON.parse(data)
		  , imei = json_obj.param.uid;
		if(imei && imei !=='')
		{
			var socket = usersImei[imei];
			socket.emit('jsondata',req.body);
		}
		else
		{
			io.sockets.emit('jsondata',req.body);
		}
	//	res.render('index',{body:req.body});
		res.end();
	}
	);
	app.post('/client',function(req,res)
	{
		console.log(req.body);
		res.send(req.body);
	}
	)
}

/*exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};
*/

