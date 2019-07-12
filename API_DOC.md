
## API Document

语法释义：

```ts
Get '/path/:id' @xxxAuth ({ param? }): <DataType>
```

- `Get` method, 请求类型
- `'/path/:id'` route param, 路由及路由参数
- `@xxxAuth` auth type, 鉴权类型（默认为普通用户的鉴权/无鉴权，显式声明即为特殊鉴权）
- `({ param? })` query params | body, 请求参数或提交数据体，两者互斥
- `<DataType>` result data type, 请求返回的数据类型

---

#### Root
  ```ts
  Get (): <APP_INFO>
  ```

#### Auth
  ```ts
  Get '/admin' (): <Auth>
  ```
  ```ts
  Put '/admin' @AdminAuth (Auth): <Auth>
  ```
  ```ts
  Post '/login' (AuthLogin): <ITokenResult>
  ```
  ```ts
  Post '/check' @AdminAuth (): <void>
  ```

#### Option
  ```ts
  Get (): <Option>
  ```
  ```ts
  Put @AdminAuth (Option): <Option>
  ```

#### Announcement
  ```ts
  Get ({ <common>?, state?, keyword? }): <Announcement[]>
  ```
  ```ts
  Post @AdminAuth (Announcement): <Announcement>
  ```
  ```ts
  Delete @AdminAuth (DelAnnouncements): <MongooseOpResult>
  ```
  ```ts
  Put '/:id' @AdminAuth (Announcement): <Announcement>
  ```
  ```ts
  Delete '/:id' @AdminAuth (): <MongooseOpResult>
  ```

#### Article
  ```ts
  Get ({ <common>?, date?, public?, origin?, cache?, tag?, category?, keyword?, tag_slug?, category_slug? }): <Article[]>
  ```
  ```ts
  Get '/:id' (): <Article>
  ```
  ```ts
  Put '/:id' @AdminAuth (Article): <Article>
  ```
  ```ts
  Delete '/:id' @AdminAuth (): <MongooseOpResult>
  ```
  ```ts
  Post @AdminAuth (Article): <Article>
  ```
  ```ts
  Patch @AdminAuth (PatchArticles): <MongooseOpResult>
  ```
  ```ts
  Delete @AdminAuth (DelArticles): <MongooseOpResult>
  ```

#### Category
  ```ts
  Get ({ <common>? }): <Category[]>
  ```
  ```ts
  Get '/:id' (): <Category[]>
  ```
  ```ts
  Put '/:id' @AdminAuth (Category): <Category>
  ```
  ```ts
  Delete '/:id' @AdminAuth (): <MongooseOpResult>
  ```
  ```ts
  Post @AdminAuth (Category): <Category>
  ```
  ```ts
  Delete @AdminAuth (DelCategories): <MongooseOpResult>
  ```

#### Tag
  ```ts
  Get ({ <common>?, cache?, keyword? }): <Tag[]>
  ```
  ```ts
  Post @AdminAuth (Tag): <Tag>
  ```
  ```ts
  Put '/:id' @AdminAuth (Tag): <Tag>
  ```
  ```ts
  Delete '/:id' @AdminAuth (): <MongooseOpResult>
  ```
  ```ts
  Delete @AdminAuth (DelTags): <MongooseOpResult>
  ```

#### Comment
  ```ts
  Get ({ <common>?, state<CommentState>?, post_id?, keyword? }): <Comment[]>
  ```
  ```ts
  Post (CreateCommentBase): <Comment>
  ```
  ```ts
  Patch @AdminAuth (PatchComments): <MongooseOpResult>
  ```
  ```ts
  Delete @AdminAuth (DelComments): <MongooseOpResult>
  ```
  ```ts
  Get '/:id' @AdminAuth (): <Comment>
  ```
  ```ts
  Put '/:id' @AdminAuth (Comment): <Comment>
  ```
  ```ts
  Delete '/:id' @AdminAuth (): <MongooseOpResult>
  ```

#### Sitemap
  ```ts
  Get (): <SitemapXML>
  ```
  ```ts
  Patch @AdminAuth (): <void>
  ```

#### Like
  ```ts
  Patch '/site' (): <boolean>
  ```
  ```ts
  Patch '/comment' (LikeComment): <boolean>
  ```
  ```ts
  Patch '/article' (LikeArticle): <boolean>
  ```

#### Expansion
  ```ts
  Get '/constant' (): <object>
  ```
  ```ts
  Get '/statistic' (): <ITodayStatistic>
  ```
  ```ts
  Get '/github' (): <IGithubRepositorie[]>
  ```
  ```ts
  Patch '/github' @AdminAuth (): <IGithubRepositorie[]>
  ```
  ```ts
  Get '/uptoken' @AdminAuth (): <IUpToken>
  ```

#### Wallpaper
  ```ts
  Get '/list' (): <unknow>
  ```

#### Bilibili
  ```ts
  Get '/list' ({ page?, limit? }): <IBilibiliVideoList>
  ```
  ```ts
  Patch '/list' @AdminAuth (): <IBilibiliVideoList>
  ```

#### Music
  ```ts
  Get '/list/:id' ({ limit? }): <unknow>
  ```
  ```ts
  Get '/song/:id' (): <unknow>
  ```
  ```ts
  Get '/url/:id' (): <unknow>
  ```
  ```ts
  Get '/lrc/:id' (): <unknow>
  ```
  ```ts
  Get '/picture/:id' (): <unknow>
  ```
  ```ts
  Patch '/list' @AdminAuth (): <void>
  ```
