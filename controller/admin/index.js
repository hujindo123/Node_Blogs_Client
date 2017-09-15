/**
 * Created by Administrator on 2017/9/6.
 */
/* const formidable = require('formidable') */
import crypto from 'crypto';
import UserModel from '../../Model/User';
class Admin {
    constructor() {
        this.register = this.register.bind(this);
        this.encryption = this.encryption.bind(this);
        this.login = this.login.bind(this);
    }

    async register(req, res, next) {
        let cap = req.cookies.cap;
        if (!cap) {
            console.log('验证码失效');
            res.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码失效'
            });
            return
        }
        const {account, nickname, email, password, validCode} =
            {
                account: req.query.account,
                nickname: req.query.nickname,
                email: req.query.email,
                password: req.query.password,
                validCode: req.query.validCode
            }
        try {
            if (!account) {
                throw new Error('账号参数错误')
            } else if (!nickname) {
                throw new Error('昵称参数错误')
            } else if (!email) {
                throw new Error('邮件参数错误')
            } else if (!validCode) {
                throw  new Error('验证码参数错误')
            }
        } catch (err) {
            console.log('登录参数错误', err)
            res.send({
                status: 500,
                type: 'ERROR_QUERY',
                message: err.message
            })
            return
        }
        if (cap.toString() !== validCode.toString()) {
            res.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码不正确'
            });
            return
        }
        const md5pssword = this.encryption(password);
        try {
            let user = await UserModel.findUser(account);
            console.log(user)
            if (user) {
                res.send({
                    status: 0,
                    type: 'ERROR_USER_EXIST',
                    message: '用户名已存在'
                });
                return
            } else {
                let addUser = await UserModel.addUser(account, md5pssword, nickname, email);
                if (addUser) {
                    res.send({
                        status: 200,
                        type: 'SUCCESS_REGISTER',
                        message: '注册成功'
                    })
                }
            }
        } catch (err) {
            res.send({
                status: 500,
                type: 'ERROR_SERVER',
                message: err.message
            })
        }
    };

    async login(req, res, next) {
        const {account, password} = {
            account: req.query.account,
            password: req.query.password
        };
        try {
            if (!account)
                throw new Error('参数错误');
            else if (!password)
                throw  new Error('参数错误');
        } catch (err) {
            console.log('登录参数错误', err)
            res.send({
                status: 500,
                type: 'ERROR_QUERY',
                message: err.message
            })
            return
        }
        const newmd5password = this.encryption(password)
        let queryPassword = await UserModel.getMessage(account);
        try {
            if (queryPassword.length > 0) { // jn4MfPsyjnClxJvn62Zqcg==
                if (newmd5password.toString() !== queryPassword[0].password.toString()) {
                    res.send({
                        status: 0,
                        type: 'ERROR_LOGIN',
                        message: '账号和密码不匹配'
                    })
                } else {
                    res.send({
                        status: 200,
                        type: 'SUCCESS_LOGIN',
                        message: '登录成功'
                    })
                }
            } else {
                res.send({
                    status: 0,
                    type: 'ERROR_LOGIN',
                    message: '账号不存在'
                })
            }
        } catch (err) {
            res.send({
                status: 500,
                type: 'ERROR_SERVER',
                message: err.message
            })
        }
    };

    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).sub(2, 7) + this.Md5(password));
        return newpassword
    };

    Md5(password) {
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    }
}
module.exports = new Admin();