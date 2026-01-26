## Migration Guide

### From v5 to v6

This guide provides the necessary MongoDB shell scripts to migrate your data from NodePress v5 to v6.

#### Options

```javascript
// Remove the `options.meta` field and its data
db.options.updateMany({ meta: { $exists: true } }, { $unset: { meta: '' } })

// Refactor `options.friend_links` from `[{ name, value }]` to `[{ name, url }]`
db.options.find({ 'friend_links.value': { $exists: true } }).forEach((doc) => {
  const updatedLinks = doc.friend_links.map((link) => {
    return { name: link.name, url: link.value || '' }
  })
  db.options.updateOne({ _id: doc._id }, { $set: { friend_links: updatedLinks } })
})
```

#### Announcement

```javascript
// Rename `state` to `status`
db.announcements.updateMany({ state: { $exists: true } }, { $rename: { state: 'status' } })
```

#### KeyValueModel (Tags / Categories / Articles / Comments)

Applies to: `db.tags`, `db.categories`, `db.articles`, `db.comments`.

Replace `<table>` with the corresponding collection name.

```javascript
// 1. Rename `extends` field to `extras`
db.<table>.updateMany(
  { extends: { $exists: true } },
  { $rename: { extends: 'extras' } }
)

// 2. Rename property `name` to `key` within the `extras` array
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

#### Article

```javascript
// 1. Batch rename fields: meta -> stats, state -> status, description -> summary
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

// 2. Migrate private status: set status to 2 (Private) where public was -1
db.articles.updateMany({ public: -1 }, { $set: { status: 2 } })

// 3. Update language code: rename 'mix' to 'mul' (Multiple)
db.articles.updateMany({ lang: 'mix' }, { $set: { lang: 'mul' } })

// 4. Remove legacy fields: public and password
db.articles.updateMany(
  {},
  {
    $unset: {
      public: '',
      password: ''
    }
  }
)
```

#### Comment

```javascript
// 1. Rename `state` to `status`
db.comments.updateMany({ state: { $exists: true } }, { $rename: { state: 'status' } })

// 2. Remove legacy `is_top` field
db.comments.updateMany({ is_top: { $exists: true } }, { $unset: { is_top: '' } })
```
