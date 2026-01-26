/**
 * @file Vote constants
 * @module module/vote/constant
 * @author Surmon <https://github.com/surmon-china>
 */

export enum VoteTarget {
  Article = 1,
  Comment = 2
}

export enum VoteType {
  Upvote = 1,
  Downvote = -1
}

export const voteTypesMap = new Map([
  [VoteType.Upvote, '+1'],
  [VoteType.Downvote, '-1']
])

export enum VoteAuthorType {
  Anonymous = 0,
  Guest = 1,
  Disqus = 2
}

export const VOTE_TYPES = [VoteType.Upvote, VoteType.Downvote] as const
export const VOTE_TARGETS = [VoteTarget.Article, VoteTarget.Comment] as const
export const VOTE_AUTHOR_TYPES = [VoteAuthorType.Anonymous, VoteAuthorType.Guest, VoteAuthorType.Disqus] as const
