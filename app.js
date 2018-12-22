'use strict';

var PORT   = 8888;

var express    = require('express');
var app = express();
app.use(express.static('views'))
 
var identityKey = 'skey';
var session = require('express-session');
app.use(session({
  name: identityKey,
  secret: 'usmclient', 
  saveUninitialized: false, 
  resave: false, 
  //expires: 0,
  cookie: {
    maxAge: 1000 * 1000 
  }
}));

var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

/*
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
*/
app.get('/', function (req, res) {
  console.log("url:%s(get), user:%s, id:%d", req.url, req.session.user, req.session.id)
  res.sendFile( __dirname + "/" + "views/login.html" );
});
app.post('/login', function (req, res, next) {
  console.log("url:%s(post), user:%s, id:%d", req.url, req.session.user, req.session.id)
  console.log(req.body)
  if (req.body.user == "admin" && req.body.pass == "admin")
  {
    req.session.user = req.body.user;
    //res.sendStatus(200); // equivalent to res.status(200).send('OK')
    res.send(req.body)
  }
  else
	res.sendStatus(403); // equivalent to res.status(403).send('Forbidden')
});
app.get('/mml', function (req, res, next) {
  console.log("url:%s, user:%s, id:%d", req.url, req.session.user, req.session.id)
  var result = [
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    [1,2,3,4,5,6,7,8,9,10,11,12,13,14]
  ]

	console.log(result)
	res.send(result);  
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

