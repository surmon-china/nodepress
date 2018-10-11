/**
 * Email module.
 * @file email 模块
 * @module utils/email
 * @author Surmon <https://github.com/surmon-china>
 */

const consola = require('consola')
const config = require('app.config')
const nodemailer = require('nodemailer')

let clientIsValid = false

const transporter = nodemailer.createTransport({
	host: 'smtp.qq.com',
	secure: true,
	port: 465,
	auth: {
		user: config.EMAIL.account,
		pass: config.EMAIL.password
	}
})

const verifyClient = () => {
	transporter.verify((error, success) => {
		if (error) {
			clientIsValid = false
			consola.warn('邮件客户端初始化连接失败，将在一小时后重试')
			setTimeout(verifyClient, 1000 * 60 * 60)
		} else {
			clientIsValid = true
			consola.info('邮件客户端初始化连接成功，随时可发送邮件')
		}
	})
}

verifyClient()

const sendMail = mailOptions => {
	if (!clientIsValid) {
		consola.warn('由于未初始化成功，邮件客户端发送被拒绝')
		return false
	}
	mailOptions.from = config.EMAIL.from
	transporter.sendMail(mailOptions, (error, info) => {
		if (error) {
			consola.warn('邮件发送失败', error)
		} else {
			consola.info('邮件发送成功', info.messageId, info.response)
		}
	})
}

exports.sendMail = sendMail
exports.nodemailer = nodemailer
exports.transporter = transporter
