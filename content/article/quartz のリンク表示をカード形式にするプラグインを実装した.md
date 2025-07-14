---
title: 
draft: false
tags:
  - quartz
  - fruit
created: 2025-06-15
modified: 2025-06-15
description: ""
---
https://github.com/Tsuuuuuuun/DigitalGarden/commit/e0f5ca1aed60ed8647cd3d5d429f389e93acc5f8

https://github.com/Tsuuuuuuun/DigitalGarden/commit/f2dc3f298a2849bbc7c49b02352d86d59427989c

<center><i>このように</i></center>

以下では **Quartz v4** のデフォルト構成に、外部リンクをカードで表示する “Link Card プラグイン” を組み込むまでの手順を解説します。

## Link Card プラグインとは

- ブログ記事やニュース URL を貼ると、自動で **OGP 画像・タイトル・抜粋** を取得してカード化してくれるやつです。NotionとかQiitaとかZennとかでみたことがあるかもしれません。
- Quartz は標準でカード UI を持たないため、自作プラグインで Markdown → HTML の変換を追加します。プラグイン機構の全体像は公式ドキュメント「[Making your own plugins](https://quartz.jzhao.xyz/advanced/making-plugins?utm_source=chatgpt.com)」が詳しいです。

Quartz のビルドは
1. Markdown → AST
2. **Transformer Plugin** で AST を編集
3. コンポーネントとレイアウトを合成
4. Lightning CSS / beforeDOMLoaded / afterBody スクリプト注入

という流れで行われます。Link Card は **2 と 4** の両方にフックします。

## 実装ステップ

https://github.com/gladevise/remark-link-card

これが下敷きになっているのでインストールしてください。

```bash
npm i remark-link-card
```

### transformer を実装

`quartz/plugins/transformers/linkcard.ts` を新規作成し、QuartzTransformerPlugin を返す関数を定義します。Markdown 内のリンクを検出し、`<a class="rlc-container" …>` に差し替えるロジックです。

```typescript title="quartz/plugins/transformers/linkcard.ts"
// @ts-ignore
import remarkLinkCard from "remark-link-card"
import { QuartzTransformerPlugin } from "../types"

export interface Options {
  cache?: boolean
  shortenUrl?: boolean
  showDescription?: boolean
}

const defaultOptions: Options = {
  cache: false,
  shortenUrl: false,
  showDescription: false,
}

export const LinkCard: QuartzTransformerPlugin<Partial<Options>> = (userOpts) => {
  const opts = { ...defaultOptions, ...userOpts }
  return {
    name: "LinkCard",
    markdownPlugins() {
      return [
        [
          remarkLinkCard,
          {
            cache: opts.cache,
            shortenUrl: opts.shortenUrl,
            showDescription: opts.showDescription,
          },
        ],
      ]
    },
  }
}
```

作成後、`quartz/plugins/transformers/index.ts` に追加してビルドに登録します。

### SCSS によるカードデザイン

```scss title="quartz/components/styles/linkcard.scss"
.rlc-container {
  display: flex;
  text-decoration: none;
  border: 1px solid var(--lightgray);
  border-radius: 12px;
  margin: 16px 0;
  background: var(--light);
  transition: all 0.2s ease;
  color: var(--darkgray);
  overflow: hidden;

  &:hover {
    border-color: var(--secondary);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
    text-decoration: none;
    color: var(--darkgray);
    transform: translateY(-2px);
  }

  .rlc-info {
    display: flex;
    flex-direction: column;
    justify-content: center;
    flex: 1;
    padding: 12px 16px;
    min-width: 0;
    gap: 4px;
  }

  .rlc-content {
    flex: 1;
  }

  .rlc-title {
    font-weight: 600;
    font-size: 1rem;
    line-height: 1.3;
    margin: 0 0 4px 0;
    color: var(--dark);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .rlc-description {
    display: none;
  }

  .rlc-url-container {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: var(--gray);
    margin: 0;
  }

  .rlc-favicon {
    width: 16px;
    height: 16px;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .rlc-url {
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }

  .rlc-image-container {
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--lightgray);
    position: relative;
    overflow: hidden;
    min-width: 120px; // 最小幅を設定
    max-width: 300px; // 最大幅を設定
    height: 120px; // 高さは固定
    width: auto; // 幅は画像に応じて自動調整

    &.image-failed {
      display: none;
    }
  }

  .rlc-image {
    width: auto;
    height: 100%;
    object-fit: cover;
    object-position: center;
    min-width: 100%; // コンテナの幅は最低限埋める
  }
}

@media (max-width: 768px) {
  .rlc-container {
    flex-direction: column;
    min-height: auto;
    margin: 12px 0;

    .rlc-info {
      padding: 16px;
    }

    .rlc-image-container {
      width: 100%;
      height: 160px;
      order: -1;
      max-width: none; // モバイルでは最大幅制限を解除

      &.image-failed {
        display: none;
      }
    }

    .rlc-title {
      font-size: 0.95rem;
    }

  }
}

@media (max-width: 480px) {
  .rlc-container {
    .rlc-info {
      padding: 12px;
    }

    .rlc-image-container {
      height: 140px;

      &.image-failed {
        display: none;
      }
    }

    .rlc-title {
      font-size: 0.9rem;
    }

    .rlc-url-container {
      font-size: 0.7rem;
    }
  }
}
```

### 画像エラーハンドラ

クライアント側で `<img>` の error イベントを捕まえ、親 `.rlc-image-container` に `image-failed` を付与するスクリプトを作成。

```typescript title="quartz/components/scripts/linkcard.inline.ts"
// Handle link card image failures
function handleLinkCardImages() {
  const linkCardImages = document.querySelectorAll('.rlc-image')
  
  linkCardImages.forEach((img: Element) => {
    const imgElement = img as HTMLImageElement
    const container = imgElement.closest('.rlc-image-container')
    
    if (!container) return
    
    // 画像が既に読み込みエラーの場合（complete=true かつ naturalWidth=0）
    if (imgElement.complete && imgElement.naturalWidth === 0) {
      container.classList.add('image-failed')
      return
    }
    
    // 画像読み込みエラー時のイベントリスナー
    const handleError = () => {
      container.classList.add('image-failed')
    }
    
    imgElement.addEventListener('error', handleError)
    window.addCleanup(() => imgElement.removeEventListener('error', handleError))
  })
}

// ページ読み込み時とナビゲーション時に実行
document.addEventListener('nav', handleLinkCardImages)
document.addEventListener('DOMContentLoaded', handleLinkCardImages)
```

beforeDOMLoaded フック経由で head にインライン挿入します。

### レイアウトにフック

空の JSX を返す `LinkCardHandler.tsx` を実装し、`handler.beforeDOMLoaded = linkCardScript` としてスクリプトを関連付け。

```typescript title="quartz/components/LinkCardHandler.tsx"
// @ts-ignore
import linkCardScript from "./scripts/linkcard.inline"
import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"

const LinkCardHandler: QuartzComponent = ({ displayClass, cfg }: QuartzComponentProps) => {
  return <></>
}

LinkCardHandler.beforeDOMLoaded = linkCardScript

export default (() => LinkCardHandler) satisfies QuartzComponentConstructor
```

`quartz/components/index.ts` でエクスポートし、`quartz.layout.ts` の `afterBody` 配列に `LinkCardHandler()` を追加するだけで全ページに適用されます。

あとは　`quartz.config.ts` の transformer セクションに LinkCard を追加すれば使えます。

## まとめ

これにて Quartz に Link Card を導入できました。やったね！
