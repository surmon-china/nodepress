/**
 * @file Disqus XML transform
 * @module module/disqus/xml
 * @author Surmon <https://github.com/surmon-china>
 */

import moment from 'moment'
import { Comment } from '@app/modules/comment/comment.model'
import { Article } from '@app/modules/article/article.model'
import { GUESTBOOK_POST_ID, CommentState } from '@app/constants/biz.constant'
import { getPermalinkByID } from '@app/transformers/urlmap.transformer'
import { getThreadIdentifierByID } from './disqus.constant'
import { ThreadState } from './disqus.dto'
import { APP } from '@app/app.config'

// DOC: https://help.disqus.com/en/articles/1717222-custom-xml-import-format

const getCommentItemXML = (comment: Comment) => {
  return `
    <wp:comment>
      <wp:comment_id>${comment.id}</wp:comment_id>
      <wp:comment_parent>${comment.pid || ''}</wp:comment_parent>
      <wp:comment_author>${comment.author.name || ''}</wp:comment_author>
      <wp:comment_author_email>${comment.author.email || ''}</wp:comment_author_email>
      <wp:comment_author_url>${comment.author.site || ''}</wp:comment_author_url>
      <wp:comment_author_IP>${comment.ip || ''}</wp:comment_author_IP>
      <wp:comment_date_gmt>${moment(comment.create_at).format('YYYY-MM-DD HH:mm:ss')}</wp:comment_date_gmt>
      <wp:comment_content><![CDATA[${comment.content || ''}]]></wp:comment_content>
      <wp:comment_approved>${comment.state === CommentState.Published ? 1 : 0}</wp:comment_approved>
    </wp:comment>
  `
}

export interface XMLItemData {
  article: Article
  comments: Array<Comment>
}
export const getDisqusXML = (data: XMLItemData[], guestbook: Array<Comment>) => {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <rss version="2.0"
      xmlns:content="http://purl.org/rss/1.0/modules/content/"
      xmlns:dsq="http://www.disqus.com/"
      xmlns:dc="http://purl.org/dc/elements/1.1/"
      xmlns:wp="http://wordpress.org/export/1.0/"
    >
      <channel>
        <item>
          <title>Guestbook</title>
          <link>${getPermalinkByID(GUESTBOOK_POST_ID)}</link>
          <content:encoded><![CDATA[${APP.FE_NAME}]]></content:encoded>
          <dsq:thread_identifier>${getThreadIdentifierByID(GUESTBOOK_POST_ID)}</dsq:thread_identifier>
          <wp:post_date_gmt>2017-01-01 00:00:00</wp:post_date_gmt>
          <wp:comment_status>open</wp:comment_status>
          ${guestbook.map(getCommentItemXML).join('\n')}
        </item>
        ${data
          .map(
            (item) => `
            <item>
              <title>${item.article.title}</title>
              <link>${getPermalinkByID(item.article.id)}</link>
              <content:encoded><![CDATA[${item.article.description || ''}]]></content:encoded>
              <dsq:thread_identifier>${getThreadIdentifierByID(item.article.id)}</dsq:thread_identifier>
              <wp:post_date_gmt>${moment(item.article.create_at).format('YYYY-MM-DD HH:mm:ss')}</wp:post_date_gmt>
              <wp:comment_status>${
                item.article.disabled_comment ? ThreadState.Closed : ThreadState.Open
              }</wp:comment_status>
              ${item.comments.map(getCommentItemXML).join('\n')}
            </item>
          `
          )
          .join('\n')}
      </channel>
    </rss>`
}
