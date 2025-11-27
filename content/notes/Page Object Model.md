---
title:
draft: false
tags:
created: "2025-11-27"
modified:
description: ""
---

UIテストにおけるデザインパターン。アプリの各ページをクラスとして切り出し、そのページに存在するUI要素や操作処理をメソッド化するパターン。

テストコード側では、個々のUI要素を直接触らずに、ページオブジェクトが提供するメソッドを呼び出すだけで操作ができる。

ディレクトリ構成の一例（引用：[テストコードの保守性を高めるPlaywrightのPage Object Model入門 〜Percy連携までの実践的アプローチ〜 | DevelopersIO](https://dev.classmethod.jp/articles/playwright-page-object-model-with-percy/)）

```
tests/
├── pages/
│   ├── base/
│   │   └── BasePage.ts        # 基底クラス
│   ├── selectors/
│   │   ├── LoginPageSelectors.ts
│   │   └── ProductPageSelectors.ts
│   ├── LoginPage.ts
│   └── ProductPage.ts
├── components/
│   ├── Header.ts
│   ├── Advertisement.ts
│   └── ResponsiveHelper.ts
└── specs/
    ├── login.spec.ts
    ├── product.spec.ts
    └── responsive.spec.ts

```
