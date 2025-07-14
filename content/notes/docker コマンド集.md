---
title: 
draft: false
tags:
  - seed
created: 2025-06-16
modified: 2025-06-16
description: ""
---
概念と共に理解していく。

参考：

https://zenn.dev/suzuki_hoge/books/2022-03-docker-practice-8ae36c33424b59

[[notes/Docker&仮想サーバ完全入門|Docker&仮想サーバ完全入門]]

## container

コンテナ：アプリケーションとその依存関係をパッケージ化した実行環境。軽量で可搬性があるのが特徴。コンテナはホストOSのカーネルを共有するが、互いに分離されているので、アプリケーションは他のコンテナやホストシステムに影響を与えることはない。

イメージ：コンテナを作成するためのテンプレート

### run

コンテナの起動。イメージがダウンロードされていない場合、イメージをプルしてからコンテナを作成・実行する。

```bash
docker container run [option] <image> [command]
```

オプション

- `--publish`：ブラウザからの動作確認が行える。
- `-i`, `--intaractive`：コンテナの標準入力に接続する。
- `-t`, `--tty`：擬似ターミナルを与える。
- `-d`, `--detach`：バックグラウンドで実行する。
- `--name`：コンテナに名前をつける。
- `--platform`：イメージのアーキテクチャを明示する。

### stop

作成したコンテナを停止する。

```bash
docker container stop [option] <container>
```

### rm

作成したコンテナを削除する

```bash
docker container rm [option] <container>
```

コンテナ一覧の確認

```bash
docker ps [option]
```

起動していないコンテナを含めたコンテナ一覧の確認

```bash
docker container ls --all
```

コンテナの停止を経ずに削除する

```bash
docker container rm --force <container>
```

> コンテナは軽量で使い捨てがコンセプトなので「気軽に起動して用が済んだら削除する」「また使いたくなったら起動する」というスタンスがシンプルでよいと僕は思います。

## compose

Docker Compose とは、一度に複数のコンテナを作成・実行できるソフトウェアである。作成の際には YAML 形式のファイルが必要である。

一度に複数のコンテナを作るとき、`docker container` を用いると以下のようなコマンドになる。

```bash
docker container run --name mariadb01 -dit -v db-data:/var/lib/mysql -e MARIADB_ROOT_PASSWORD=rootpass -e MARIADB_DATABASE=testdb -e MARIADB_USER=test_user -e MARIADB_PASSWORD=testpass mariadb:10.7
```

 これを compose で実行するには、まず以下のような YAML ファイルを作成する。

```yaml title="compose.yaml"
services:
  web:
    image: httpd
    container_name: apache01
    ports:
      - "8080:80"
```

### up

コンテナの作成と実行

```bash
docker compose up -d
```

`-d` はコンテナをバックグラウンドで実行させるオプションである。

docker compose のプロジェクトを一覧表示したい場合は、`docker compose ls` コマンドを用いる。

### stop

コンテナを停止する。

```bash
docker compose stop
```

### start

作成済みのコンテナを起動する。

```bash
docker compose start
```

このコマンドは、作成済みのコンテナを起動するだけで、コンテナの作成は行わない。また、複数のコンテナがある場合はまとめて起動する。

インストールをせずともソフトウェアを簡単に試せることは、コンテナのメリットの一つである。

### cp

コンテナ内へファイルをコピーしたいときに用いる。これはコンテナが存在すれば実行可能（実行・停止を問わない）。

```bash
docker compose cp <host_file_path> <container_name>:<container_file_path>
```

<center><i>逆は割愛</i></center>

### down

作成したコンテナを削除する。

```bash
docker compose down
```

`docker compose rm` でもコンテナの削除は可能である。しかし、`rm` のほうはコンテナの削除のコマンドであり、紐づくネットワークの削除は行わない。また、基本的に実行中のコンテナに対しては `rm` は使用できない。

オプション

- `--rmi`：イメージを削除
- `-v`：volumes に記載したボリュームと、コンテナにアタッチされた匿名ボリュームを削除
- `--remove-orphans`：Docker Compose ファイルで定義されていないコンテナも削除

### down

コンテナの削除。

### exec

コンテナ内でコマンドを実行する。

```bash
docker compose exec <container-name> <command>
```

なお、コンテナ内でシェルを立ち上げてしまえば以降の作業はシェル内で行うことができる。

```bash
docker compose exec <container-name> /bin/bash
```
