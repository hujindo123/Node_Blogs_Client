import qiniu from 'qiniu'
import formidable from 'formidable';
import fs from 'fs';
import UserModel from '../Model/User';
qiniu.conf.ACCESS_KEY = 'm9BkY1-Tx10lFAtzbu8rlXt3FfC0LHsGSNqaByo6';
qiniu.conf.SECRET_KEY = '3K-8B9PmFoO_ovB3z6Li_pU7BoIVUrYVzrIUl8rf';

class uploadImg {
    constructor() {
        this.uploadHeader = this.uploadHeader.bind(this);
        this.getToken = this.getToken.bind(this);
        this.uploadFile = this.uploadFile.bind(this);
    }

    async uploadHeader(req, res, next) {
        return new Promise((resolve, reject) => {
            const bucket = 'hujindong';
            //要上传文件的本地路径
            const form = formidable.IncomingForm();
            form.parse(req, async (err, fields, files) => {
                try {
                    if(Number(fields.userId) !== req.session.userId){
                        res.send({
                            status: -1,
                            type: 'ERROR_SESSION',
                            message: '亲，您还没有登录',
                        });
                        return
                    }
                    //上传到七牛后保存的文件名
                    const key = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16) + req.session.userId;
                    const path = 'img/' + key + '.png'; //缓存到服务器的图片名和路径
                    //获取token
                    const token = await this.getToken(bucket, key);
                    await fs.writeFile(path, new Buffer(fields.file, 'base64'));
                    //上传文件
                    const qiniuImg = await this.uploadFile(token, key, path);
                    await UserModel.uploadHeader(qiniuImg, req.session.userId);
                    res.send({
                        status: 0,
                        type: 'UPLOAD_SUCCESS',
                        message: '修改头像成功'
                    })
                } catch (err) {
                    res.send({
                        status: 0,
                        type: 'UPLOAD_ERROR',
                        message: err.message
                    })
                }
            })
        });


    }

    async getToken(bucket, key) {
        //得到token
        let putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
        return await putPolicy.token();
    }

    //构造上传函数
    uploadFile(uptoken, key, localFile) {
        return new Promise((resolve, reject) => {
            let extra = new qiniu.io.PutExtra();
            qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
                fs.unlink(localFile); //清除服务器临时文件
                if (!err) {
                    resolve(ret.key)
                } else {
                    console.log('图片上传至七牛失败', err);
                    reject(err)
                }
            });
        });


    }
}

module.exports = new uploadImg();