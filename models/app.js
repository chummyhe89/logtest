var db = require('./db');

function App(name)
{
	this.name = name;
};

module.exports = App;

App.prototype.save = function(callback){
	var app = {
		name:this.name
	};

	db.open(function(err,db)
	{
		if(err){
			return callback(err);
		}
		db.collection('counter',function(err,col)
		{
			if(err)
			{
				db.close();
				return callback(err);
			}
			col.findAndModify({_id:'apps'},[],{$inc:{next:1}},{new:true,upsert:true},function(err,doc)
			{
				if(err)
				{
					db.close();
					return callback(err);
				}
				db.collection('apps',function(err,col)
				{
					if(err)
					{
						db.close();
						return callback(err);	
					}
					app._id = doc.next;
					col.insert(app,{w:1},function(err,ap)
					{
						db.close();
						callback(err,ap);
					});
				});
				
			}
			);
		});
	});

};

App.getAll = function(callback)
{
	db.open(function(err,db)
	{
		if(err) return callback(err);
		db.collection('apps',function(err,col)
		{
			if(err)
			{
				db.close();
				return callback(err);
			}
			col.find().toArray(function(err,docs)
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
