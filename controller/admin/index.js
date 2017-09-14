/**
 * Created by Administrator on 2017/9/6.
 */
/* const formidable = require('formidable') */
const Common = require('../component/common')
class Admin extends Common {
  constructor () {
    super()
    this.encryption = this.encryption.bind(this)
  }

  register (req, res, next) {
    let cap = req.cookies.cap
    if (!cap) {
      console.log('验证码失效')
      res.send({
        status: 0,
        type: 'ERROR_CAPTCHA',
        message: '验证码失效'
      })
      return
    }
    const {account, nickname, email, password, validCode} =
      {
        account: req.query.account,
        nickname: req.query.nickname,
        email: req.query.email,
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
        status: 0,
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
      })
      return
    }
    const md5pssword = this.encryption(password);
    console.log(md5pssword);
  }
}
module.exports = new Admin()