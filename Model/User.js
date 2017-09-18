/**
 * Created by Administrator on 2017/9/15.
 */
import {query} from '../db/index';
class UserModel {
    constructor() {

    }

    /* 查用户信息*/
    findUser(account) {
        let mysql = 'select * from user where username=?';
        return new Promise((resolve, reject) => {
            query(mysql, [account], (err, val, fields) => {
                if (!err) {
                    val.length > 0 ? resolve(val) : resolve(false);
                } else {
                    reject(err);
                }
            })
        });
    };

    /* 注册到临时表*/
    addUser(account, md5pssword, nickname, email, tokenTime, randomString) {
        let mysql = 'insert into user_interim(username, password,nickname,email,token_exptime,randomString) values(?,?,?,?,?,?)';
        return new Promise((resolve, reject) => {
            query(mysql, [account, md5pssword, nickname, email, tokenTime, randomString], (err, val, fields) => {
                if (!err) {
                    resolve(true)
                } else {
                    reject(err);
                }
            })
        });
    };

    /*查询激活*/
    queryAccount(account, code) {
        let mysql = 'select randomString,status from user_interim where username=?';
        return new Promise((resolve, reject) => {
            query(mysql, [account], (err, val, fields) => {
                if (!err) {
                    val.length > 0 ? resolve(val) : resolve('该账户不存在');
                } else {
                    reject(err);
                }
            })
        })
    };

    /*更新激活*/
    updateStatus(account) {
        let mysql = 'update user_interim set status=? where username =?';
        return new Promise((resolve, reject) => {
            query(mysql, [1, account], (err, val, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    };
}
module.exports = new UserModel();