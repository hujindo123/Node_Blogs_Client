/**
 * Created by Administrator on 2017/9/18.
 */
import nodemailer from 'nodemailer';
class email {
    constructor() {

    }

    send() {
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
                    to: '2623803589@qq.com', // list of receivers
                    subject: 'Hello ✔', // Subject line
                    text: 'Hello world?', // plain text body
                    html: '<b>Hello world?</b>' // html body
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