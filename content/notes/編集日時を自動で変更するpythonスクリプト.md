---
title:
draft: false
tags:
  - python
created: 2025-06-03
modified: 2025-06-08
description: ""
---
更新日を手動で変更するのが面倒なので以下のようなスクリプトをつくった。

```python title="update_date.py"
import subprocess
import datetime
import re
import os
import sys

def get_changed_md_files():
    """
    最新コミット（HEAD）以降に編集された Markdown ファイル（追跡済み）を取得する。
    """
    try:
        # HEAD との diff で名前のみを取得
        result = subprocess.run(
            ['git', 'diff', '--name-only', 'HEAD', '--', '*.md'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
    except subprocess.CalledProcessError as e:
        print(f"Error: git diff failed:\n{e.stderr}", file=sys.stderr)
        sys.exit(1)

    # 改行で分割し、不空行のみをリスト化
    files = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    return files

def get_untracked_md_files():
    """
    未だ Git 管理下にない Markdown ファイル（新規作成ファイル）を取得する。
    """
    try:
        result = subprocess.run(
            ['git', 'ls-files', '--others', '--exclude-standard', '*.md'],
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            check=True
        )
    except subprocess.CalledProcessError as e:
        print(f"Error: git ls-files failed:\n{e.stderr}", file=sys.stderr)
        sys.exit(1)

    files = [line.strip() for line in result.stdout.splitlines() if line.strip()]
    return files

def update_frontmatter_modified(filepath, today_str):
    """
    指定されたファイル（Markdown）の YAML フロントマターを読み込み、
    modified: フィールドを today_str に置き換える。存在しなければ追加する。
    """
    # 1) ファイル全体を読み込み
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
    except Exception as e:
        print(f"Error: ファイルの読み込みに失敗しました: {filepath}\n{e}", file=sys.stderr)
        return False

    frontmatter_pattern = re.compile(r'^---\s*\n(.*?)\n---\s*\n?', re.DOTALL)
    match = frontmatter_pattern.match(content)

    if not match:
        # フロントマターが見つからない場合は何もしない
        print(f"Warning: フロントマターが見つかりませんでした: {filepath}", file=sys.stderr)
        return False

    fm_block = match.group(1)  # フロントマター内のテキスト（`---` と `---` の間）
    rest_of_content = content[match.end():]  # フロントマター以降の本文

    # 3) フロントマター内に modified: があるかどうかをチェック
    modified_pattern = re.compile(r'^\s*modified:\s*\d{4}-\d{2}-\d{2}\s*$', re.MULTILINE)
    if modified_pattern.search(fm_block):
        # 既存の modified: 値を置き換える
        fm_block_updated = modified_pattern.sub(f'modified: {today_str}', fm_block)
    else:
        # modified: が存在しないなら、フロントマター末尾に追加
        # ※フロントマター末尾直前に改行＋modified: を差し込むイメージ
        fm_block_updated = fm_block.rstrip() + f'\nmodified: {today_str}\n'

    # 4) 新しいコンテンツを組み立て
    new_content = f"---\n{fm_block_updated.rstrip()}\n---\n{rest_of_content}"

    # 5) ファイルを上書き保存
    try:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
    except Exception as e:
        print(f"Error: ファイルの書き込みに失敗しました: {filepath}\n{e}", file=sys.stderr)
        return False

    return True

def main():
    # 1) 「今日」の日付を取得（YYYY-MM-DD 形式）
    today_str = datetime.date.today().strftime('%Y-%m-%d')

    # 2) 変更対象の Markdown ファイルを収集
    changed_tracked = get_changed_md_files()      # 追跡済みで編集されたファイル
    new_untracked  = get_untracked_md_files()     # 新規（未追跡）のファイル

    # 重複を避けたリストにまとめる
    target_files = list(dict.fromkeys(changed_tracked + new_untracked))

    if not target_files:
        print("No Markdown files to update.")
        return

    print(f"Updating 'modified: {today_str}' in {len(target_files)} files...")

    # 3) 各ファイルをループして frontmatter を更新
    updated_count = 0
    for md in target_files:
        if not os.path.isfile(md):
            # 念のためファイル存在チェック
            print(f"Skip: ファイルが存在しません: {md}", file=sys.stderr)
            continue

        ok = update_frontmatter_modified(md, today_str)
        if ok:
            print(f"Updated: {md}")
            updated_count += 1

    print(f"Finished. {updated_count} files updated.")

if __name__ == '__main__':
    main()
```

なお、ファイル名が日本語の場合は以下のコマンドを打ち込んで、git に日本語を認識させる。

```bash
git config --local core.quotepath false
```

ついでに一日の作成ノートをコミットするスクリプトも書いた。

```bash title="daily_commit.sh"
#!/bin/bash
python update_date.py
date=$(date +%Y-%m-%d)

# すべての.mdファイル（tracked/untrackedを問わず）からdraft: falseを含むファイルを追加
find content/notes -name "*.md" -exec grep -l "draft: false" {} + | while IFS= read -r file; do
    echo "Adding: $file"
    git add "$file"
done

git commit -m "daily commit: $date"
```

week: [[weekly/2025-W23|2025-W23]]
