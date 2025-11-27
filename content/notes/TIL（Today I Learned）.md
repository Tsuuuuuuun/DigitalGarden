---
title:
draft: false
tags:
created: 2025-11-09
modified:
description: ""
---

<blockquote class="twitter-tweet"><p lang="ja" dir="ltr">GitHub を活用して、<br>日々の学習の記録をつけていく習慣が、TIL<br><br>TIL（Today I Learned：今日学んだこと）は、<br>世界中の開発者の間で、10年以上前から行われている取り組み<br><br>学習の記録を GitHub リポジトリで管理することで、<br><br>- 単純に、記録を書くことで理解が深まる<br>- Git/GitHub… <a href="https://t.co/pz9gxnGEG0">pic.twitter.com/pz9gxnGEG0</a></p>&mdash; kazzyfrog (@kazzyfrog) <a href="https://twitter.com/kazzyfrog/status/1985682976542429270?ref_src=twsrc%5Etfw">November 4, 2025</a></blockquote> <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>

このサイトもこれに近い思想で作っている（ここ数ヶ月完全にサボっていたが）。

crontab を用いて自動で push するよう設定すれば管理が楽。

```bash title="auto-commit.sh"
#!/bin/bash

REPO_PATH="/Users/username/DigitalGarden"
TARGET_PATH="./content/notes"
DATE=$(date '+%Y-%m-%d')

echo "=== Auto commit script started at $DATETIME ==="

cd "$REPO_PATH" || exit 1

# format
npm run format

# content/notes の更新のみを毎日検知
if [[ -n $(git status -s "$TARGET_PATH") ]]; then
    echo "Changes detected in $TARGET_PATH"
    git add "$TARGET_PATH"
    git commit -m "Daily auto commit: $DATE"
    git push origin main
    echo "Successfully pushed changes to remote at $DATE"
else
    echo "No changes detected in $TARGET_PATH at $DATE"
fi
```

```bash
# ターミナル上で crontab を開く。
crontab -e

# 毎日午前3時に実行するために、以下のように書き込んで保存する。睡眠中など編集するはずがない時間を設定する。
55 23 * * * /Users/username/digital_garden/auto-commit.sh >> /Users/username/digital_garden/logs/auto-commit.log

```
