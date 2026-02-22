import { CommentAuthorStatus } from './comment.constant'
import { CommentWith } from './comment.model'
import { User } from '@app/modules/user/user.model'

export const getCommentNotificationEmail = (commentWithUser: CommentWith<User>): string | null => {
  switch (commentWithUser.author_status) {
    case CommentAuthorStatus.Ghost:
      return null
    case CommentAuthorStatus.Active:
      return commentWithUser.user?.email ?? null
    case CommentAuthorStatus.Guest:
      return commentWithUser.author_email ?? null
    default:
      return null
  }
}
