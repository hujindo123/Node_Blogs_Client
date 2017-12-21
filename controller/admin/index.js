/**
 * Created by Administrator on 2017/9/6.
 */
/* const formidable = require('formidable') */
import crypto from "crypto";
import sendEmail from "../../middleware/email";
import UserModel from "../../Model/User";
class Admin {
    constructor() {
        this.register = this.register.bind(this);
        this.encryption = this.encryption.bind(this);
        this.login = this.login.bind(this);
        this.updateEmailCode = this.updateEmailCode.bind(this);
        this.findPass = this.findPass.bind(this);
        this.updatePass = this.updatePass.bind(this);
    }

    async register(req, res, next) {
        const {account, nickname, email, password, validCode, tokenTime, randomString} =
            {
                account:  req.query.account,
                nickname: req.query.nickname,
                email:    req.query.email,
                password: req.query.password,
                validCode: req.query.validCode,
                tokenTime: new Date().getTime() + 60 * 60 * 24, //过期时间
                randomString: this.randomString()
            };
        try {
            if (!req.cookies.cap) {
                throw new Error('验证码失效，请点击刷新');
            } else if (!account) {
                throw new Error('账号参数错误')
            } else if (!nickname) {
                throw new Error('昵称参数错误')
            } else if (!email) {
                throw new Error('邮件参数错误')
            } else if (!validCode) {
                throw  new Error('验证码参数错误')
            }
        } catch (err) {
            res.send({
                status: 100,
                type: 'ERROR_QUERY',
                message: err.message
            });
        }
        if (cap.toString() !== validCode.toString()) {
            res.send({
                status: -1,
                type: 'ERROR_CAPTCHA',
                message: '验证码不正确'
            });
            return
        }
        const md5pssword = this.encryption(password);
        try {
            let user = await UserModel.findUser(account);
            if (user.length > 0) {
                throw new Error('用户名已存在');
            } else {
                let checkEmail = await UserModel.findUser(email, 0); //保证邮箱的唯一性
                if (checkEmail.length > 0) {
                    throw new Error('邮箱已被注册');
                } else {
                    await UserModel.addUser(account, md5pssword, nickname, email, tokenTime, randomString);
                    /*发送验证邮箱*/
                    res.send({
                        status: 200,
                        type: 'SUCCESS_REGISTER',
                        message: '注册成功',
                        data: {
                            account: account
                        }
                    });
                    //0 代表邮箱激活 1 代表找回密码
                    sendEmail.send(0, account, randomString, email);
                }
            }
        } catch (err) {
            res.send({
                status: -1,
                type: 'ERROR_SERVER',
                message: err.message
            })
        }
    };

    async login(req, res, next) {
        const {account, password} = req.query;
        try {
            if (!account)
                throw new Error('参数错误');
            else if (!password)
                throw  new Error('参数错误');
        } catch (err) {
            console.log('登录参数错误', err);
            res.send({
                status: 100,
                type: 'ERROR_QUERY',
                message: err.message
            });
            return
        }
        try {
            const newmd5password = this.encryption(password);
            let queryPassword = await UserModel.findUser(account);
            if (queryPassword.length > 0) {
                if (newmd5password.toString() !== queryPassword[0].password.toString()) {
                    res.send({
                        status: -1,
                        type: 'ERROR_LOGIN',
                        message: '账号和密码不匹配'
                    });
                    return;
                } else if (!parseInt(queryPassword[0].status)) {
                    res.send({
                        status: 300,
                        account: queryPassword[0].username,
                        type: 'ERROR_LOGIN',
                        message: '账号未激活'
                    });
                    return;
                } else {
                    req.session.userId = queryPassword[0].u_id;
                    res.send({
                        status: 200,
                        type: 'SUCCESS_LOGIN',
                        data: {
                            userId: queryPassword[0].u_id,
                            header: queryPassword[0].header,
                        },
                        message: '登录成功'
                    });
                }
            } else {
                throw new Error('账号不存在');
            }
        } catch (err) {
            res.send({
                status: 500,
                type: 'ERROR_SERVER',
                message: err.message
            })
        }
    };

    async activeAccount(req, res, next) {
        const {email, code} = {
            email: req.query.email,
            code: req.query.code
        };
        try {
            if (!email) {
                throw new Error('参数错误');
            } else if (!code) {
                throw  new Error('参数错误');
            }
        } catch (err) {
            res.send({
                code: 100,
                type: 'ERROR_QUERY',
                message: '参数错误'
            });
            return
        }
        try {
            let result = await UserModel.findUser(email, 0);
            if (result[0].randomString.toString() !== code) {
                throw new Error('验证码错误');
            } else if (result[0].status) {
                throw new Error('账号已激活,请登录');
            } else if (!result.status && result[0].randomString.toString() === code) {
                await UserModel.updateStatus(result[0].username);
                res.send({
                    status: 200,
                    code: 2,
                    type: 'SUCCESS_UPDATE',
                    message: '激活成功'
                })
            }
        } catch (err) {
            res.send({
                status: -1,
                type: 'ERROR_USER',
                message: err.message
            })
        }
    };

    async updateEmailCode(req, res, next) {
        const account = req.query.account;
        try {
            if (!account) {
                throw new Error('参数错误')
            }
        } catch (err) {
            res.send({
                status: 100,
                type: 'ERROR_QUERY',
                message: err.message
            });
        }
        try {
            let user = await UserModel.findUser(account);
            if (user.length > 0) {
                /* 没有被激活 */
                if (!user[0].status) {
                    await UserModel.updateEmailCode(user[0].email, this.randomString());
                    let rs = await UserModel.findUser(user[0].username);
                    await sendEmail.send(0, rs[0].username, rs[0].randomString, rs[0].email);
                    res.send({
                        status: 200,
                        type: 'ok',
                        message: '发送成功，请前往邮箱激活！'
                    });
                } else {
                    throw new Error('用户账号已激活，请直接登录');
                }
            } else {
                throw  new Error('用户名不存在');
            }
        } catch (err) {
            res.send({
                status: -1,
                type: 'ERROR_HAS_SEXIST',
                message: err.message
            });
        }
    };

    async findPass(req, res, next) {
        const cap = req.cookies.cap;
        if (!cap) {
            console.log('验证码失效');
            res.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码失效'
            });
            return
        }
        const {email, code} = {email: req.query.email, code: req.query.validCode};
        try {
            if (!email) {
                throw new Error('参数错误');
            } else if (!code) {
                throw  new Error('参数错误');
            }
        } catch (err) {
            res.send({
                status: 0,
                type: 'ERROR_PARAMETER',
                message: err.message
            });
        }
        if (code.toString() !== cap.toString()) {
            res.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码不正确'
            });
            return
        }
        try {
            let checkEmail = await UserModel.findUser(email, 0); //查找邮箱是否存在
            if (checkEmail.length > 0) {
                await UserModel.updateEmailCode(email, this.randomString()); //更新下随机码
                let rs = await UserModel.findUser(email, 0); //更新了随机码 再次查询一次
                await sendEmail.send(1, rs[0].username, rs[0].randomString, email);
                res.send({
                    status: 200,
                    message: '发送成功,请前往邮箱激活'
                });
            } else {
                res.send({
                    status: 0,
                    type: 'ERROR_EMAIL',
                    message: '邮箱未注册'
                });
            }
        } catch (err) {
            res.send({
                status: 0,
                type: 'ERROR_SERVER',
                message: err.message
            });
        }

    }

    async updatePass(req, res, next) {
        const {email, password, code} = {
            email: req.query.email,
            password: req.query.password,
            code: req.query.code
        };
        try {
            if (!password) {
                throw new Error('参数错误');
            } else if (!code) {
                throw  new Error('参数错误');
            } else if (!email) {
                throw  new Error('参数错误');
            }
            let newmd5password = this.encryption(password);
            let result = await UserModel.findUser(email, 0);
            if (result.length > 0 && result[0].randomString === code.toString()) {
                await UserModel.updatePass(email, newmd5password);
                res.send({
                    status: 200,
                    type: 'SUCCESS_UPDATE',
                    message: '修改成功'
                });
            } else {
                throw new Error('验证码和账号不匹配，请重新打开链接');
            }
        } catch (err) {
            res.send({
                status: 300,
                type: 'ERROR_PARAMETER',
                message: err.message
            });
        }
    };

    encryption(password) {
        const newpassword = this.Md5(this.Md5(password).sub(2, 7) + this.Md5(password));
        return newpassword
    };

    Md5(password) {
        const md5 = crypto.createHash('md5');
        return md5.update(password).digest('base64');
    };

    // 随机字符串
    randomString(len) {
        len = len || 32;
        let $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
        /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
        let maxPos = $chars.length;
        let pwd = '';
        for (let i = 0; i < len; i++) {
            pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
        }
        return pwd;
    }
}
module.exports = new Admin();