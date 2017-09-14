/**
 * Created by Administrator on 2017/9/14.
 */
const crypto = require('crypto')
const Common = class Common {
  constructor () {

  }

  encryption (password) {
    const newpassword = this.Md5(this.Md5(password).sub(2, 7) + this.Md5(password))
    return newpassword
  }

  Md5 (password) {
    const md5 = crypto.createHash('md5')
    return md5.update(password).digest('base64')
  }
}
export default Common