/**
 * Created by Administrator on 2017/9/25.
 */
import UserModel from '../../Model/User';

class userMessage {
    constructor() {
        this.getUserMessage = this.getUserMessage.bind(this);
        this.updateUserMessage = this.updateUserMessage.bind(this);
    }

    /* 返回用户信息*/
    async getUserMessage(req, res, next) {
        try {
            const userId = req.query.userId;
            const result = await UserModel.findUser(userId, 1);
            res.send({
                status: 200,
                type: 'QUERY_SUCCSEE',
                data: {
                    username: result[0].username,
                    email: result[0].email,
                    nickname: result[0].nickname,
                    sex: result[0].sex,
                    birthday: result[0].birthday,
                    header:  result[0].header,
                    province: result[0].province,
                    city: result[0].city,
                    area: result[0].area
                }
            })
        } catch (err) {
            res.send({
                status: 0,
                type: 'QUERY_ERROR',
                message: err.message
            })
        }
    };

    /*修改用户信息*/
    async updateUserMessage(req, res, next) {
        try {
            const {nickname, sex, birthday, province, city, area} = {
                nickname: req.query.nickname,
                sex: req.query.sex,
                birthday: req.query.birthday,
                province: req.query.province,
                city: req.query.city,
                area: req.query.area
            };
            if (!nickname) {
                throw new Error('昵称参数错误');
            } else if (!sex) {
                throw new Error('性别参数错误');
            } else if (!birthday) {
                throw new Error('生日参数错误');
            } else if (!province) {
                throw new Error('省份参数错误');
            } else if (!city) {
                throw new Error('城市参数错误');
            } else if (!area) {
                throw new Error('地区参数错误');
            }
            await UserModel.updateUserMessage(nickname, sex, birthday, province, city, area, req.session.userId);
            res.send({
                status: 200,
                type: 'UPDATE_SUCCSEE',
                message: '修改成功'
            })
        } catch (err) {
            res.send({
                status: 0,
                type: 'UPDATE_ERROR',
                message: err.message
            })
        }
    };
}

module.exports = new userMessage();