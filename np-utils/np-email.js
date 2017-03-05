
const nodemailer = require('nodemailer');
const smtpTransport = require('nodemailer-smtp-transport');

const transporter = nodemailer.createTransport(smtpTransport({
  host: 'smtp.qq.com',
  secure: true,
  port: 465,
  auth: {
    user: 'admin@surmon.me',
    pass: 'uevsuvkjucukbfga'
  }
}));

const sendMail = mailOptions => {
  mailOptions.from = '"Surmon" <admin@surmon.me>'
	transporter.sendMail(mailOptions, (error, info) => {
    if (error) return console.log('邮件发送失败', error);
    console.log('邮件发送成功', info.messageId, info.response);
  });
};

exports.sendMail = sendMail;
exports.nodemailer = nodemailer;
exports.transporter = transporter;
