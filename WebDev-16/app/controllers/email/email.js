const nodemailer = require('nodemailer');


const transporter = nodemailer.createTransport({
    host: 'smtp.qq.com', //QQ邮箱的服务器
    port: 465, //端口号
    secure: true, //465为true,其他为false
    auth: {
        user: '916049678@qq.com', // 自己的邮箱
        pass: 'pfyinmeecktzbaij', // 授权码
    },
});

/**
 * 注册用户时发送邮箱
 */
 exports.sendRegisterEmail = ({email, verify_key}) => {
    const url = `http://localhost:3000/regiter_success?email=${email}&verify_key=${verify_key}`;
    const params = {
        from: 'WebDev16<916049678@qq.com>', // 收件人显示的发件人信息
        to: email, // 目标邮箱号
        subject: 'User register',
        html: `Click the link to register:<a style="color:red" href="${url}">${url}</a>`,
    };
    return sendMsg(params);
};

exports.sendResetPwd = ({email}) => {
    const url = `http://localhost:8080/#/user?email=${email}`;
    const params = {
        from: 'WebDev16<916049678@qq.com>', // 收件人显示的发件人信息
        to: email, // 目标邮箱号
        subject: 'Reset password',
        html: `Click the link to reset password:<a style="color:red" href="${url}">${url}</a>`,
    };
    return sendMsg(params);
};

/**
 * 找回密码时发送校验码
 * @param {*} params
 */
exports.sendCode = ({email, verify_key}) => {
    const params = {
        from: '梁朝伟<xxxxxxxx@qq.com>', // 收件人显示的发件人信息
        to: email, // 目标邮箱号
        subject: '找回密码',
        html: `邮箱验证码:${verify_key}`,
    };
    return sendMsg(params);
};


/**
 * 发送消息
 */
const sendMsg = (params) => {
    return new Promise((resolve) => {
        transporter.sendMail(params, (err, data) => {
            resolve(null);
            transporter.close(); //发送完毕后关闭
        });
    });
};