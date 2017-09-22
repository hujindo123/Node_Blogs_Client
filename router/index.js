/**
 * Created by Administrator on 2017/9/6.
 */
const express = require('express');
const router = express.Router();
const Captchas = require('../common/captchapng');
const Admin = require('../controller/admin/index');
const uploadImg = require('../middleware/uploadImg');

router.get('/getCaptchas', Captchas.getCaptchas); // 生成验证码
router.get('/register', Admin.register);
router.get('/login', Admin.login);
router.get('/actives', Admin.activeAccount); // 激活账号
router.get('/updateEmailCode', Admin.updateEmailCode); //再次发送邮箱激活码
router.get('/findPass', Admin.findPass); // 邮箱查找密码
router.get('/updatePass', Admin.updatePass); //修改密码
router.post('/updateImg', uploadImg.uploadHeader);

module.exports = router;