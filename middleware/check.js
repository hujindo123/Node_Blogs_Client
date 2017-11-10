/**
 * Created by Administrator on 2017/9/6.
 */
class Check {
    constructor() {

    };

    async checkAdmin(req, res, next) {
        const admin_id = req.session.userId;
        const s_id = req.query.userId || req.body.userId;
        console.log(req);
        if (!admin_id || !Number(admin_id)) {
            res.send({
                status: 0,
                type: 'ERROR_SESSION',
                message: '亲，您还没有登录',
            });
            return
        } else if (Number(s_id) !== admin_id) {
            res.send({
                status: 0,
                type: 'HAS_NO_ACCESS',
                message: '权限不足',
            });
            return
        }
        next()
    }
    ;
}
module.exports = new Check();