[![banner](https://raw.githubusercontent.com/nevermined-io/assets/main/images/logo/banner_logo.png)](https://nevermined.io)

# Nevermined Secret Store Client
> 🔑JavaScript implementation of the parity secret store for use in Nevermined.

![Build](https://github.com/nevermined-io/secret-store-client-js/workflows/Build/badge.svg)
![NPM Package](https://github.com/nevermined-io/secret-store-client-js/workflows/NPM%20Release/badge.svg)
---

## Table of Contents

- [Introduction](#introduction)
- [Get started](#get-started)
   - [Usage](#usage)
- [Development](#development)
   - [Testing](#testing)
   - [Documentation](#documentation)
   - [Production build](#production-build)
   - [npm releases](#npm-releases)
- [License](#license)

---

## Introduction

This client abstracts the interface of the [Parity Secret Store](https://wiki.parity.io/Secret-Store) to just two methods `encryptDocument` and `decryptDocument`. It uses a local parity node to sign the generation of keys and stores them remotely into an instance of the secret store.

## Get started

Start by adding the package to your dependencies:

```bash
npm i @nevermined-io/secret-store-client
```

### Usage

To get a new instance of SecretStore do the following:

```ecmascript 6
import SecretStore from "@nevermined-io/secret-store-client"

const secretStore = new SecretStore({
    secretStoreUri: "https://secret-store.dev-nevermined.com", 
    parityUri: "http://localhost:8545",
    address: "0xed243adfb84a6626eba46178ccb567481c6e655d",
    password: "unittest",
    threshold: 2,
})
```

To encrypt a document do the following:

```ecmascript 6
const testDocument = {
    so: "nevermined",
    soWow: true,
}

// generate random 64 digit numerical id
const serverKeyId = generateRandomId()
/* this will:
 * - sign the given serverKeyId with the private key from the given address (unlocked with given password)
 * - generate a server key based in the given serverKeyId
 * - generate a document key derived from the server key
 * - store the document key in secret store
 * - encrypt the document and return it
 */
const encryptedDocument = await secretStore.encryptDocument(serverKeyId, testDocument)
```

To decrypt a document do the following:

```ecmascript 6
/* this will:
 * - sign the given serverKeyId with the private key from the given address (unlocked with given password)
 * - retrieve the document key from secret store
 * - decrypt the document and return it
 */
const decryptedDocument = await secretStore.decryptDocument(serverKeyId, encryptedDocument)
```

Now both documents are the same:

```ecmascript 6
assert(testDocument.so === decryptedDocument.so)
```

## Development

To start development you need to:

```bash
npm i
npm start
```

### Testing

Testing needs a local instance of parity client and secret store. You can spin up these services using [nevermined-io/tools](https://github.com/nevermined-io/tools):
```bash
git clone https://github.com/nevermined-io/tools
cd barge
bash -x start_nevermined.sh --latest --local-spree-node 2>&1 > start_nevermined.log &
```

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

## Attribution

This project is based in the Ocean Protocol [secret-store-client-js](https://github.com/oceanprotocol/secret-store-client-js).
It keeps the same Apache v2 License and adds some improvements. See [NOTICE file](NOTICE).

## License

```
Copyright 2020 Keyko GmbH
This product includes software developed at
BigchainDB GmbH and Ocean Protocol (https://www.oceanprotocol.com/)

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
```