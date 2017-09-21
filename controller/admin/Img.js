/**
 * Created by Administrator on 2017/9/21.
 */
//import request from 'request';
import  qiniu from 'qiniu';
class AA {
    constructor() {

    }

    updateImg(req, res, next) {
        /*
         * Math.ceil()向上取整
         * Math.random()随机数0-1之间 0.1255555555545547
         * toString(16) 转成16进制
         * */
        const imgName = (new Date().getTime() + Math.ceil(Math.random() * 10000)).toString(16);

        //构建上传策略函数
        var extra = new qiniu.io.PutExtra();
        qiniu.io.putFile(req.session.qiniuToken, imgName, req.query.pic, extra, function (err, ret) {
            if (!err) {
                // 上传成功， 处理返回值
                console.log(ret.hash, ret.key, ret.persistentId);
            } else {
                // 上传失败， 处理返回代码
                console.log(err);
            }
        });


        /*  console.log(11);
         let uptoken = req.session.qiniuToken;
         let file = req.query.pic;
         var extra = new qiniu.io.PutExtra();
         qiniu.io.putFile(uptoken,  file, extra, function (err, ret) {
         if (!err) {
         // 上传成功， 处理返回值
         console.log(ret.hash,  ret.persistentId);
         } else {
         // 上传失败， 处理返回代码
         console.log(err);
         }
         })*/
    }
}
module.exports = new AA();