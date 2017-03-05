
let akismet = require('akismet-api');
let client = akismet.client({
  key: '95af4bb98b97',
  blog: 'https://surmon.me'
});
let clientIsValid = false

// 验证key
client.verifyKey((err, valid) => {
  if (err) return console.log('Akismet VerifyKey Error:', err.message);
  clientIsValid = valid;
  console.log(`Akismet ${ valid ? 'Valid' : 'Invalid' } key!`);
});

const akismetClient = {
  checkSpam(options) {
    return new Promise((resolve, solve) => {
      if (clientIsValid) {
        client.checkSpam(options, (err, spam) => {
          if (err) return solve(err);
          if (spam) {
            console.log('这是一条 Spam!');
            return solve(spam);
          } else {
            console.log('这不是一条 Spam');
            return resolve(spam);
          }
        });
      } else {
        return solve();
      }
    })
  },
  submitSpam(options, callback) {},
  submitHam(options, callback) {}
};

exports.akismet = akismet;
exports.akismetClient = akismetClient;
