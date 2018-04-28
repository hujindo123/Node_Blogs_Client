/**
 * Created by Administrator on 2017/9/15.
 */
import {query} from "../db/index";
class UserModel {
    constructor() {
    }

    /* 查用户信息*/
    findUser(account, status) {
        return new Promise((resolve, reject) => {
            let mysql;
            switch (status) {
                case 0:
                    mysql = 'select * from user where email=?';
                    break;
                case 1:
                    mysql = 'select * from user where u_id=?';
                    break;
                default:
                    mysql = 'select * from user where user_name=?';
                    break;
            }
            query(mysql, [account], (err, val, fields) => {
                if (!err) {
                    resolve(val);
                } else {
                    reject(err);
                }
            })
        });
    };

    /* 注册到临时表*/
    addUser(account, md5pssword, nickname, email, tokenTime, randomString) {
        return new Promise((resolve, reject) => {
            let mysql = 'insert into user(username, password,nickname,email,token_exptime,randomString) values(?,?,?,?,?,?)';
            query(mysql, [account, md5pssword, nickname, email, tokenTime, randomString], (err, val, fields) => {
                if (!err) {
                    resolve(true)
                } else {
                    reject(err);
                }
            })
        });
    };

    /*更新激活*/
    updateStatus(account) {
        return new Promise((resolve, reject) => {
            let mysql = 'update user set status=? where username =?';
            query(mysql, [1, account], (err, val, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    };

    /* 重新发送邮箱验证 激活账号 */
    updateEmailCode(email, randomString) {
        return new Promise((resolve, reject) => {
            let mysql = 'update user set randomString=? where email =?';
            query(mysql, [randomString, email], (err, val, fields) => {
                if (!err) {
                    resolve(true);
                } else {
                    reject(err);
                }
            })
        });
    };

    /*修改密码*/
    updatePass(account, pass) {
        return new Promise((resolve, reject) => {
            let mysql = 'update user set password=? where username =?';
            query(mysql, [pass, account], (err, val, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(true)
                }
            })
        })
    };

    /* 更新头像 */
    uploadHeader(img, id) {
        return new Promise((resolve, reject) => {
            let mysql = 'update user set header=? where u_id=?';
            query(mysql, [img, id], (err, val, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(val)
                }
            })
        });
    };

    /*修改用户资料*/
    updateUserMessage(nickname, sex, birthday, province, city, area, id) {
        return new Promise((resolve, rejected) => {
            let mysql = 'update user set nickname=?,sex=?, birthday=?, province=?, city=?, area=? where u_id=?';
            query(mysql, [nickname, sex, birthday, province, city, area, id], (err, val, fields) => {
                if (err) {
                    rejected(err)
                } else {
                    resolve(val)
                }
            });
        })
    }
}
module.exports = new UserModel();