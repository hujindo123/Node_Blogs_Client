var qiniu = require("qiniu");
import formidable from 'formidable';
import fs from 'fs';

class upload {
    constructor() {
        this.AccessKey = 'm9BkY1-Tx10lFAtzbu8rlXt3FfC0LHsGSNqaByo6';
        this.SecretKey = '3K-8B9PmFoO_ovB3z6Li_pU7BoIVUrYVzrIUl8rf';
        this.getQiNiuTokens = this.getQiNiuTokens.bind(this);
    }

    getQinNuToken(req, res, next) {
        /*  var AccessKey = 'm9BkY1-Tx10lFAtzbu8rlXt3FfC0LHsGSNqaByo6';
         var SecretKey = '3K-8B9PmFoO_ovB3z6Li_pU7BoIVUrYVzrIUl8rf';*/
        const imgName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16);
        var key = 123;
        //let putPolicy = new qiniu.rs.PutPolicy('hujindong' + ":" + imgName);
        var uploadToken = this.putPolicy.uploadToken(this.mac);
        var config = new qiniu.conf.Config();
        // 空间对应的机房
        config.zone = qiniu.zone.Zone_z1;
        var formUploader = new qiniu.form_up.FormUploader(config);
        var putExtra = new qiniu.form_up.PutExtra();

        const form = formidable.IncomingForm();
        form.parse(req, (err, fields, files) => {
            if (err) {
                throw err;
            }
            var localFile = 'D:\\Documents\Tencent Files\\605548934\\MyCollection\\Image\\434B2CE3-6FAE-4B8C-9000-35442F2E8A53.png';
            console.log(fields.file);
            formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr, respBody, respInfo) {
                if (respErr) {
                    throw respErr;
                }
                if (respInfo.statusCode === 200) {
                    console.log(respBody);
                } else {
                    console.log(respInfo.statusCode);
                    console.log(respBody);
                }
            });
            //console.log(putPolicy);
        });
        ;
        // 是否使用https域名
        //config.useHttpsDomain = true;
        // 上传是否使用cdn加速
        //config.useCdnDomain = true;

        /*   if (new Date().getTime() / 1000 >= this.expires) {
               let ploadToken = putPolicy.uploadToken(mac);
               console.log(ploadToken);
               req.session.qiniuToken = ploadToken;
               let msg = JSON.parse(new Buffer(ploadToken.split(':')[2], 'base64').toString());
               this.expires = msg.deadline;
           }
           next();*/
    }

    async getQiNiuTokens(req, res, next) {
//需要填写你的 Access Key 和 Secret Key
        qiniu.conf.ACCESS_KEY = 'm9BkY1-Tx10lFAtzbu8rlXt3FfC0LHsGSNqaByo6';
        qiniu.conf.SECRET_KEY = '3K-8B9PmFoO_ovB3z6Li_pU7BoIVUrYVzrIUl8rf';
//要上传的空间
        let bucket = 'hujindong';
//上传到七牛后保存的文件名
        let key = 'my-nodejs-logo';
//生成上传 Token
        let token = await this.uptoken(bucket, key);
//要上传文件的本地路径
        let filePath = './logo.png'

        this.uploadFile(token, key, filePath);
    }
    //构建上传策略函数，设置回调的url以及需要回调给业务服务器的数据
    uptoken(bucket, key){
        console.log(bucket, key)
        return new Promise((resolve, reject)=>{
            var putPolicy = new qiniu.rs.PutPolicy(bucket + ":" + key);
            resolve(putPolicy.token());
            reject(Error);
        });

    };
    //构造上传函数
    uploadFile(uptoken, key, localFile){
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(uptoken, key, localFile, extra, function (err, ret) {
            if (!err) {
                // 上传成功， 处理返回值
                console.log(ret.hash, ret.key, ret.persistentId);
            } else {
                // 上传失败， 处理返回代码
                console.log(err);
            }
        });
    }
}

module.exports = new upload();