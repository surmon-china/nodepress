/*
*
* 多说同步
*
*/

const { handleError, handleSuccess } = require('np-utils/np-handle');

const Article = require('np-model/article.model');
const Comment = require('np-model/comment.model');
const request = require('request');

module.exports = (req, res) => {
  request.get({
    url: `http://api.duoshuo.com/log/list.json?short_name=surmon&secret=a33d5f59d15aab435dac1426b6e1fe03`
  }, (err, response, body) => {
    if (err) {
      console.error('评论请求失败');
      handleError({ res, err, message: '评论请求失败' });
      return false;
    }
    body = JSON.parse(body);
    console.log(body);
    if (!Object.is(body.code, 0)) {
      console.error('评论请求无效code 1');
      handleError({ res, message: '评论请求无效code 1' });
      return false;
    }
    console.log('评论请求成功');
    const delete_ids = body.response.filter(comment => {
      return Object.is(comment.action, 'delete')
    }).map(comment => {
      return comment.meta[0]
    });
    const duoshuo_comments = body.response.filter(comment => {
      return Object.is(comment.action, 'create') && 
             Object.is(comment.meta.status, 'approved') &&
             !!comment.meta.author_email &&
             !delete_ids.includes(comment.meta.post_id) &&
             !comment.meta.message.includes('业转载请联系作者获得授权')
    }).map(comment => {
      if (Object.is(comment.meta.thread_key, 'guestbook')) {
        comment.meta.thread_key = 0;
      } else {
        comment.meta.thread_key = Number(comment.meta.thread_key);
      }
      const new_comment = {
        pid: 0,
        post_id: comment.meta.thread_key,
        content: comment.meta.message,
        ip: comment.meta.ip,
        agent: comment.meta.agent,
        state: 1,
        create_at: new Date(comment.meta.created_at),
        author: {
          name: comment.meta.author_name,
          email: comment.meta.author_email
        }
      }

      if (!!comment.meta.author_url) {
        new_comment.author.site = comment.meta.author_url
      }
      return new_comment
    });

    duoshuo_comments.forEach(comment => {
      new Comment(comment).save()
      .then(data => {
        console.warn('保存成功', data)
      })
      .catch(err => {
        console.warn('保存失败', comment.content)
      })
    })
    handleSuccess({ res, result: duoshuo_comments, message: '同步成功' });

    // Comment.dropIndexes();
    /*
    Comment.insertMany(duoshuo_comments)
    .then(function(docs) {
      console.info('同步成功', docs.length);
      handleSuccess({ res, result: docs, message: '同步成功' });
    })
    .catch(function(err) {
      console.log('同步失败', err);
      handleError({ res, err, message: '同步失败' });
    });
    return handleSuccess({ res, result: duoshuo_comments, message: '同步成功' });
    */
  })
};




