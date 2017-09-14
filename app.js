/**
 * Created by Administrator on 2017/8/29.
 */
const express = require('express');
const app = express();
const router = require('./router/index');
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  res.header("X-Powered-By",' 3.2.1')
  res.header("Content-Type", "application/json;charset=utf-8");
  next();
});


app.use(router);
const port = process.env.port || 3001;

app.listen(port, () => {
    console.log(`server is run ${port}`);
});
module.exports = app;
