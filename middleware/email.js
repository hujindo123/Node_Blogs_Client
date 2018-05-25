/**
 * Created by Administrator on 2017/9/18.
 */
import nodemailer from "nodemailer";
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
                this.html = `<h3><a href=http://localhost:8000/active/${this.email}/${this.randomString}>点击链接进入激活页面</a></h3>`;
                break;
            case 1:
                this.account = account;
                this.randomString = randomString;
                this.email = email;
                this.subject = '江湖邮件';
                this.text = '找回密码';
                this.html = `<h3><a href=http://localhost:8000/updatePass/${this.email}/${this.randomString}>点击重置密码</a></h3>`;
                break;
        }
        return new Promise((resolve, reject) => {
            nodemailer.createTestAccount((err, account) => {
                let transporter = nodemailer.createTransport({
                    host: 'smtp.qq.com',
                    port: 465,
                    secure: true, // true for 465, false for other ports
                    auth: {
                        user: '2623803589@qq.com', // generated ethereal user
                        pass: 'dfelrxywmktcdicg'  // generated ethereal password
                    }
                });
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
                        reject(error.response);
                    }else {
                        resolve(info);
                    }
                });
            });
        });
    }
}
module.exports = new email();