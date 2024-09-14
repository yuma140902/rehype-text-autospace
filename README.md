# rehype-text-autospace

[![CI](https://github.com/yuma140902/rehype-text-autospace/actions/workflows/CI.yml/badge.svg)](https://github.com/yuma140902/rehype-text-autospace/actions/workflows/CI.yml)

日本語と英語の間に自動で間隔を開ける [rehype](https://github.com/rehypejs/rehype) プラグインです。

## インストール

```sh
npm install rehype-text-autospace
```

## 使用方法

### [unified](https://github.com/unifiedjs/unified)

```js
import rehypeStringify from 'rehype-stringify'
import rehypeParse from 'rehype-parse'
import rehypeTextAutospace from 'rehype-text-autospace'
import { unified } from 'unified'

const file = await unified()
  .use(rehypeParse)
  .use(rehypeTextAutospace)
  .use(rehypeStringify)
  .process('あいうえおabcかきくけこ')

console.log(String(file))
```

### [Astro](https://astro.build/)

`astro.config.mjs`

```js
import { defineConfig } from "astro/config"

import rehypeTextAutospace from 'rehype-text-autospace'

export default defineConfig({
  // ...
  markdown: {
    rehypePlugins: [rehypeTextAutospace],
  },
  // ...
});
```

## 動作例

以下のマークダウンを処理した結果です。

```md
# rehype-text-autospaceとは

rehype-text-autospaceは日本語と英語の間に自動でスペースを入れる[rehype](https://github.com/rehypejs/rehype) Pluginです。

以下のような環境で使用できます。

- unifiedやAstro
```

rehype-text-autospace 無し

![without](https://github.com/user-attachments/assets/f900e514-3fc5-452b-a679-8aec7bbbef15)

rehype-text-autospace 有り

![with](https://github.com/user-attachments/assets/72ae0a4b-b570-4f95-a3c8-34fec543074d)

## API

### `Options` 型

プラグインの設定

- `padding`?: `string` - 日本語と英語の間にいれる間隔の大きさ。(Default: `".125em"`)
- `fullChars`?: `string` - 全角文字として扱う文字。(Default: `"\\p{Script=Hiragana}\\p{Script=Katakana}\\p{Script=Han}、。「」（）"`)
