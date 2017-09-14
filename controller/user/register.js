/**
 * Created by Administrator on 2017/8/30.
 */
const express = require('express');
const router = express();
const {query} = require('../../db/index');

router.get('/', (req, res, next) => {
  let usernname = req.query.title
  let mysql = 'select* from'
  query(mysql, [usernname], (err, rows, fileds) => {
    if (err) {
      res.send(err)
    } else {
      res.send({
        code: 200,
        mag: 'Ok'
      });
    }
  });
});
module.exports = router;