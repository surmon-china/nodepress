/* email */

const config = require('np-config');
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');
let clientIsValid = false;

const transporter = nodemailer.createTransport(smtpTransport({
  host: 'smtp.qq.com',
  secure: true,
  port: 465,
  auth: {
    user: config.EMAIL.account,
    pass: config.EMAIL.password
  }
}));

const verifyClient = () => {
  transporter.verify((error, success) => {
    if (error) {
      clientIsValid = false;
      console.warn('邮件客户端初始化连接失败，将在一小时后重试');
      setTimeout(verifyClient, 1000 * 60 * 60);
    } else {
      clientIsValid = true;
      console.log('邮件客户端初始化连接成功，随时可发送邮件');
    }
  });
};

const sendMail = mailOptions => {
  if (!clientIsValid) {
    console.warn('由于未初始化成功，邮件客户端发送被拒绝');
    return false;
  }
  mailOptions.from = '"Surmon" <admin@surmon.me>'
	transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.warn('邮件发送失败', error);
    console.log('邮件发送成功', info.messageId, info.response);
  });
};

exports.sendMail = sendMail;
exports.nodemailer = nodemailer;
exports.transporter = transporter;
