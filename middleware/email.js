/**
 * Created by Administrator on 2017/9/18.
 */
import nodemailer from 'nodemailer';
class email {
    constructor() {
        this.account = '';
        this.randomString = '';
        this.email = '';

        this.subject = '';
        this.text = '';
        this.html = '';
    }

    send(code, account, randomString, email) {
        /* 0 激活重新发送邮箱验证码 */
        switch (code) {
            case 0:
                this.account = account;
                this.randomString = randomString;
                this.email = email;
                this.subject = '江湖邮件';
                this.text = '激活账号';
                this.html = `<h3><a href=http://172.16.0.61:8000/active?a=${this.account}&b=${this.randomString}>点击链接进入激活页面</a></h3>`;
                break;
            case 1:
                this.account = account;
                this.randomString = randomString;
                this.email = email;
                this.subject = '江湖邮件';
                this.text = '找回密码';
                this.html = `<h3><a href=http://172.16.0.61:8000/active?a=${this.account}&b=${this.randomString}>点击重置密码</a></h3>`;
                break;
        }
// Generate test SMTP service account from ethereal.email
// Only needed if you don't have a real mail account for testing
        return new Promise((resolve, reject) => {
            nodemailer.createTestAccount((err, account) => {
                // create reusable transporter object using the default SMTP transport
                let transporter = nodemailer.createTransport({
                    host: 'smtp.qq.com',
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: '2623803589@qq.com', // generated ethereal user
                        pass: 'dfelrxywmktcdicg'  // generated ethereal password
                    }
                });

                // setup email data with unicode symbols
                let mailOptions = {
                    from: '2623803589@qq.com', // sender address
                    to: this.email, // list of receivers
                    subject: this.subject, // Subject line
                    text: this.text, // plain text body
                    html: this.html // html body
                };

                // send mail with defined transport object
                transporter.sendMail(mailOptions, (error, info) => {
                    if (error) {
                        reject(error)
                    } else {
                        resolve(true)
                    }

                    // console.log('Message sent: %s', info.messageId);
                    // Preview only available when sending through an Ethereal account
                    // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
                    // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
                    // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
                });

            });
        });

    }
}
module.exports = new email();