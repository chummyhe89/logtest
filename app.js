
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
//  , user = require('./routes/user')
  , http = require('http')
  , parseCookie = require('connect').utils.parseSignedCookies
  , MemoryStore = require('connect').middleware.session.MemoryStore
  , cookie = require('cookie')
  , path = require('path');

//  , client = require('socket.io-client');

var app = express()
  , usersImei = {} // 保存各个socket的imei
  , storeMemory = new MemoryStore({
		reapInterval: 60000 * 10
	});//session store

function rawBodyParser(req,res,next)
{
if(req._body) return next();
req.body = req.body || '';
if('GET' == req.method || 'HEAD' == req.method) return next();
var buf = '';
req.setEncoding('utf8');
req.on('data',function(chunk){buf +=chunk});
req.on('end',function(){req.body = buf;next();});
};

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(rawBodyParser);
app.use(express.cookieParser());
app.use(express.session({
	key : 'ttpod',
	secret : 'chummy',
	store:storeMemory
}));
//app.use(express.bodyParser());
//app.use(express.methodOverride());
app.use(app.router);
app.use(require('stylus').middleware(__dirname + '/public'));
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

var server = http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
var io = require('socket.io').listen(server);
io.set('authorization', function(handshakeData, callback){
	// 通过客户端的cookie字符串来获取其session数据
	handshakeData.cookie = parseCookie(cookie.parse(handshakeData.headers.cookie),'chummy');
	var connect_sid = handshakeData.cookie['ttpod'];
	
	if (connect_sid) {
		storeMemory.get(connect_sid, function(error, session){
			if (error) {
				// if we cannot grab a session, turn down the connection
				callback(error.message, false);
			}
			else {
				// save the session data and accept the connection
				handshakeData.session = session;
				callback(null, true);
			}
		});
	}
	else {
		callback(null,true);//也允许连接，并广播消息给他
	}
});
io.sockets.on('connection',function(socket)
{
	console.log('-----------------------------one connected--------------------------');
	var session = socket.handshake.session;
	var imei = session.imei;
	usersImei[imei] = socket;	
	
	socket.on('disconnect',function()
	{
		delete usersImei[imei];
		session = null;
	}
	);
}
);
/*
var client=require('socket.io-client').connect('http://192.168.6.62:'+app.get('port'));
client.emit('postjson','hhahahahhahaha');
client.emit('test',{my:'data'});
*/
routes(app,io,usersImei);
