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
        const result = await UserModel.findUser(userId, 1);
        console.log(result);
        try {
            res.send({
                status: 200,
                type: 'QUERY_SUCCSEE',
                data: {
                    username: result[0].username,
                    email: result[0].email,
                    nickname: result[0].nickname,
                    sex: result[0].sex,
                    birthday: result[0].birthday,
                    area: [result[0].province, result[0].city, result[0].area]
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