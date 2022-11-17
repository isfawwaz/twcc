<div align="center">
<h1 id="toc">twcc</h1>
<p>Tailwind cli helper for converting tailwind config.</p>

<p align="center">
  <a href="#usage">Usage</a>  • 
  <a href="#api">API</a>  • 
  <a href="#contributors">Contributors</a> 
</p>

</div>

---

<div align="center">

<!-- prettier-ignore-start -->

[![GitHub Workflow Status (branch)](https://img.shields.io/github/workflow/status/isfawwaz/twcc/release/master)](https://github.com/isfawwaz/twcc/actions/workflows/release.yml?query=branch%3Amaster+)
[![Codecov branch](https://img.shields.io/codecov/c/github/isfawwaz/twcc/master)](https://app.codecov.io/gh/isfawwaz/twcc)
[![npm](https://img.shields.io/npm/v/twcc)](https://www.npmjs.com/package/twcc/v/latest)
[![npm downloads](https://img.shields.io/npm/dw/twcc)](https://www.npmjs.com/package/twcc/v/latest)
[![License](https://img.shields.io/github/license/isfawwaz/twcc)](https://github.com/isfawwaz/twcc/blob/master/LICENSE)
<!-- ALL-CONTRIBUTORS-BADGE:START - Do not remove or modify this section -->
[![All Contributors](https://img.shields.io/badge/all_contributors-1-orange.svg?style=flat-square)](#contributors-)
<!-- ALL-CONTRIBUTORS-BADGE:END -->

<!-- prettier-ignore-end -->

</div>

## Install

```
npm install -g twcc
# or
yarn global add twcc
# or
pnpm add -g twcc
```

## Usage

[\[Back to the Table of Contents\] ↑](#toc)

```
$ twcc --help
  Usage: twcc --config [relative_path] --destination [relative_path] --format [css|scss]

  Options:
        --help                Show help                                  [boolean]
        --version             Show version number                        [boolean]
    -c, --config              Tailwind config file path        [string] [required]
    -d, --destination         Path to save converted config file to, if split is
                              true then this will be folder name
                                                              [string] [required]
    -f, --format              Format to generate
                                      [string] [required] [choices: "css", "scss"]
        --prefix              variable prefix                             [string]
        --flat                Variable style (flat or nested map)        [boolean]
        --quoted-keys         Should map keys be quoted                  [boolean]
        --flatten-maps-after  After which level, should deeply nested maps be
                              flattened out. Defaults to -1 (always)      [number]
        --preserve-keys       Keys to preserve                             [array]
        --only-include-keys   Keys to include exclusivly                   [array]
        --split               File splitting                             [boolean]
  Examples:
    twcc --config tailwind.config.js --destination style --format css
    twcc -c tailwind.config.js -d style -f css --split
```

## Config

### -c, --config

Type: `string`\
Required: `true`

Tailwind config file path.

### -d, --destination

Type: `string`\
Required: `true`

Path to save converted config file to, if split is true then this will be folder name.

### -f, --format

Type: `string`\
Required: `true`\
Choice: `css|scss|sass`

Format to generate file.

### --prefix

Type: `string`\
Default: `null`

Used for adding prefix for variable name. Example from `--color` to `--prefix-color`.

### --flat

Type: `boolean`\
Default: `false`

Variable style (flat or nested map).

### --quoted-keys

Type: `boolean`\
Default: `false`

Should map keys be quoted.

### --flatten-maps-after

Type: `boolean`\
Default: `false`

After which level, should deeply nested maps be flattened out. Defaults to -1 (always).

### --preserve-keys

Type: `string[]`\
Default: `[]`

Keys to preserve.

### --only-include-keys

Type: `string[]`\
Default: `[]`\
Example: `['backgroundColor']`

Keys to include exclusivly.

### --split

Type: `boolean`\
Default: `false`

Enable exported config to be spliting into files.

## Contributors

[\[Back to the Table of Contents\] ↑](#toc)

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tbody>
    <tr>
      <td align="center" valign="top" width="14.28%"><a href="https://github.com/isfawwaz"><img src="https://avatars.githubusercontent.com/u/1292165?v=4?s=100" width="100px;" alt="Fawwaz"/><br /><sub><b>Fawwaz</b></sub></a><br /><a href="#ideas-isfawwaz" title="Ideas, Planning, & Feedback">🤔</a> <a href="#infra-isfawwaz" title="Infrastructure (Hosting, Build-Tools, etc)">🚇</a> <a href="#tool-isfawwaz" title="Tools">🔧</a> <a href="https://github.com/isfawwaz/twcc/commits?author=isfawwaz" title="Code">💻</a></td>
    </tr>
  </tbody>
  <tfoot>
    <tr>
      <td align="center" size="13px" colspan="7">
        <img src="https://raw.githubusercontent.com/all-contributors/all-contributors-cli/1b8533af435da9854653492b1327a23a4dbd0a10/assets/logo-small.svg">
          <a href="https://all-contributors.js.org/docs/en/bot/usage">Add your contributions</a>
        </img>
      </td>
    </tr>
  </tfoot>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

## License

[MIT](./LICENSE)
