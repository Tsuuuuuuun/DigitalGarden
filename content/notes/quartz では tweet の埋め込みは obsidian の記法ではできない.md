---
title:
draft: false
tags:
  - quartz
  - obsidian
  - tweet-embedding
  - markdown
  - web-publishing
  - platform-compatibility
created: 2025-06-01
modified: 2025-06-08
description: ""
---
Obsidian では以下のような書き方で tweet を埋め込むことが可能である。

```markdown
![](https://x.com/angura2718/status/1926967658613813437?ref_src=twsrc%5Etfw%22%3EMay)
```

![](https://x.com/angura2718/status/1926967658613813437?ref_src=twsrc%5Etfw%22%3EMay)
↑本当はここに表示されている。

だが、quartz 上ではそうはならないので、X から埋め込みを取得する必要がある。

```html
<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">バナナのナス、トウモロコシ</p>&mdash; あんぐら (@angura2718) <a href="[https://twitter.com/angura2718/status/1926967658613813437?ref_src=twsrc%5Etfw">May](https://twitter.com/angura2718/status/1926967658613813437?ref_src=twsrc%5Etfw%22%3EMay "https://twitter.com/angura2718/status/1926967658613813437?ref_src=twsrc%5Etfw\">May") 26, 2025</a></blockquote> <script async src="[https://platform.twitter.com/widgets.js](https://platform.twitter.com/widgets.js "https://platform.twitter.com/widgets.js")" charset="utf-8"></script>
```

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">バナナのナス、トウモロコシ</p>&mdash; あんぐら (@angura2718) <a href="https://twitter.com/angura2718/status/1926967658613813437?ref_src=twsrc%5Etfw">May 26, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

Obsidian の内部処理をうまいこと quartz に実装できればいいが、かなりめんどくさいのではないか？
