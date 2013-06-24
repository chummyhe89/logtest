var db = require('./db');
function Rule(rule)
{
	this.log = {}
	for (var i in rule)
		this.log[i] = rule[i];
};

module.exports = Rule;

Rule.prototype.save=function(callback){
	var rule={};
	for (var i in this.log)
		rule[i]=this.log[i];
	db.open(function(err,db)
	{
		if(err) return callback(err);
		db.collection('counter',function(err,col)
		{
			if(err)
			{
				db.close();
				return callback(err);
			}
			col.findAndModify({_id:'rules'},[],{$inc:{next:1}},{new:true,upsert:true},function(err,doc)
			{
				if(err) 
				{
					db.close();
					return callback(err);
				}
				rule._id=doc.next;
				
				db.collection('rules',function(err,col)
				{
					if(err)
					{
						db.close();
						return callback(err);
					}
					col.insert(rule,{w:1},function(err,docs)
					{
						db.close();
						callback(err,docs);
					});
				}
				);
			}
			);
		}
		);
	}
	);
};

Rule.getsByApp = function(appName,callback){

	db.open(function(err,db)
	{
		
	}
	);
};
Rule.gets = function(rule,callback){
	db.open(function(err,db)
	{
		if(err) return callback(err);
		db.collection('rules',function(err,col)
		{
			col.find(rule).toArray(function(err,docs)
			{
				db.close();
				callback(err,docs);
			}
			);
		}
		);
	}
	);
};
