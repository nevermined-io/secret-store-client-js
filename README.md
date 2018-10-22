[![banner](https://raw.githubusercontent.com/oceanprotocol/art/master/github/repo-banner%402x.png)](https://oceanprotocol.com)

# secret-store-client-js
> Javascript implementation of the parity secret store for use in ocean.

[![npm](https://img.shields.io/npm/v/@oceanprotocol/secret-store-client-js.svg)](https://www.npmjs.com/package/@oceanprotocol/secret-store-client-js)
[![Travis (.com)](https://img.shields.io/travis/com/oceanprotocol/secret-store-client-js.svg)](https://travis-ci.com/oceanprotocol/secret-store-client-js)
[![GitHub contributors](https://img.shields.io/github/contributors/oceanprotocol/secret-store-client-js.svg)](https://github.com/oceanprotocol/secret-store-client-js/graphs/contributors)
[![Codacy Badge](https://api.codacy.com/project/badge/Grade/8508313231b44b0997ec84898cd6f9db)](https://app.codacy.com/app/ocean-protocol/secret-store-client-js?utm_source=github.com&utm_medium=referral&utm_content=oceanprotocol/secret-store-client-js&utm_campaign=Badge_Grade_Settings)
[![js oceanprotocol](https://img.shields.io/badge/js-oceanprotocol-7b1173.svg)](https://github.com/oceanprotocol/eslint-config-oceanprotocol) 
[![Greenkeeper badge](https://badges.greenkeeper.io/oceanprotocol/secret-store-client-js.svg)](https://greenkeeper.io/)

---

## Table of Contents

  - [Get started](#get-started)
  - [Development](#development)
    - [Testing](#testing)
    - [Documentation](#documentation)
    - [Production build](#production-build)
    - [npm releases](#npm-releases)
  - [License](#license)

---

## Get started

Start by adding the package to your dependencies:

```bash
npm i @oceanprotocol/secret-store-client
```

## Development

To start development you need to:

```bash
npm i
npm start
```

### Testing

Testing needs a local instance of parity installed. You get one docker instance of it by calling:
```bash
chmod +x ./parity/parity.sh && ./parity/parity.sh
```

This will create docker container named `secretstore-parity`

To start test you need to:

```bash
npm run test
```

To run a single testsuite `ParityClient` for example:

```bash
npm run test -- -g "ParityClient"
```

To watch tests

```bash
npm run test:watch
```

This will start a watcher for changes of the code.

To create code coverage
```bash
npm run test:cover
```

### Documentation

To create code documentation
```bash
npm run doc
```

### Production build

```bash
npm run build
```

### npm releases

For a new **patch release**, execute on the machine where you're logged into your npm account:

```bash
npm run release
```

In case you have 2FA setup on npm.js, pass a code as One Time Password:

```bash
npm run release --otp <yourcode>
```

Command is powered by [`release-it`](https://github.com/webpro/release-it) package, defined in the `package.json`.

That's what the command does without any user interaction:

- create release commit by updating version in `package.json`
- create tag for that release commit
- push commit & tag
- create a new release on GitHub, with change log auto-generated from commit messages
- publish to npm as a new release

If you want to create a **minor** or **major release**, use these commands:

```bash
npm run release-minor
```

```bash
npm run release-major
```

## License

```
Copyright 2018 Ocean Protocol Foundation Ltd.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
