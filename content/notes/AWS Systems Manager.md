---
title:
draft: false
tags:
created: "2026-01-02"
modified:
description: ""
---

https://docs.aws.amazon.com/ja_jp/systems-manager/latest/userguide/what-is-systems-manager.html

> AWS Systems Manager では、オンプレミスでもマルチクラウド環境でも、AWS 内のノードを広範囲にわたって一元的に表示、管理、および運用できます。統合コンソールエクスペリエンスのリリースにより、Systems Manager では AWS アカウントと AWS リージョン全体にわたってよく使用するノードタスクを完了できるさまざまなツールが統合されています。

AWS Systems Manager は、複数のAWSリソースをグループ化し、グループ内リソースの運用データの一元化や運用タスクの自動化などができる管理サービスである。

Systems Manager は役割ごとに複数の機能で構成されている。例えばOSパッチの適用を自動化するPatch ManagerやAWSリソースの操作をランブックに従って自動実行するAutomationなどがある。

なお、Systems Managerを利用するにはリソースにSSM Agentの導入が必要である。
