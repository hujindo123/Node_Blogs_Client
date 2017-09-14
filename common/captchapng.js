/**
 * Created by Administrator on 2017/9/13.
 */
const captchapng = require('captchapng')
class Captchas {
  constructor () {

  }

  getCaptchas (req, res, next) {
    console.log(111);
    const cap = new captchapng(80, 38, parseInt(Math.random() * 9000 + 1000)) // width,height,numeric captcha
    cap.color(0, 0, 0, 0)  // First color: background (red, green, blue, alpha)
    cap.color(255, 215, 72, 255);// Second color: paint (red, green, blue, alpha)
    var img = cap.getBase64();
    var imgbase64 = new Buffer(img, 'base64');
  /*  res.cookie('cap', cap, {maxAge: 300000, httpOnly: true});*/
    res.send({
      status: 200,
      data: `data:image/png;base64,${img}`
    })
  }
}
module.exports = new Captchas()