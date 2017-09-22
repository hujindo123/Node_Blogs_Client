/**
 * Created by Administrator on 2017/8/29.
 */
require('babel-core/register');
require("babel-polyfill");
const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
// const RedisStore = require('connect-redis')(session);//这是为了使Express和Redis两者能够后互相协调的工作，这个使得整个过程更加的容易
const app = express();
const router = require('./router/index');

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1');
    if (req.method == 'OPTIONS') {
        res.send(200);
    } else {
        next();
    }
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    resave: true,// 是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
    saveUninitialized: false, //是指无论有没有session cookie，每次请求都设置个session cookie ，默认给个标示为 connect.sid
    //secure: 应用在https
    cookie: {
        maxAge: 1000 * 60 * 60 // default session expiration is set to 1 hour
    },
    secret: '1234567890QWERTY'
}));

app.use(router);

/* 该中间件都会重新修改session的过期时间，从而达到预期的效果。 */
/*
 app.use(function (req, res, next) {
 req.session._garbage = Date();
 req.session.touch();
 next();
 });
 */

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
