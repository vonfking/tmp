'use strict';

var tipc = require('./addon/tipc.node');
var resp
tipc.init("10.43.214.204", 0x1101, function(evid, msg, length) {
	var result = []
	var nodes = msg.match('STATUS=(.*),SYS_VERSION')[1].split('&')
	for (var i in nodes)
	{
		result.push(nodes[i].split('-'));
	}
	console.log(result)
	resp.send(result);
});

var PORT   = 8888;

var express    = require('express');
var app = express();
app.use(express.static('views'))
 
var identityKey = 'skey';
var session = require('express-session');
app.use(session({
  name: identityKey,
  secret: 'usmclient', // 用来对session id相关的cookie进行签名
  saveUninitialized: false, // 是否自动保存未初始化的会话，建议false
  resave: false, // 是否每次都重新保存会话，建议false
  //expires: 0,
  cookie: {
    maxAge: 1000 * 1000 // 有效期，单位是毫秒,负数表示临时cookie，只对本窗口有效
  }
}));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.get('/', function (req, res) {
  console.log("url:%s, user:%s, id:%d", req.url, req.session.user, req.session.id)
  if(req.session.user)
    res.redirect('usmclient');
  else
	res.redirect('login');
});
app.get('/usmclient', function (req, res) {
  console.log("url:%s, user:%s, id:%d", req.url, req.session.user, req.session.id)
  if(req.session.user)
    res.sendFile( __dirname + "/" + "views/usmclient.html" );
  else
    res.redirect('login');
});
app.get('/login', function (req, res) {
  console.log("url:%s(get), user:%s, id:%d", req.url, req.session.user, req.session.id)
  res.sendFile( __dirname + "/" + "views/login.html" );
});
app.post('/login', function (req, res, next) {
  console.log("url:%s(post), user:%s, id:%d", req.url, req.session.user, req.session.id)
  console.log(req.body)
  if (req.body.user == "admin" && req.body.pass == "admin")
  {
    req.session.user = req.body.user;
    res.sendStatus(200); // equivalent to res.status(200).send('OK')
  }
  else
	res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
});
app.get('/mml', function (req, res, next) {
  console.log("url:%s, user:%s, id:%d", req.url, req.session.user, req.session.id)
  var commid = 0x3B0007E9
  var jno    = 0xc8001		
  var evid   = 1561
  resp = res
  if (req.query.mml.search(":") > 0)
    tipc.sendmsg(commid, jno, evid, '30002/35|COMM_1::DDM\n   '+req.query.mml+',SYS_VERSION="master",SYS_RESULT="0",SYS_CMDCODE="1170600",SYS_SESSIONID="10001",SYS_SEQUENCEID="524651",SYS_USERID="254",SYS_USERNAME="",SYS_NETYPE="1",SYS_TERMTYPE="3",SYS_ISTRANS="0",SYS_PATH="/",SYS_ISDISP="0",SYS_DISPMODE="0",SYS_LASTPACK="1",SYS_WRITELOG="0",SYS_IP="10.43.144.194",SYS_APPMODE="CUDR-NF_10-43-214-184.Ncudr_SystemManagement_0.ddm",SYS_ACCTYPE="0",SYS_UP="S_LC"-"en_US",SYS_TID="1539409721727524651",SYS_AUTHCODE="6424ecafd55dc3a274cfa29b00babd08",SYS_NFID="d6cc5cbb-aa55-4058-96aa-be0a2bd6b8ff"')
  else
    tipc.sendmsg(commid, jno, evid, '30002/35|COMM_1::DDM\n   '+req.query.mml+':SYS_VERSION="master",SYS_RESULT="0",SYS_CMDCODE="1170600",SYS_SESSIONID="10001",SYS_SEQUENCEID="524651",SYS_USERID="254",SYS_USERNAME="",SYS_NETYPE="1",SYS_TERMTYPE="3",SYS_ISTRANS="0",SYS_PATH="/",SYS_ISDISP="0",SYS_DISPMODE="0",SYS_LASTPACK="1",SYS_WRITELOG="0",SYS_IP="10.43.144.194",SYS_APPMODE="CUDR-NF_10-43-214-184.Ncudr_SystemManagement_0.ddm",SYS_ACCTYPE="0",SYS_UP="S_LC"-"en_US",SYS_TID="1539409721727524651",SYS_AUTHCODE="6424ecafd55dc3a274cfa29b00babd08",SYS_NFID="d6cc5cbb-aa55-4058-96aa-be0a2bd6b8ff"')
});
app.get('/getevent', function (req, res, next) {
  console.log("url:%s, user:%s, id:%d", req.url, req.session.user, req.session.id)
  var timeout = Math.ceil(100000*Math.random());
  console.log("timeout:%d", timeout);
  setTimeout(function(){
     res.send({"timeout":timeout});	  
  }, timeout);
});
var server = app.listen(PORT, function () {

  var host = server.address().address
  var port = server.address().port

  console.log("server:http://%s:%s", host, port)

})

