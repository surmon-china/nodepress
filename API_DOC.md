
## API Document

语法释义：

```ts
@JwtAuth

Get '/path/:id' ({ param? }): <ResultDataType>
```

- `Get` method, 请求类型
- `'/path/:id'` route param, 路由及路由参数
- `({ param? })` query params | body, 请求参数或提交数据体，两者互斥
- `<ResultDataType>` result data type, 请求返回的数据类型
- `@JwtAuth` required auth, 是否需要鉴权（默认为普通用户/无需鉴权，显式声明即为需要鉴权通过才可访问）

---

#### Root
  ```ts
  Get (): <APP_INFO>
  ```

#### Auth (auth)
  ```ts
  Get '/admin' (): <Auth>
  ```
  ```ts
  @JwtAuth

  Put '/admin' (Auth): <Auth>
  ```
  ```ts
  Post '/login' (AuthLogin): <ITokenResult>
  ```
  ```ts
  @JwtAuth

  Post '/check' (): <void>
  Post '/renewal' (): <ITokenResult>
  ```

#### Option (option)
  ```ts
  Get (): <Option>
  ```
  ```ts
  @JwtAuth

  Put (Option): <Option>
  ```

#### Announcement (announcement)
  ```ts
  Get ({ <common>?, state?, keyword? }): <Announcement[]>
  ```
  ```ts
  @JwtAuth

  Post (Announcement): <Announcement>
  ```
  ```ts
  @JwtAuth

  Delete (DelAnnouncements): <MongooseOpResult>
  ```
  ```ts
  @JwtAuth

  Put '/:id' (Announcement): <Announcement>
  ```
  ```ts
  @JwtAuth

  Delete '/:id' (): <MongooseOpResult>
  ```

#### Article (article)
  ```ts
  Get ({ <common>?, date?, public?, origin?, cache?, tag?, category?, keyword?, tag_slug?, category_slug? }): <Article[]>
  ```
  ```ts
  Get '/:id' (): <Article>
  ```
  ```ts
  @JwtAuth

  Put '/:id' (Article): <Article>
  ```
  ```ts
  @JwtAuth

  Delete '/:id' (): <MongooseOpResult>
  ```
  ```ts
  @JwtAuth

  Post (Article): <Article>
  ```
  ```ts
  @JwtAuth

  Patch (PatchArticles): <MongooseOpResult>
  ```
  ```ts
  @JwtAuth

  Delete (DelArticles): <MongooseOpResult>
  ```

#### Category (category)
  ```ts
  Get ({ <common>? }): <Category[]>
  ```
  ```ts
  Get '/:id' (): <Category[]>
  ```
  ```ts
  @JwtAuth

  Put '/:id' (Category): <Category>
  ```
  ```ts
  @JwtAuth

  Delete '/:id' (): <MongooseOpResult>
  ```
  ```ts
  @JwtAuth

  Post (Category): <Category>
  ```
  ```ts
  @JwtAuth

  Delete (DelCategories): <MongooseOpResult>
  ```

#### Tag (tag)
  ```ts
  Get ({ <common>?, cache?, keyword? }): <Tag[]>
  ```
  ```ts
  @JwtAuth

  Post (Tag): <Tag>
  ```
  ```ts
  @JwtAuth

  Put '/:id' (Tag): <Tag>
  ```
  ```ts
  @JwtAuth

  Delete '/:id' (): <MongooseOpResult>
  ```
  ```ts
  @JwtAuth

  Delete (DelTags): <MongooseOpResult>
  ```

#### Comment (comment)
  ```ts
  Get ({ <common>?, state?, post_id?, keyword? }): <Comment[]>
  ```
  ```ts
  Post (CreateCommentBase): <Comment>
  ```
  ```ts
  @JwtAuth

  Patch (PatchComments): <MongooseOpResult>
  ```
  ```ts
  @JwtAuth

  Delete (DelComments): <MongooseOpResult>
  ```
  ```ts
  @JwtAuth

  Get '/:id' (): <Comment>
  ```
  ```ts
  @JwtAuth

  Put '/:id' (Comment): <Comment>
  ```
  ```ts
  @JwtAuth

  Delete '/:id' (): <MongooseOpResult>
  ```

#### Syndication (syndication)
  ```ts
  Get '/sitemap' (): <SitemapXML>
  ```
  ```ts
  Get '/rss' (): <RSSXML>
  ```
  ```ts
  @JwtAuth

  Patch (): <void>
  ```

#### Like (like)
  ```ts
  Patch '/site' (): <boolean>
  ```
  ```ts
  Patch '/comment' (LikeComment): <boolean>
  ```
  ```ts
  Patch '/article' (LikeArticle): <boolean>
  ```

#### Expansion (expansion)
  ```ts
  Get '/statistic' (): <ITodayStatistic>
  ```
  ```ts
  @JwtAuth

  Get '/uptoken' (): <IUpToken>
  ```
  ```ts
  @JwtAuth

  Get '/google-token' (): <Credentials>
  ```
  ```ts
  @JwtAuth

  Patch '/database-backup' (): <void>
  ```
