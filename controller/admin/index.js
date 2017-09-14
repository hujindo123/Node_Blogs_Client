/**
 * Created by Administrator on 2017/9/6.
 */
class Admin {
    constructor() {

    }

    register(req, res, next) {
        console.log(req.query.username);
        res.send({
            code: 200,
            msg: 'success'
        })
    }
}
module.exports = new Admin();