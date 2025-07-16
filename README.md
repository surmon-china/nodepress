<br />

<p align="center">
  <a href="https://github.com/surmon-china/nodepress" target="blank">
    <img src="https://raw.githubusercontent.com/surmon-china/nodepress/main/branding/logo.png" height="118" alt="nodepress Logo" />
  </a>
</p>

# NodePress

[![nodepress](https://raw.githubusercontent.com/surmon-china/nodepress/main/branding/badge.svg)](https://github.com/surmon-china/nodepress)
&nbsp;
[![GitHub stars](https://img.shields.io/github/stars/surmon-china/nodepress.svg?style=for-the-badge)](https://github.com/surmon-china/nodepress/stargazers)
&nbsp;
[![GitHub issues](https://img.shields.io/github/issues-raw/surmon-china/nodepress.svg?style=for-the-badge)](https://github.com/surmon-china/nodepress/issues)
&nbsp;
[![Uptime Robot ratio (30 days)](https://img.shields.io/uptimerobot/ratio/m791570584-8027b44860687b0ac0af7b4c?style=for-the-badge)](https://stats.uptimerobot.com/Q2k7OTXxJN/791570584)
&nbsp;
[![GitHub license](https://img.shields.io/github/license/surmon-china/nodepress.svg?style=for-the-badge)](/LICENSE)

**RESTful API service for [surmon.me](https://github.com/surmon-china/surmon.me) blog, powered by [NestJS](https://github.com/nestjs/nest), required [MongoDB](https://www.mongodb.com/) & [Redis](https://redis.io/).**

适用于 [surmon.me](https://github.com/surmon-china/surmon.me) 的 RESTful API 服务端应用；基于 [NestJS](https://github.com/nestjs/nest) 开发，需安装 [MongoDB](https://www.mongodb.com/) 和 [Redis](https://redis.io/) 方可完整运行。

- [Changelog](/CHANGELOG.md#changelog)
- [API Documentation](https://github.surmon.me/nodepress)
- [Architecture Documentation](/ARCHITECTURE.md)

**Related [Projects](https://github.com/stars/surmon-china/lists/surmon-me)**

- **SSR Blog:** [`surmon.me`](https://github.com/surmon-china/surmon.me) powered by Vue(3)
- **Blog admin:** [`surmon.admin`](https://github.com/surmon-china/surmon.admin) powered by React & [`Veact`](https://github.com/veactjs/veact)
- **Blog native app:** [`surmon.me.native`](https://github.com/surmon-china/surmon.me.native) powered by react-native

---

### Development

```bash
$ pnpm install

# dev
$ pnpm run start:dev

# test
$ pnpm run lint
$ pnpm run test
$ pnpm run test:watch
$ pnpm run test:cov

# build
$ pnpm run build

# run
$ pnpm run start:prod
```

### Actions

- Any PR open → `CI:Build test`
- New tag `v*` → `CI:Create release`
- Release created → `CI:Deploy` → `CI:Execute server deploy script`

### TODO

- About ES Modules support [#13319](https://github.com/nestjs/nest/issues/13319) / [#13817](https://github.com/nestjs/nest/issues/13817)

### Changelog

Detailed changes for each release are documented in the [release notes](/CHANGELOG.md).

### License

Licensed under the [MIT](/LICENSE) License.
