import qiniu from 'qiniu'
import formidable from 'formidable';
import fs from 'fs';
qiniu.conf.ACCESS_KEY = 'm9BkY1-Tx10lFAtzbu8rlXt3FfC0LHsGSNqaByo6';
qiniu.conf.SECRET_KEY = '3K-8B9PmFoO_ovB3z6Li_pU7BoIVUrYVzrIUl8rf';

class uploadImg {
    constructor() {
        this.uploadHeader = this.uploadHeader.bind(this);
        this.readFiles = this.readFiles.bind(this);
    }

    async uploadHeader(req, res, next) {
        console.log(req.session.userId);
        let dataBuffer = '';
        const bucket = 'hujindong';
        //要上传文件的本地路径
        const form = formidable.IncomingForm();
        await form.parse(req, (err, fields, files) => {
            dataBuffer = new Buffer(fields.file, 'base64');
        });
        this.readFiles(dataBuffer, bucket, req, res);
        //要上传的空间
    }

    readFiles(dataBuffer, bucket, req, res) {
        try {
            //上传到七牛后保存的文件名
            let key = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16);
            let path = 'img/' + key + '.png'; //缓存到服务器的图片名和路径
            fs.writeFile(path, dataBuffer);
            console.log('写入成功！');
            //得到token
            let putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
            let token = putPolicy.token();
            //上传文件
            this.uploadFile(token, key, path, req, res);
        } catch (err) {
            console.log(err);
        }
    }

    //构造上传函数
    uploadFile(uptoken, key, localFile, req, res) {
        let extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
            if (!err) {
                // 上传成功， 处理返回值
                console.log(ret.hash, ret.key, ret.persistentId);
                console.log(req.session.u_id);
                fs.unlink(localFile); //清除服务器临时文件
            } else {
                // 上传失败， 处理返回代码
                console.log(err);
            }
        });

    }
}

module.exports = new uploadImg();