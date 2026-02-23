/**
 * @file Global author constants
 * @module constants/author
 * @author Surmon <https://github.com/surmon-china>
 */

import type { OptionalAuthorDto } from '@app/dtos/author.dto'
import type { MongooseId, WithId } from '@app/interfaces/mongoose.interface'
import type { User } from '@app/modules/user/user.model'

export enum GeneralAuthorType {
  Anonymous = 'anonymous',
  Guest = 'guest',
  User = 'user'
}

export interface GeneralAuthor {
  user: MongooseId | null
  author_name: string | null
  author_email: string | null
  author_type: GeneralAuthorType
}

export const resolveGeneralAuthor = (author: OptionalAuthorDto, user?: WithId<User> | null): GeneralAuthor => {
  if (user?._id) {
    return {
      user: user._id,
      author_name: user.name ?? null,
      author_email: user.email ?? null,
      author_type: GeneralAuthorType.User
    }
  }

  if (author.author_email || author.author_name) {
    return {
      user: null,
      author_name: author.author_name ?? null,
      author_email: author.author_email ?? null,
      author_type: GeneralAuthorType.Guest
    }
  }

  return {
    user: null,
    author_name: null,
    author_email: null,
    author_type: GeneralAuthorType.Anonymous
  }
}
