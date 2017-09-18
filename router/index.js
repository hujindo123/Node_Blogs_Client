/**
 * Created by Administrator on 2017/9/6.
 */
const express = require('express');
const router = express.Router();
const Captchas = require('../common/captchapng');
const Admin = require('../controller/admin/index');

router.get('/getCaptchas', Captchas.getCaptchas);
router.get('/register', Admin.register);
router.get('/login', Admin.login);
router.get('/sendEmail', Admin.sendEmail);
router.get('/actives', Admin.activeAccount);

module.exports = router;