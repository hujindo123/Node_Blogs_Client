/**
 * Created by Administrator on 2017/9/13.
 */
import http from "http";

var fs = require('fs');
var path = require('path');
var request = require('request');
var FormData = require('form-data');
var moment = require('moment');
var querystring = require('querystring');
var now = moment();

class test {
    constructor() {

    };

    testSend(req, res, next) {
        for (var i = 0; i < 0; i++) {
            console.log(i);
            var r = request.post('http://192.168.160.168:8080/brt_face/a/core/singlePictureSearchApi/receive', function (error, response, body) {
                console.log(now.format());
            });
            var form = r.form();
            form.append('deviceId', 'A00001');
            form.append('appStamp', Date.now());
            form.append('images', fs.createReadStream(path.join(__dirname, 'img/leon'+i+'.jpg')));
        }
    };
}

module.exports = new test();