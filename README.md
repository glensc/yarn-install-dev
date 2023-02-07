# yarn-install-dev

Install selected packages from `devDependencies`.

This is to provide solution for [yarnpkg/yarn#5201] and [yarnpkg/yarn#3254].

[yarnpkg/yarn#5201]: https://github.com/yarnpkg/yarn/issues/5201
[yarnpkg/yarn#3254]: https://github.com/yarnpkg/yarn/issues/3254

## Installation

Recommended installation is to install as global.

```shell
npm install -g yarn-install-dev
```

## Usage

Install `typescript` version specified in `devDependencies`:

```shell
yarn-install-dev typescript
```

This will run `yarn install --frozen-lockfile --production` with modified `package.json`.
The `package.json` file is restored to original state after `yarn` execution.
