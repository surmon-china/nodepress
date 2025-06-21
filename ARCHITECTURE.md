## v4.x Architecture Overview

### API Overview

**HTTP Status Codes** [`errors`](/src/errors)

- `400` — Request rejected due to business logic
- `401` — Authentication failed
- `403` — Forbidden / Admin role required
- `404` — Resource not found
- `405` — Method not allowed
- `500` — Internal server error
- `200` — OK
- `201` — Created

**Response Schema** [`response.interface.ts`](/src/interfaces/response.interface.ts)

- `status`
  - `success` — Successful response
  - `error` — Error occurred
- `message` — Always present; injected by [`responser.decorator.ts`](/src/decorators/responser.decorator.ts)
- `error` — Required when `status` is `error`, useful for debugging
- `debug` — Stack trace (only in development mode)
- `result` — Required when `status` is `success`
  - For entity: e.g. `{ title: '', content: '', ... }`
  - For list: e.g. `{ pagination: {...}, data: [...] }`

---

### Data Models

**General Structure**

- `extend` — Common extensible field used by models like `Article`, `Category`, and `Tag`, enabling backend customization. Inspired by [WordPress Assign custom fields](https://wordpress.org/documentation/article/assign-custom-fields/). See [`KeyValue Model`](src/models/key-value.model.ts).

**Key Fields**

- `_id` — MongoDB ObjectID, used for internal CRUD operations
- `id` — Auto-incremented numeric ID (MySQL-style), exposed to the frontend
- `pid` — Parent ID, used to model data relationships

**Data Sources**

- Persisted database records
- Computed business data (non-persistent), e.g. analytics
- Mongoose virtuals

---

### Application Structure

**Entrypoint Files**

- `main.ts` — Bootstraps app and global services
- `app.module.ts` — Root module aggregating all submodules
- `app.controller.ts` — Root controller
- `app.config.ts` — Configuration hub (database, app, third-party)
- `app.environment.ts` — Environment variables

**Request Lifecycle**

1. `request` — Incoming HTTP request
2. `middleware` — Preprocessing (CORS, origin checks)
3. `guard` — Authentication guards
4. `interceptor:before` — Input transformation (empty in this app)
5. `pipe` — Data validation and transformation; attaches payload to context
6. `controller` — Request handler logic
7. `service` — Business logic
8. `interceptor:after` — Output formatting and error handling
9. `filter` — Captures and handles thrown exceptions

**Authentication Flow**

1. Guard entry point: [`guards`](/src/guards)
2. `canActivate()` — Entry check
3. `JwtStrategy.validate()` — Calls [`jwt.strategy.ts`](/src/modules/auth/jwt.strategy.ts)
4. `handleRequest()` — Accept or reject based on validation result

**Access Control Levels**

- CUD (write) operations require tokens: [`AdminOnlyGuard`](/src/guards/admin-only.guard.ts)
- GET (read) operations auto-detect token presence: [`AdminMaybeGuard`](/src/guards/admin-maybe.guard.ts)

**Validation Rules**

- Invalid request data returns `400`: [`validation.pipe.ts`](/src/pipes/validation.pipe.ts)
- Unauthorized advanced queries return `403`: [`permission.pipe.ts`](/src/pipes/permission.pipe.ts)

---

### Core Components

**Exception Filter** [`error.filter.ts`](/src/filters/error.filter.ts)

**Interceptors** [`interceptors`](/src/interceptors)

- [Cache](/src/interceptors/cache.interceptor.ts): Adds TTL support
- [Transformer](/src/interceptors/transform.interceptor.ts): Formats successful service responses
- [Error](/src/interceptors/error.interceptor.ts): Catches service-layer exceptions
- [Logging](/src/interceptors/logging.interceptor.ts): Supplements global logging

**Decorators** [`decorators`](/src/decorators)

- [Cache](/src/decorators/cache.decorator.ts): Configure cache key/TTL
- [Response](/src/decorators/responsor.decorator.ts): Adds `message`, pagination, etc.
- [QueryParams](/src/decorators/queryparams.decorator.ts): Auto-validate and normalize params
- [Guest](/src/decorators/guest.decorator.ts): Extend sub-fields with metadata for `permission.pipe`

**Guards** [`guards`](/src/guards)

- Default: All non-GET requests require [`AdminOnlyGuard`](/src/guards/admin-only.guard.ts)
- Multi-role GET requests use [`AdminMaybeGuard`](/src/guards/admin-maybe.guard.ts)

**Middlewares** [`middlewares`](/src/middlewares)

- [`CORS`](/src/middlewares/cors.middleware.ts): Handles cross-origin requests
- [`Origin`](/src/middlewares/origin.middleware.ts): Blocks unknown sources

**Pipes** [`pipes`](/src/pipes)

- `validation.pipe` — Validates DTO schemas
- `permission.pipe` — Checks field-level permissions

**Feature Modules** [`modules`](/src/modules)

- `Announcement`, `Article`, `Category`, `Tag`, `Comment`, `Option`
- `Auth` — Global token and user auth
- `Vote` — Reaction logic (like/dislike)
- `Disqus` — Third-party integration
- `Archive` — Caching layer
- `Expansion`
  - Analytics
  - DB Backup (manual and scheduled)
  - Miscellaneous third-party services

**Global/Core Modules** [`processors`](/src/processors)

- [`database`](/src/processors/database) — DB connection and error handling
- [`cache`](/src/processors/cache) — Cache APIs and strategies
- [`helper`](/src/processors/helper):
  - [SEO Submission](/src/processors/helper/helper.service.seo.ts)
  - [Spam Detection](/src/processors/helper/helper.service.akismet.ts)
  - [Email Service](/src/processors/helper/helper.service.email.ts)
  - [IP Geolocation](/src/processors/helper/helper.service.ip.ts)
  - [AWS S3 Upload](/src/processors/helper/helper.service.aws.ts)
  - Google Service Credentials

---

## Special Considerations

### Google Indexing API

- [Quickstart Guide](https://developers.google.com/search/apis/indexing-api/v3/quickstart)

### Google OAuth

- OAuth Client ID and Service Account Key
- [OAuth Console](https://console.developers.google.com/apis/credentials)

### Google Analytics Embed API

- [Demo & Tools](https://ga-dev-tools.appspot.com/embed-api/)
- [GA Account Access](https://marketingplatform.google.com/home/accounts)
- [Google Analytics Data API](https://developers.google.com/analytics/devguides/reporting/data/v1)
