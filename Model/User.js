/**
 * Created by Administrator on 2017/9/15.
 */
import {query} from '../db/index';
class UserModel {
    constructor() {

    }

    findUser(account) {
        let mysql = 'select * from user where username=?';
        return new Promise((resolve, reject) => {
            query(mysql, [account], (err, val, fields) => {
                if (!err) {
                    val.length > 0 ? resolve(true) : resolve(false);
                } else {
                    reject(err);
                }
            })
        });
    };

    addUser(account, md5pssword, nickname, email) {
        let mysql = 'insert into user(username, password,nickname,email) values(?,?,?,?)';
        return new Promise((resolve, reject) => {
            query(mysql, [account, md5pssword, nickname, email], (err, val, fields) => {
                if (!err) {
                    resolve(true)
                } else {
                    reject(err);
                }
            })
        });
    }

    getMessage(account) {
        let mysql = 'select* from user where username=?';
        return new Promise((resolve, reject) => {
            query(mysql, [account], (err, val, fields) => {
                if (!err) {
                    resolve(val)
                } else {
                    reject(err);
                }
            })
        })
    }
}
module.exports = new UserModel();