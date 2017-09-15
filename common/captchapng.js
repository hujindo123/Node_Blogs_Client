/**
 * Created by Administrator on 2017/9/13.
 */
import captchapng from 'captchapng'
class Captchas {
  constructor () {

  };

  getCaptchas (req, res, next) {
    let cap = parseInt(Math.random() * 9000 + 1000)
    let p = new captchapng(80, 38, cap) // width,height,numeric captcha
    p.color(0, 0, 0, 0)  // First color: background (red, green, blue, alpha)
    p.color(255, 215, 72, 255)// Second color: paint (red, green, blue, alpha)
    var img = p.getBase64()
    var imgbase64 = new Buffer(img, 'base64')
    res.cookie('cap', cap, {maxAge: 300000, httpOnly: true})
    res.send({
      code: 200,
      data: `data:image/png;base64,${img}`
    })
  };
}
module.exports = new Captchas()