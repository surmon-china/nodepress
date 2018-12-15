/**
 * Akismet spam module.
 * @file akismet-spam 反垃圾
 * @module utils/akismet
 * @author Surmon <https://github.com/surmon-china>
 */

const console = require('console')
const CONFIG = require('app.config')
const akismet = require('akismet-api')

let clientIsValid = false

const client = akismet.client({
  key: CONFIG.AKISMET.key,
  blog: CONFIG.AKISMET.blog
})

// check key
client.verifyKey().then(valid => {
  clientIsValid = valid
  if (valid) {
    console.ready(`Akismet key 有效，已准备好工作!`)
  } else {
    console.warn(`Akismet key 无效，无法工作!`)
  }
}).catch(err => {
  console.warn('Akismet VerifyKey Error:', err.message)
})

// check spam
const checkSpam = comment => {
  console.info('Akismet 验证评论中...', new Date())
  return new Promise((resolve, reject) => {
    if (clientIsValid) {
      client.checkSpam(comment).then(spam => {
        if (spam) {
          console.warn('Akismet 验证不通过!', new Date())
          return reject(new Error('spam!'))
        } else {
          console.info('Akismet 验证通过', new Date())
          return resolve(spam)
        }
      }).catch(err => {
        return resolve(err)
      })
    } else {
      console.warn('Akismet key 未认证，放弃验证')
      return resolve('akismet key Invalid!')
    }
  })
}

// submit Interceptor
const handleCommentInterceptor = handle_type => {
  return comment => {
    if (clientIsValid) {
      console.info(`Akismet ${handle_type}...`, new Date())
      client[handle_type](comment).then(result => {
        console.info(`Akismet ${handle_type} success!`)
      }).catch(err => {
        console.warn(`Akismet ${handle_type} failed!`, err)
      })
    } else {
      console.warn('Akismet key Invalid!')
    }
  }
}

// akismet client
const akismetClient = {

  // check spam
  checkSpam,

  // submit spam
  submitSpam: handleCommentInterceptor('submitSpam'),

  // submit ham
  submitHam: handleCommentInterceptor('submitHam')
}

exports.akismet = akismet
exports.akismetClient = akismetClient
