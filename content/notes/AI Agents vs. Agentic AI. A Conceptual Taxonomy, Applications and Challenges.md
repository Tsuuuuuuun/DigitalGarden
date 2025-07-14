---
title:
draft: false
tags:
  - ai-agents
  - agentic-ai
  - multi-agent-systems
  - artificial-intelligence
  - research-paper
  - conceptual-framework
created: 2025-06-02
modified: 2025-06-16
description: ""
---
https://arxiv.org/abs/2505.10468

AI agent と Agentic AI について概念的に分類している。

ものすごくざっくり言えば、AI agent は「自律性」「タスク固有性」を持ち、perception-reasoning-action のループに従って、明確に定義されたドメイン内で独立して動作する。一方で、Agentic AI は、agent が**連携**して動作する **multi-agent な協調システム**を指す。これによって Agentic AI は AI agent 以上に複雑なタスクを解くことが期待される。

![](https://paper-assets.alphaxiv.org/figures/2505.10468/x5.png)

論文の Figure 7 が例としてわかりやすい。AI agent が示す温度維持システムは、目標温度を維持するために自律的に暖房または冷却システムを制御する。ユーザーの在室スケジュールを学習したり、不在時にエネルギー使用量を削減したりするなどの限られた自律性を示す一方で、孤立して作業し、広範な環境調整や目標推測に関与せず、単一の明確に定義されたタスクのみを実行する。
一方で Agentic AI が示すスマートホームは、天気予報、日々のスケジューリング、エネルギー料金の最適化、セキュリティ監視、バックアップ電源の起動など、多岐にわたる要素を管理する。これらのエージェントは単なる反応的なモジュールではなく、動的に通信し、メモリ状態を共有し、高次のシステム目標（例えば、リアルタイムでの快適性、安全性、エネルギー効率の最適化）に向かって協調的に行動を調整する。

**TODO: 各論を読む**

> [!question] AI agent, Agentic AI ともにかなり膨大な計算コストがかかるのでは？

> [!question] 一つでもポンコツな Agent が混じっているとうまくワークしないのでは？

> [!question] 学習は収束するのか？
> ただではうまくいかないような気がする。まあ応用例の論文を読んでいくしかない。

> [!question] 何をもってタスクがうまくいったと言い切るのだろうか
> Atari みたいなベンチマークタスクとかが存在する世界ではなさそう。
