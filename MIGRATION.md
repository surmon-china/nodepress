This migration guide provides the necessary MongoDB shell scripts to transition your data through major versions of NodePress.

---

## Migration Guide

### From v6 to v7

Version 7 introduces significant schema flattening, the move to a singleton pattern for core configurations, and the replacement of numeric constants with semantic strings.

#### Options & Admin

Enforce the singleton pattern and update blocklist field naming.

```javascript
// 1. Update Options: rename blocklist fields and enforce singleton
db.options.updateMany(
  {},
  {
    $rename: { 'blocklist.mails': 'blocklist.emails' },
    $set: { singleton: true }
  }
)

// 2. Update Admin: enforce singleton
db.admins.updateMany({}, { $rename: { avatar: 'avatar_url' }, $set: { singleton: true } })
```

#### Votes

Flatten the author structure and migrate numeric types to strings.

```javascript
// 1. Flatten author fields and remove legacy fields
db.votes.updateMany({}, [
  {
    $set: {
      author_name: '$author.name',
      author_email: '$author.email'
    }
  },
  { $unset: ['author'] }
])

// 2. Map target_type: 1 -> 'article', 2 -> 'comment'
db.votes.updateMany({ target_type: { $in: [1, 2] } }, [
  {
    $set: {
      target_type: {
        $switch: {
          branches: [
            { case: { $eq: ['$target_type', 1] }, then: 'article' },
            { case: { $eq: ['$target_type', 2] }, then: 'comment' }
          ],
          default: '$target_type'
        }
      }
    }
  }
])

// 3. author_type
db.votes.updateMany({ author_type: { $in: [0, 1, 2] } }, [
  {
    $set: {
      author_type: {
        $switch: {
          branches: [
            { case: { $eq: ['$author_type', 0] }, then: 'anonymous' },
            { case: { $eq: ['$author_type', 1] }, then: 'guest' },
            { case: { $eq: ['$author_type', 2] }, then: 'user' }
          ],
          default: '$author_type'
        }
      }
    }
  }
])
```

#### Feedbacks

Clean up legacy identifiers and align naming conventions.

```javascript
// 1. Remove legacy tid
db.feedbacks.updateMany({ tid: { $exists: true } }, { $unset: { tid: '' } })

// 2. Rename user to author for consistency
db.feedbacks.updateMany(
  { $or: [{ user_name: { $exists: true } }, { user_email: { $exists: true } }] },
  { $rename: { user_name: 'author_name', user_email: 'author_email' } }
)

// 3. author_type
// 3. Infer author_type based on the existence of author_name or author_email
db.feedbacks.updateMany({ author_type: { $exists: false } }, [
  {
    $set: {
      author_type: {
        $cond: {
          if: {
            $or: [
              { $ne: [{ $ifNull: ['$author_name', null] }, null] },
              { $ne: [{ $ifNull: ['$author_email', null] }, null] }
            ]
          },
          then: 'guest',
          else: 'anonymous'
        }
      }
    }
  }
])
```

#### Comments

Significant refactoring of parent-child relationships, target mapping, and author flattening.

```javascript
// 1. Rename core fields
db.comments.updateMany(
  {},
  {
    $rename: {
      pid: 'parent_id',
      post_id: 'target_id',
      agent: 'user_agent',
      'author.site': 'author.website'
    }
  }
)

// 2. Normalize parent_id: replace 0 with null for relational clarity
db.comments.updateMany({ parent_id: 0 }, { $set: { parent_id: null } })

// 3. Define target_type based on target_id (0 is Page, others are Article)
db.comments.updateMany({ target_id: 0 }, { $set: { target_type: 'page' } })
db.comments.updateMany({ target_id: { $ne: 0 } }, { $set: { target_type: 'article' } })

// 4. Flatten author object and remove it
db.comments.updateMany({ author: { $exists: true } }, [
  {
    $set: {
      author_name: { $ifNull: ['$author.name', ''] },
      author_email: '$author.email',
      author_website: '$author.website'
    }
  }
])
db.comments.updateMany({ author: { $exists: true } }, { $unset: { author: '' } })
db.comments.updateMany({ author_type: { $exists: false } }, { $set: { author_type: 'guest' } })
```

---

### From v5 to v6

This version focuses on standardizing the "extras" field across models and refining the article status and metadata structure.

#### Options

Cleanup and link structure refactoring.

```javascript
// Remove legacy meta field
db.options.updateMany({ meta: { $exists: true } }, { $unset: { meta: '' } })

// Update friend_links: value -> url
db.options.find({ 'friend_links.value': { $exists: true } }).forEach((doc) => {
  const updatedLinks = doc.friend_links.map((link) => ({
    name: link.name,
    url: link.value || ''
  }))
  db.options.updateOne({ _id: doc._id }, { $set: { friend_links: updatedLinks } })
})
```

#### Common Schema (Articles / Comments / Tags / Categories)

Standardizing the `extras` (formerly `extends`) field.

```javascript
// 1. Rename extends to extras
db.<table>.updateMany(
  { extends: { $exists: true } },
  { $rename: { extends: 'extras' } }
)

// 2. Normalize key-value pairs within extras
db.<table>.find({ 'extras.name': { $exists: true } }).forEach((doc) => {
  const updatedExtras = doc.extras.map((item) => {
    if (item.name !== undefined) {
      item.key = item.name
      delete item.name
    }
    return item
  })
  db.<table>.updateOne({ _id: doc._id }, { $set: { extras: updatedExtras } })
})

```

#### Articles

Comprehensive field renaming and status code migration.

```javascript
// 1. Batch rename metadata and status fields
db.articles.updateMany(
  {},
  {
    $rename: {
      meta: 'stats',
      state: 'status',
      description: 'summary'
    }
  }
)

// 2. Map legacy visibility: public: -1 becomes status: 2 (Private)
db.articles.updateMany({ public: -1 }, { $set: { status: 2 } })

// 3. Update language codes: mix -> mul
db.articles.updateMany({ lang: 'mix' }, { $set: { lang: 'mul' } })

// 4. Remove legacy access control fields
db.articles.updateMany({}, { $unset: { public: '', password: '' } })
```

#### Status Normalization (Announcements / Comments)

Aligning all state-based fields to the `status` naming convention.

```javascript
// Announcements & Comments: state -> status
db.announcements.updateMany({ state: { $exists: true } }, { $rename: { state: 'status' } })
db.comments.updateMany({ state: { $exists: true } }, { $rename: { state: 'status' } })

// Remove legacy is_top from comments
db.comments.updateMany({ is_top: { $exists: true } }, { $unset: { is_top: '' } })
```
