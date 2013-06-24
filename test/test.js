var App =  require('../models/app.js');
exports.testOk = function(test)
{
	test.expect(1);
	test.ok(true,"this assertion should pass");
	test.done();
};
exports.appsTest = function(test)
{
	test.expect(2);
	var app = new App('ttpod');
	app.save(function(err,a)
	{
		if(err) console.log(err);
		test.equal(a[0].name,'ttpod');
		App.getAll(function(err,as)
		{

			if(err) console.log(err);
			test.equal(as.length,13);
			test.done();
		}
		);
	}
	);
		
};
