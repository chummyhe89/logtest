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
		  , module = json_obj.data.module
		  , type = json_obj.data.type
		  , origin = json_obj.data.origin
		  , json_rule = {}
		  , matched_ver_rules = [];
		  json_rule['app']=app;
		  json_rule['module'] = module;
		  json_rule['type']  = type;
		  json_rule['origin'] = origin;
		  if(typeof json_obj.data.optvalue !=='undefined')
			json_rule['optvalue'] =json_obj.data.optvalue;
		  if(typeof json_obj.data.optvalue2 !=='undefined')
			json_rule['optvalue2'] =json_obj.data.optvalue2;

		rule.gets(rules_for_ver,function(err,rls)
		{
			if(err) return callback(err);
			var len = rls.lenght;
			//需要先和这个版本的特殊规则匹配，如果符合了，就要高亮的提示
			for (var k=0;k<len;k++)
			{
				if(Object.equals(json_rule,rls[k])) //匹配的特殊规则
				{
				
					matched_ver_rules.push(rls[k]);	
				}
			}
			if(matched_var_rules.length !=0)
			{
				sendLogAndResult(uid,imeiRepo,line,matched_ver_rules,function(err)
				{
					if(err) return callback(err);
				}
				);
			}
			else
			{
				sendLogAndResult(uid,imeiRepo,line,rule,json_rule,function(err)
				{
					if(err) return callback(err);
				});
			}
		}	
		);	
}	
};
