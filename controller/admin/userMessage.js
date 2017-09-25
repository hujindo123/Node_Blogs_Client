/**
 * Created by Administrator on 2017/9/25.
 */
import UserModel from '../../Model/User';
class userMessage {
    constructor() {
        this.getUserMessage = this.getUserMessage.bind(this);
    }

    async getUserMessage(req, res, next) {
        const userId = req.query.userId;
        let result = await UserModel.findUser(userId, 1);
        try {
            res.send({
                status: 0,
                type: 'QUERY_SUCCSEE',
                data: {
                    username: result[0].username,
                    email: result[0].email,
                    nickname: result[0].nickname,
                }
            })
        } catch (err) {
            res.send({
                status: 0,
                type: 'QUERY_ERROR',
                message: err.message
            })
        }
    }
}
module.exports = new userMessage();