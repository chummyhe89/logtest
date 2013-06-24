var zlib = require('zlib')
  , Rule = require('../models/rule');
var error ='{"code":"0","msg":"not gzip data"}';
var ok	= '{"code":"1","msg":"ok"}';

Object.equals = function( x, y ) {
        // If both x and y are null or undefined and exactly the same
        if ( x === y ) {
            return true;
        }
 
        // If they are not strictly equal, they both need to be Objects
        if ( ! ( x instanceof Object ) || ! ( y instanceof Object ) ) {
            return false;
        }
 
        // They must have the exact same prototype chain, the closest we can do is
        // test the constructor.
        if ( x.constructor !== y.constructor ) {
            return false;
        }
 
        for ( var p in x ) {
            // Inherited properties were tested using x.constructor === y.constructor
            if ( x.hasOwnProperty( p ) ) {
                // Allows comparing x[ p ] and y[ p ] when set to undefined
                if ( ! y.hasOwnProperty( p ) ) {
                    return false;
                }
 
                // If they have the same strict value or identity then they are equal
                if ( x[ p ] === y[ p ] ) {
                    continue;
                }
 
                // Numbers, Strings, Functions, Booleans must be strictly equal
                if ( typeof( x[ p ] ) !== "object" ) {
                    return false;
                }
 
                // Objects and Arrays must be tested recursively
                if ( ! Object.equals( x[ p ],  y[ p ] ) ) {
                    return false;
                }
            }
        }
 
/*        for ( p in y ) {
            // allows x[ p ] to be set to undefined
            if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
                return false;
            }
        }
*/
        return true;
    };



var processDataPerLine = function(rule,logs,imeiRepo,io,callback)
{
	if(logs.length == 0) return callback(true);
	var arr_logs = logs.split('\n');
	for(var i =0,j=arr_logs.length;i<j;i++)
	{
		var line = arr_logs[i];
		var json_obj = JSON.parse(line)
		  , uid = json_obj.param.uid
		  , ver = json_obj.param.v
		  , app = json_obj.param.app
		  , data = json_obj.data
		  , rules_for_ver= {};
		 rules_for_ver["version"] = ver;

		for(var n=0,m=data.length;n<m;n++)
		{
			

		
		   module = data[n].module
		  , type = data[n].type
		  , origin = data[n].origin
		  , json_rule = {}
		  , matched_ver_rules = [];
		  json_rule['app']=app;
		  json_rule['module'] = module;
		  json_rule['type']  = type;
		  json_rule['origin'] = origin;
		  if(typeof data[n].optvalue !=='undefined')
			json_rule['optvalue'] =data[n].optvalue;
		  if(typeof data[n].optvalue2 !=='undefined')
			json_rule['optvalue2'] =data[n].optvalue2;
/*
	需要判断的字段
	app
	module
	type
	origin
	optvalue
	optvalue2

*/
		rule.gets(rules_for_ver,function(err,rls)
		{
			if(err) return callback(err);
			var len = rls.length;
			var matched_ver_rules = [];
			for (var i in json_rule)
			{
				console.log(i+":"+json_rule[i]);
			}
			for (var i in rls[0])
				console.log(i+":"+rls[0][i]);
			//需要先和这个版本的特殊规则匹配，如果符合了，就要高亮的提示
			for (var k=0;k<len;k++)
			{
				if(Object.equals(json_rule,rls[k])) //匹配的特殊规则
				{
				
					matched_ver_rules.push(rls[k]);	
				}
			}
			if(matched_ver_rules.length !=0)
			{
				console.log('--------------------------------------'+matched_ver_rules.length);
				sendLogAndResult(uid,imeiRepo,line,matched_ver_rules,function(err)
				{
					if(err) return callback(err);
					return callback(null);
				}
				);
			}
			else
			{
				sendLogAndResult(uid,imeiRepo,line,rule,json_rule,function(err)
				{
					if(err) return callback(err);
					return callback(null);
				});
			}
		}	
		);	
}
}	
};


var sendLogAndResult=function(uid,repos,log,rule,query,callback)
{
	if(uid && uid!=='')
	{
		sockets = repos[uid];
		if(typeof sockets!=='undefined')
		{
			for(var j=0,k=sockets.length;j<k;j++)
				sockets[j].emit('jsondata',log);
			if(arguments.length == 6)
			{
			rule.gets(query,function(err,rls)
			{
				if(err)  return callback(err);
				var len = rls.length;
				if(len ==0) //没有规则
				{
					for(var j=0,k=sockets.length;j<k;j++)
						sockets[j].emit('infoNoRule',"没有匹配的规则");
					return callback(null);
				}
				else if(len >=1) //多条规则
				{
					for(var j=0,k=sockets.length;j<k;j++)
						sockets[j].emit('infoMultiRule',rls[0].app+":"+rls[0].loginfo);
					return callback(null);
				}
				else
				{
					for(var j=0,k=sockets.length;j<k;j++)
						sockets[j].emit('info',rls[0].app+":"+rls[0].loginfo);
					return callback(null);
				}
			}
			);
			}
			else if(arguments.length ==5)
			{
				//特殊版本的日志
				var rules = arguments[3]
				  , callback = arguments[4] 
				  , len = rules.length;
				if(len == 1)
				{
					for(var j=0,k=sockets.length;j<k;j++)
						sockets[j].emit('infoVerRule',rules[0].app+"."+rules[0].version+":"+rules[0].loginfo);
						return callback(null);
				}
				else
				{
					for(var j=0,k=sockets.length;j<k;j++)
						sockets[j].emit('infoMultiVerRule',rules[0].app+"."+rules[0].version+":"+rules[0].loginfo);
						return callback(null);
				}

			}	
		}
		else return callback("不是uid为:"+uid+"的日志!");
			
	}
	else
	{
		return callback("日志格式错误:没有uid!");
	}


};

module.exports = function(app,io,usersImei)
{	
	app.get('/',function(req,res)
	{
		var imei = req.session.imei;
		if(typeof imei == 'undefined')
		{
			var qimei = req.query.imei;
			if(qimei && qimei !=='')
			{
				req.session.imei = qimei; //设置session
				res.redirect('/test');
			}
		
			res.render('input',{title:'日志测试平台'});
		}
		else res.redirect('/test');
	}
	);	
        app.get('/logout',function(req,res)
	{
		req.session=null;
		res.end();
	});
	app.get('/test',function(req,res)
	{
		var imei = req.session.imei;
		if(imei && imei !=='')
		{	
			
			res.render('index',{title:'日志测试平台',info:'你的imei号:'+imei});	
		}
		else
		{
	//		res.render('index',{title:'日志测试平台',info:'你没有输入imei号,将接收到所有日志'});
			res.redirect('/');
		
		}
	}
	);
	app.post('/',function(req,res)
	{
		var data = req.body;
		var buffer = req.buffer;
		if(buffer.length ==0) res.end(error);
	//判断是否需要解压
		else if(data.slice(0,8) === '{"data":')
		{
			processDataPerLine(Rule,data,usersImei,io,function(err)
			{
				if(err) res.end(error);
				res.end(ok);
			});
		}
	//	decompress
		else
		{
			zlib.gunzip(buffer,function(err,output)
			{
				if(err) //解压失败。发送端收到error,测试平台将不会收到任何数据
				{
					console.log('-------------------decompress failed----------');
					res.end(error);
				}
				else
				{
					console.log(output.toString());
					processDataPerLine(Rule,output.toString(),usersImei,io,function(err)
					{
						if(err) res.end(error);
						res.end(ok);
					});
				}
			}
			);
		
		}
	}
	);

/*
	app.post('/client',function(req,res)
	{
		console.log(req.body);
		res.send(req.body);
	}
	);

*/
};
