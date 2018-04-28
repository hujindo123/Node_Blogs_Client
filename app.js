/**
 * Created by Administrator on 2017/8/29.
 */
require('babel-core/register');
require("babel-polyfill");
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);//这是为了使Express和Redis两者能够后互相协调的工作，这个使得整个过程更加的容易
const app = express();
const history =  require('connect-history-api-fallback');
const router = require('./router/index');

app.all('*', function (req, res, next) {
    res.header("Access-Control-Allow-Origin", req.headers.origin || '*');
    res.header("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
    res.header("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Credentials", true); //可以带cookies
    res.header("X-Powered-By", '3.2.1');
    next();
});
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended: false}));
// parse application/json
app.use(bodyParser.json());
app.use(cookieParser());
app.use(session({
    resave: true, //是指每次请求都重新设置session cookie，假设你的cookie是10分钟过期，每次请求都会再设置10分钟
    saveUninitialized: false, //无论是否有cookie  session 默认给个标示为 connect.sid
    secure:false,//为true时时https or http
    cookie: {maxAge: 600 * 1000},
    secret: 'recommand 128 bytes random strin',
    store: new RedisStore({
        host: '127.0.0.1',
        port: 6379,
        db: 0
    })
}));
app.use(router);
app.use(history({
    rewrites: [
        { from: /\/soccer/, to: '/'}
    ]
}));

app.use(express.static('./public'));
const port = process.env.port || 3001;

app.listen(port, () => {
    console.log(`server is run ${port}`);
});
module.exports = app;
/*
* status
* 100 参数错误
* 200 返回成功
* 0  未登录 cookie失效
* 500 服务器错误
* 300未激活
* -1 查询失败
* */