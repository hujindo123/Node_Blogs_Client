/**
 * Created by Administrator on 2017/9/6.
 */
/* const formidable = require('formidable') */
import crypto from 'crypto';
import sendEmail from '../../middleware/email'
import UserModel from '../../Model/User';
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
        const {account, nickname, email, password, validCode, tokenTime, randomString} =
            {
                account: req.query.account,
                nickname: req.query.nickname,
                email: req.query.email,
                password: req.query.password,
                validCode: req.query.validCode,
                tokenTime: new Date().getTime() + 60 * 60 * 24, //过期时间
                randomString: this.randomString()
            };
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
            console.log('登录参数错误', err);
            res.send({
                status: 500,
                type: 'ERROR_QUERY',
                message: err.message
            });
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
            let checkEmail = await UserModel.checkEmail(email); //保证邮箱的唯一性
            if (user) {
                res.send({
                    status: 0,
                    type: 'ERROR_USER_EXIST',
                    message: '用户名已存在'
                });
                return
            } else {
                if (!checkEmail) {
                    let addUser = await UserModel.addUser(account, md5pssword, nickname, email, tokenTime, randomString);
                    if (addUser) {
                        /*发送验证邮箱*/
                        await sendEmail.send(0, account, randomString, email);
                        res.send({
                            status: 200,
                            type: 'SUCCESS_REGISTER',
                            message: '注册成功',
                            data: {
                                account: account
                            }
                        })
                    }
                } else {
                    res.send({
                        status: 0,
                        type: 'ERROR_USER_EXIST',
                        message: '邮箱已被注册'
                    });
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
            console.log('登录参数错误', err);
            res.send({
                status: 0,
                type: 'ERROR_QUERY',
                message: err.message
            })
            return
        }
        const newmd5password = this.encryption(password);
        let queryPassword = await UserModel.findUser(account);
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

    async activeAccount(req, res, next) {
        const {account, code} = {
            account: req.query.account,
            code: req.query.code
        };
        try {
            if (!account) {
                throw new Error('参数错误');
            } else if (!code) {
                throw  new Error('参数错误');
            }
        } catch (err) {
            console.log('参数错误', err);
            res.send({
                code: 0,
                type: 'ERROR_QUERY',
                message: '参数错误'
            });
            return
        }
        let result = await UserModel.queryAccount(account, code);
        if (result && result !== '该账户不存在') {
            if (result[0].status === 0) {
                if (result[0].randomString.toString() === code) {
                    let right = await UserModel.updateStatus(account);
                    if (right) {
                        res.send({
                            status: 200,
                            code: 2,
                            type: 'SUCCESS_UPDATE',
                            message: '激活成功'
                        })
                    }
                } else {
                    res.send({
                        status: 0,
                        type: 'ERROR_CODE',
                        message: '错误的激活码'
                    })
                }
            } else if (result[0].status === 1) {
                res.send({
                    status: 200,
                    code: 1,
                    message: '已激活'
                })
            } else if (result[0].status === -1) {
                res.send({
                    status: 200,
                    code: -1,
                    message: '已过期'
                })
            }
        } else {
            res.send({
                status: 0,
                type: 'ERROR_USER',
                message: result
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
                status: 500,
                type: 'ERROR_QUERY',
                message: err.message
            });
            return
        }
        let user = await UserModel.findUser(account);
        if (!user) {
            res.send({
                status: 0,
                type: 'ERROR_USER_NOT_SEXIST',
                message: '用户名不存在'
            });
            return
        } else {
            try {
                let result = await UserModel.updateEmailCode(0, user[0].username, this.randomString());
                if (result) {
                    await sendEmail.send(0, result.account, result.randomString, user[0].email);
                    res.send({
                        status: 200,
                        message: '发送成功'
                    })
                }
            } catch (err) {
                res.send({
                    status: 0,
                    type: 'ERROR_USER',
                    message: err
                })
            }
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
            console.log('参数错误', err);
            res.send({
                status: 0,
                type: 'ERROR_PARAMETER',
                message: err.message
            });
            return
        }
        if (code.toString() !== cap.toString()) {
            res.send({
                status: 0,
                type: 'ERROR_CAPTCHA',
                message: '验证码不正确'
            });
            return
        }
        let checkEmail = await UserModel.checkEmail(email); //查找邮箱是否存在
        try {
            if (checkEmail) {
                let result = await UserModel.updateEmailCode(1, email, this.randomString());
                if (result) {
                    await sendEmail.send(1, result.account, result.randomString, email);
                    res.send({
                        status: 200,
                        message: '发送成功'
                    })
                }
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
            }
            let newmd5password = this.encryption(password);
            let result = await UserModel.findUser(email, 0);
            if (result) {
                if (result[0].randomString === code.toString()) {
                    if (await UserModel.updatePass(email, newmd5password)) {
                        res.send({
                            status: 200,
                            type: 'SUCCESS_UPDATE',
                            message: '成功'
                        })
                    }
                } else {
                    res.send({
                        status: 0,
                        type: 'ERROR_QUERY',
                        message: '验证码和账号不匹配，请重新进入页面，并打开链接'
                    })
                }
            } else {
                res.send({
                    status: 0,
                    type: 'ERROR_QUERY',
                    message: '用户不存在'
                })
            }
        } catch (err) {
            res.send({
                status: 0,
                type: 'ERROR_PARAMETER',
                message: err.message
            })
            return
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