---
title:
draft: false
tags:
created: "2025-11-12"
modified: "2025-11-12"
description: ""
---
## あとで書くこと

- [ ] テストの一部を実行する方法
- [ ] フィクスチャ
- [ ] パラメータ
- [ ] マーカー

---

## install

```bash
pip install -U pytest
```

## 命名規則

- テストファイルの名前は `test_<something>.py` あるいは `something_test.py` という形式にする。
- テストメソッドやテスト関数の名前は `test_<something>` という形式にする。
- テストクラスの名前は `Test<Something>` という形式にする。

## テスト実行

`assert` 式を用いてテストを行う。

```python
def func(x):
    return x + 1

def test_answer():
    assert func(3) == 5
```

複数のテストをクラスで包める。

```python
class TestClass:
    def test_one(self):
        x = "this"
        assert "h" in x

    def test_two(self):
        x = "hello"
        assert hasattr(x, "check")
```

例外をキャッチするには `pytest.raises()` を用いる。

```python
# https://docs.pytest.org/en/stable/how-to/assert.html#assertions-about-expected-exceptions

import pytest

def test_zero_division():
    with pytest.raises(ZeroDivisionError):
        1 / 0
        
def test_recursion_depth():
    with pytest.raises(RuntimeError) as excinfo:

        def f():
            f()

        f()
    assert "maximum recursion" in str(excinfo.value)

```

## テスト結果

- **PASSED**: 正常終了
- **FAILED**: 異常終了
- **SKIPPED**: テストがスキップされる。
- **XFAIL**: 失敗するはずのテストが想定通り失敗する。
- **XPASS: XFAIL** を想定していたはずが成功してしまったことを意味する。
- **ERROR**: 例外がテスト関数の中ではなく、フィクスチャやフック関数の実行中に発生したもの。

## References
pytest の公式ドキュメント

https://docs.pytest.org/en/stable/getting-started.html

[[notes/テスト駆動Python|テスト駆動Python]]

https://www.shoeisha.co.jp/book/detail/9784798177458

