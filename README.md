<br />

<p align="center">
  <a href="https://github.com/surmon-china/nodepress" target="blank">
    <img src="https://raw.githubusercontent.com/surmon-china/nodepress/main/logo.png" height="90" alt="nodepress Logo" />
  </a>
</p>

# NodePress

[![nodepress](https://raw.githubusercontent.com/surmon-china/nodepress/main/badge.svg)](https://github.com/surmon-china/nodepress)
&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/nodepress.svg?style=for-the-badge)](https://github.com/surmon-china/nodepress/stargazers)
&nbsp;
[![GitHub issues](https://img.shields.io/github/issues-raw/surmon-china/nodepress.svg?style=for-the-badge)](https://github.com/surmon-china/nodepress/issues)
&nbsp;
[![GitHub Workflow Status](https://img.shields.io/github/workflow/status/surmon-china/nodepress/Deploy?label=deploy&style=for-the-badge)](https://github.com/surmon-china/nodepress/actions?query=workflow:%22Deploy%22)
&nbsp;
[![GitHub license](https://img.shields.io/github/license/surmon-china/nodepress.svg?style=for-the-badge)](/LICENSE)

**RESTful API service for [surmon.me](https://github.com/surmon-china/surmon.me) blog, powered by [NestJS](https://github.com/nestjs/nest), required [MongoDB](https://www.mongodb.com/) & [Redis](https://redis.io/).**

**适用于 [surmon.me](https://github.com/surmon-china/surmon.me) 的 RESTful API 服务端应用；基于 [NestJS](https://github.com/nestjs/nest)，需安装 [MongoDB](https://www.mongodb.com/) 和 [Redis](https://redis.io/) 方可完整运行。**

- [CHANGELOG](/CHANGELOG.md#changelog)
- [API documentation](https://github.surmon.me/nodepress)
- [Architecture documentation](/DOCUMENTATION.md)

---

**🔥 [Related projects](https://github.com/stars/surmon-china/lists/surmon-me)**

- **SSR Blog:** [`surmon.me`](https://github.com/surmon-china/surmon.me) powered by Vue(3)
- **Blog admin:** [`veact-admin`](https://github.com/surmon-china/veact-admin) powered by React & [`Veact`](https://github.com/veactjs/veact)
- **Blog native app:** [`surmon.me.native`](https://github.com/surmon-china/surmon.me.native) powered by react-native

### Development Setup

```bash
$ yarn

# dev
$ yarn start:dev

# test
$ yarn lint
$ yarn test
$ yarn test:e2e
$ yarn test:cov
$ yarn test:watch

# build
$ yarn build

# run
$ yarn start:prod
```

### Actions setup

- `Any PR open` → `CI:Build test`
- `New tag v*` → `CI:Create release`
- `Create create` → `CI:Deploy` → `CI:Execute server script`

### Changelog

Detailed changes for each release are documented in the [release notes](/CHANGELOG.md).

### License

Licensed under the [MIT](/LICENSE) License.
