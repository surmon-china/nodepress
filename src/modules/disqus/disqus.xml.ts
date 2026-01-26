/**
 * @file Disqus XML transform
 * @module module/disqus/xml
 * @author Surmon <https://github.com/surmon-china>
 */

import dayjs from 'dayjs'
import { Article } from '@app/modules/article/article.model'
import { Comment } from '@app/modules/comment/comment.model'
import { CommentStatus } from '@app/modules/comment/comment.constant'
import { GUESTBOOK_POST_ID } from '@app/constants/biz.constant'
import { getPermalinkById } from '@app/transformers/urlmap.transformer'
import { getThreadIdentifierById } from './disqus.constant'
import { ThreadStatus } from './disqus.dto'
import { APP_BIZ } from '@app/app.config'

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
      <wp:comment_date_gmt>${dayjs(comment.created_at).format('YYYY-MM-DD HH:mm:ss')}</wp:comment_date_gmt>
      <wp:comment_content><![CDATA[${comment.content || ''}]]></wp:comment_content>
      <wp:comment_approved>${comment.status === CommentStatus.Published ? 1 : 0}</wp:comment_approved>
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
          <link>${getPermalinkById(GUESTBOOK_POST_ID)}</link>
          <content:encoded><![CDATA[${APP_BIZ.FE_NAME}]]></content:encoded>
          <dsq:thread_identifier>${getThreadIdentifierById(GUESTBOOK_POST_ID)}</dsq:thread_identifier>
          <wp:post_date_gmt>2017-01-01 00:00:00</wp:post_date_gmt>
          <wp:comment_status>open</wp:comment_status>
          ${guestbook.map(getCommentItemXML).join('\n')}
        </item>
        ${data
          .map(
            (item) => `
            <item>
              <title>${item.article.title}</title>
              <link>${getPermalinkById(item.article.id)}</link>
              <content:encoded><![CDATA[${item.article.summary || ''}]]></content:encoded>
              <dsq:thread_identifier>${getThreadIdentifierById(item.article.id)}</dsq:thread_identifier>
              <wp:post_date_gmt>${dayjs(item.article.created_at).format('YYYY-MM-DD HH:mm:ss')}</wp:post_date_gmt>
              <wp:comment_status>${
                item.article.disabled_comments ? ThreadStatus.Closed : ThreadStatus.Open
              }</wp:comment_status>
              ${item.comments.map(getCommentItemXML).join('\n')}
            </item>
          `
          )
          .join('\n')}
      </channel>
    </rss>`
}
