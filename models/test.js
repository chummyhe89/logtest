var App = require('./app')
  , Rule =require('./rule');
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
 
        for ( p in y ) {
            // allows x[ p ] to be set to undefined
            if ( y.hasOwnProperty( p ) && ! x.hasOwnProperty( p ) ) {
                return false;
            }
        }
        return true;
    };

/*
var app = new App('ttpod');
app.save(function(err,ap)
{
	if(err) throw err;
	for (var i in ap[0])
	console.log(i+'\n');
	
	App.getAll(function(err,aps)
	{
	if(err) throw err;
	console.log(aps.length);
	});
});

*/
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

var  r = {app:'beauty',version:'v3.96.2012112120',module:'user',type:'show',origin:'login',loginfo:'进入登陆页面'};
var rule = new Rule({app:'beauty',version:'v3.96.2012112120',module:'user',type:'show',origin:'login',loginfo:'进入登陆页面'});
rule.save(function(err,rls)
{
	if(err) throw err;
//	for (var i in rls[0])
//		console.log(i+':'+rls[0][i]+'\n');
	Rule.gets(rule.log,function(err,rls)
	{
		if(err) throw err;
		var len = rls.length;
			console.log(rls[0]);
		if(len == 0)
			console.log("error:没有规则");
		else if(len > 1)
			{
			console.log("warning:有多条规则");
			console.log(Object.equals(r,rls[0]));
			console.log(Object.equals(rule,rls[0]));
			}
		else
			console.log("result:"+rls[0].loginfo);
	}
	);
}
);
