/**
 * Created by Administrator on 2017/9/15.
 */
import {query} from '../db/index';
class UserModel {
    constructor() {

    }

    /* 查用户信息*/
    findUser(account, status) {
        return new Promise((resolve, reject) => {
            var mysql;
            switch (status) {
                case 0:
                    mysql = 'select * from user_interim where email=?';
                    break;
                case 1:
                    mysql = 'select * from user_interim where u_id=?';
                    break;
                default:
                    mysql = 'select * from user_interim where username=?';
                    break;
            }
            query(mysql, [account], (err, val, fields) => {
                if (!err) {
                    val.length > 0 ? resolve(val) : resolve(false);
                } else {
                    reject(err);
                }
            })
        });
    };

    /*检测邮箱是否存在*/
    checkEmail(email) {
        return new Promise((resolve, reject) => {
            let mysql = 'select * from user_interim where email=?';
            query(mysql, [email], (err, val, fields) => {
                if (!err) {
                    val.length > 0 ? resolve(val) : resolve(false);
                } else {
                    reject(err);
                }
            })
        });
    }

    /* 注册到临时表*/
    addUser(account, md5pssword, nickname, email, tokenTime, randomString) {
        return new Promise((resolve, reject) => {
            let mysql = 'insert into user_interim(username, password,nickname,email,token_exptime,randomString) values(?,?,?,?,?,?)';
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
        return new Promise((resolve, reject) => {
            let mysql = 'select randomString,status from user_interim where username=?';
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
        return new Promise((resolve, reject) => {
            let mysql = 'update user_interim set status=? where username =?';
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
    updateEmailCode(code, account, randomString) {
        return new Promise((resolve, reject) => {
            var mysql;
            switch (code) {
                case 0:
                    mysql = 'update user_interim set randomString=? where username =?';
                    break;
                case 1:
                    mysql = 'update user_interim set randomString=? where email =?';
                    break;
            }
            query(mysql, [randomString, account], (err, val, fields) => {
                if (!err) {
                    resolve({
                        account: account,
                        randomString: randomString
                    })
                } else {
                    reject(err);
                }
            })
        });
    };

    /*修改密码*/
    updatePass(account, pass) {
        return new Promise((resolve, reject) => {
            let mysql = 'update user_interim set password=? where username =?';
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
            let mysql = 'update user_interim set header=? where u_id=?';
            query(mysql, [img, id], (err, val, fields) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(val)
                }
            })
        });
    };
}
module.exports = new UserModel();