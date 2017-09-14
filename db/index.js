/**
 * Created by Administrator on 2017/8/30.
 */
const mysql = require('mysql')
const pool = mysql.createPool({
  host: '47.93.236.234',
  user: 'root',
  password: 'hujindong',
  database: 'blogs',
  port: 3306
})
function query (sql, param, callback) {
  pool.getConnection((err, conn) => {
    if (err) {
      callback(err, null, null)
    } else {
      conn.query(sql, param, (err, val, fields) => {
        conn.release()
        callback(err, val, fields)
      })
    }
  })
}
module.exports = {
  query
}