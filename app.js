/**
 * Created by Administrator on 2017/8/29.
 */
require('babel-core/register');
require("babel-polyfill");
const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const app = express();
const router = require('./router/index');

app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", true); //可以带cookies
  res.header("X-Powered-By", '3.2.1')
  if (req.method == 'OPTIONS') {
    res.send(200);
  } else {
    next();
  }
});
app.use(cookieParser());
app.use(router);


/* 该中间件都会重新修改session的过期时间，从而达到预期的效果。 */
app.use(function(req, res, next){
  req.session._garbage = Date();
  req.session.touch();
  next();
});

/*app.use(session({
  secret: 'test',
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 1000*60*60 // default session expiration is set to 1 hour
  },
  store: new MemcachedStore({
    hosts: ['127.0.0.1:9000'],
    prefix: 'test_'
  })
}));*/








const port = process.env.port || 3001;

app.listen(port, () => {
    console.log(`server is run ${port}`);
});
module.exports = app;
