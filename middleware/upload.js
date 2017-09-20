import qiniu from 'qiniu';

class upload {
    constructor() {
        this.AccessKey = 'm9BkY1-Tx10lFAtzbu8rlXt3FfC0LHsGSNqaByo6';
        this.SecretKey = '3K-8B9PmFoO_ovB3z6Li_pU7BoIVUrYVzrIUl8rf';
        this.mac = new qiniu.auth.digest.Mac(this.accessKey, this.secretKey); // 定义好授权对象
        // 最简单的上传凭证只需要AccessKey，SecretKey和Bucket就可以。
        /*覆盖上传除了需要简单上传所需要的信息之外，还需要想进行覆盖的文件名称，这个文件名称同时可是客户端上传代码中指定的文件名，两者必须一致
        *   scope: bucket + ":" + keyToOverwrite
        *   上面生成的自定义上传回复的上传凭证适用于上传端（无论是客户端还是服务端）和七牛服务器之间进行直接交互的情况下
        *     callbackUrl: 'http://api.example.com/qiniu/upload/callback',
        * */
        this.options = {
            scope: 'hujindong' //要上传的空间
            //自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
            //expires: 7200
        }
    }

    getToken(req, res, next) {
        var AccessKey = 'm9BkY1-Tx10lFAtzbu8rlXt3FfC0LHsGSNqaByo6';
        var SecretKey = '3K-8B9PmFoO_ovB3z6Li_pU7BoIVUrYVzrIUl8rf';
        var mac = new qiniu.auth.digest.Mac(AccessKey, SecretKey);
        var options = {
            scope: 'hujindong' //要上传的空间
            //自定义凭证有效期（示例2小时，expires单位为秒，为上传凭证的有效时间）
            //expires: 7200
        };

        var putPolicy = new qiniu.rs.PutPolicy(options);
        var ploadToken = putPolicy.uploadToken(mac);
        res.send({
            code: 200,
            ploadToken: ploadToken
        })

    }
}
module.exports = new upload();